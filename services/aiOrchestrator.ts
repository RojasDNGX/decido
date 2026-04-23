import { AnalysisResult } from '@/types';

const OLLAMA_URL = 'http://10.10.0.9:11434/api/generate';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const TIMEOUT_MS = 12000;

const LOCAL_MODELS = [
  'gemma4:e4b',
  'gemma3:4b',
  'phi4:14b'
];

async function tryOllama(model: string, prompt: string): Promise<AnalysisResult> {
  const isFastModel = model.includes('gemma');
  const timeoutLimit = isFastModel ? 6000 : 12000;
  
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
          num_predict: 250, // Reduced for gemma4 optimization
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
    if (!parsed.tasks || !parsed.recommended_action) throw new Error('Invalid JSON structure');

    return parsed;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

async function tryGroq(prompt: string): Promise<AnalysisResult> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY not configured');

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
        response_format: { type: 'json_object' },
        max_tokens: 250
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) throw new Error(`Groq error: ${response.status}`);

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) throw new Error('Groq returned empty response');

    return JSON.parse(content) as AnalysisResult;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

function validateLanguage(text: string): boolean {
  // Detect common English transition words or indicators
  const englishIndicators = [
    ' because ', ' however ', ' therefore ', ' task ', ' priority ', 
    ' recommended ', ' action ', ' high ', ' medium ', ' low ',
    ' first ', ' should ', ' because ', ' is ', ' the ', ' and '
  ];
  
  // We check if at least 2 common English words are present to avoid false positives 
  // (though the prompt is already Portuguese, models sometimes "leak" English in JSON values)
  const lowerText = text.toLowerCase();
  let matches = 0;
  for (const word of englishIndicators) {
    if (lowerText.includes(word)) {
      matches++;
    }
    if (matches >= 3) return false; // Fail if too much English
  }
  
  return true;
}

export async function aiOrchestrator(input: string): Promise<AnalysisResult> {
  // Optimized Prompt (Reduced Size) with Language Enforcement
  const prompt = `Responda exclusivamente em português do Brasil (pt-BR). É proibido utilizar qualquer palavra em inglês.
  
You are a decisive assistant. Analyze these tasks and decide what to do first.

MANDATORY RULES:
1. Urgent/High Risk → "high".
2. High Impact/No Urgency → "medium".
3. Flexible/Optional → "low".
4. Differentiate priorities clearly.
5. Direct, confident language. No "it depends".

RECOMMENDED ACTION:
One single, clear, decisive sentence starting with a verb.

OUTPUT FORMAT (STRICT JSON):
{
"tasks": [{"name": "string", "priority": "high|medium|low", "reason": "short explanation"}],
"recommended_action": "decisive sentence"
}

USER INPUT:
${input}`;

  // Try Local Ollama Models
  for (const model of LOCAL_MODELS) {
    try {
      console.log(`[Orchestrator] Attempting model: ${model}`);
      const result = await tryOllama(model, prompt);
      
      // Validate Language
      const contentString = JSON.stringify(result);
      if (!validateLanguage(contentString)) {
        console.log(`[Orchestrator] Invalid language detected in ${model} — retrying with fallback`);
        continue; // Trigger fallback
      }

      console.log(`[Orchestrator] Success with model: ${model}`);
      return result;
    } catch (error: any) {
      console.warn(`[Orchestrator] Model ${model} failed:`, error.message);
      // Continue to next model
    }
  }

  // Try Groq External Fallback
  try {
    console.log(`[Orchestrator] Attempting Groq fallback`);
    const result = await tryGroq(prompt);
    
    // Final validation
    if (!validateLanguage(JSON.stringify(result))) {
       console.warn(`[Orchestrator] Groq leaked English, but it's the last fallback.`);
    }

    console.log(`[Orchestrator] Success with Groq fallback`);
    return result;
  } catch (error: any) {
    console.error(`[Orchestrator] All providers failed:`, error.message);
    throw new Error('Não foi possível processar a análise no momento.');
  }
}

// Model Warm-up: Try to load gemma4:e4b on module load
if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'test') {
  console.log('[Orchestrator] Initializing warm-up with gemma4:e4b...');
  tryOllama('gemma4:e4b', 'Warm up request. Respond with empty JSON: {}')
    .then(() => console.log('[Orchestrator] Warm-up successful'))
    .catch((e) => console.warn('[Orchestrator] Warm-up skipped/failed:', e.message));
}
