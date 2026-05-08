/**
 * orchestrator.ts — AI routing only.
 *
 * Responsibilities:
 * - Select the correct plan prompt (free / pro / enterprise)
 * - Gate history server-side (FREE receives no history regardless of client input)
 * - Route request through local models (Ollama) with Groq as fallback
 * - Validate basic structural integrity of model output
 *
 * This file contains NO decision logic.
 * All intelligence lives in services/ai/prompts/{plan}.ts
 */

import { AnalysisResult, Plan } from '@/types';
import { buildLayeredPrompt } from './prompts/builder';
import { isOverloadInput, buildOverloadResponse, buildOverloadResponseFree } from './overload';

const OLLAMA_URL = 'http://10.10.0.9:11434/api/generate';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

const LOCAL_MODELS = [
  'gemma4:e4b',
  'gemma3:4b',
  'phi4:14b'
];

type HistoryItem = { input_summary: string; primary_action: string };

async function tryOpenRouter(prompt: string): Promise<AnalysisResult> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('OPENROUTER_API_KEY not configured');

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://decido.app',
        'X-Title': 'Decido',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-lite-001',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
        response_format: { type: 'json_object' },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) throw new Error(`OpenRouter error: ${response.status}`);

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) throw new Error('OpenRouter returned empty response');

    return JSON.parse(content) as AnalysisResult;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

async function tryOllama(model: string, prompt: string): Promise<AnalysisResult> {
  const timeoutLimit = 6000; // Retornado para 6s conforme solicitado

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutLimit);

  try {
    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: model,
        prompt: prompt,
        stream: false,
        format: 'json',
        options: {
          temperature: 0.2,
          num_predict: 250,
        }
      }),
      signal: controller.signal,
      cache: 'no-store',
    });

    clearTimeout(timeoutId);

    if (!response.ok) throw new Error(`Ollama ${model} error: ${response.status}`);

    const data = await response.json();
    const rawContent = data.response;

    if (!rawContent) throw new Error(`Ollama ${model} returned empty response`);

    // Sanitize JSON
    let sanitized = rawContent.trim();
    const firstBrace = sanitized.indexOf('{');
    const lastBrace = sanitized.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      sanitized = sanitized.substring(firstBrace, lastBrace + 1);
    }

    const parsed = JSON.parse(sanitized) as AnalysisResult;
    if (!parsed.primary_action || !parsed.priorities) throw new Error('Invalid JSON structure');

    return parsed;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

async function tryGroq(prompt: string): Promise<AnalysisResult> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY not configured');

  const models = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'];

  let lastError: any = null;

  for (const model of models) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    try {
      const response = await fetch(GROQ_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.1,
          response_format: { type: 'json_object' },
          max_tokens: 250
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.status === 429) {
        console.warn(`[Orchestrator] Groq model ${model} rate limited (429). Trying next...`);
        continue;
      }

      if (!response.ok) throw new Error(`Groq ${model} error: ${response.status}`);

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) throw new Error(`Groq ${model} returned empty response`);

      return JSON.parse(content) as AnalysisResult;
    } catch (error) {
      clearTimeout(timeoutId);
      lastError = error;
      console.warn(`[Orchestrator] Groq model ${model} failed:`, error instanceof Error ? error.message : error);
    }
  }

  throw lastError || new Error('All Groq models failed');
}

function validateLanguage(text: string): boolean {
  const englishIndicators = [
    ' because ', ' however ', ' therefore ', ' task ', ' priority ',
    ' recommended ', ' action ', ' high ', ' medium ', ' low ',
    ' first ', ' should ', ' because ', ' is ', ' the ', ' and '
  ];

  const lowerText = text.toLowerCase();
  let matches = 0;
  for (const word of englishIndicators) {
    if (lowerText.includes(word)) {
      matches++;
    }
    if (matches >= 3) return false;
  }

  return true;
}

function validatePrimaryAction(action: string): boolean {
  if (!action) return false;

  const words = action.trim().split(/\s+/);
  if (words.length < 4) return false;

  const lowerAction = action.toLowerCase();

  const forbiddenSequences = [',', 'depois', 'then', 'and then', 'em seguida', 'por fim', 'após'];
  for (const seq of forbiddenSequences) {
    if (lowerAction.includes(seq)) return false;
  }

  const contextualWords = [
    'para', 'porque', 'pois', 'agora', 'hoje', 'antes', 'já',
    'vence', 'evitar', 'garantir', 'permitir', 'assim', 'urgente',
    'risco', 'impede', 'atrasa', 'impacto', 'prazo',
  ];
  const hasContext = contextualWords.some(w => lowerAction.includes(w));
  if (!hasContext) return false;

  return true;
}

export async function aiOrchestrator(
  input: string,
  history?: HistoryItem[],
  plan: Plan = 'free'
): Promise<AnalysisResult> {
  const safeHistory = plan === 'free' ? undefined : history;
  const prompt = buildLayeredPrompt(plan, input, safeHistory);

  // 1. Tentativa Local (Ollama) - Timeout 6s
  const primaryModel = LOCAL_MODELS[0]; 
  try {
    const result = await tryOllama(primaryModel, prompt);
    const contentString = JSON.stringify(result);
    if (validateLanguage(contentString) && 
        (!result.primary_action || validatePrimaryAction(result.primary_action)) &&
        (result.priorities && result.priorities.length >= 2)) {
      return result;
    }
  } catch (error) {
    console.warn(`[Orchestrator] Ollama ${primaryModel} failed. Falling back to Cloud.`);
  }

  // 2. Fallback Principal Cloud (OpenRouter)
  try {
    return await tryOpenRouter(prompt);
  } catch (error) {
    console.warn(`[Orchestrator] OpenRouter failed. Falling back to Groq:`, error);
  }

  // 3. Fallback de Segurança (Groq)
  try {
    return await tryGroq(prompt);
  } catch (error: unknown) {
    console.error(`[Orchestrator] All providers failed:`, error instanceof Error ? error.message : error);
    throw new Error('Não foi possível processar a análise no momento.');
  }
}




// Model Warm-up
if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'test') {
  tryOllama('gemma4:e4b', 'Warm up request. Respond with empty JSON: {}').catch(() => {});
}
