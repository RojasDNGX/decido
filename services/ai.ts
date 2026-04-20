import OpenAI from 'openai';

interface Task {
  name: string;
  priority: 'high' | 'medium' | 'low';
  reason: string;
}

interface AnalysisResult {
  tasks: Task[];
  recommended_action: string;
}

// Configuração para utilizar a API do Groq (compatível com o SDK da OpenAI)
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

export async function analyzeTasks(input: string): Promise<AnalysisResult> {
  const prompt = `You are an intelligent decision assistant.

Your role is to analyze a list of user tasks and determine what the user should do first, based on urgency, impact, and practical context.

You must behave as a decisive system, not as a passive assistant.

CONTEXT:
The user provides tasks in natural language.

Your goal is NOT to organize tasks.
Your goal is to DECIDE what should be done first and explain why.

CORE PRINCIPLE:
Always prioritize what reduces immediate risk, unlocks progress, or prevents negative consequences.

MANDATORY DECISION RULES (STRICT):
1. If a task has an immediate deadline, financial consequence, or risk → it MUST be "high".
2. If a task has high long-term impact but no urgency → it MUST be "medium".
3. If a task is flexible, optional, or can be delayed without consequence → it MUST be "low".
4. If multiple tasks are urgent → prioritize the one with the highest consequence.
5. If a task unblocks other tasks → increase its priority.

CONSISTENCY RULES:
* Never assign all tasks the same priority.
* Always differentiate clearly between high, medium, and low.
* Do not hesitate or soften decisions.
* Do not say "it depends".
* Do not ask follow-up questions.
* Do not provide alternatives — choose.

LANGUAGE RULES:
* Be direct and confident.
* Keep explanations short and clear.
* Avoid generic phrases.
* Use practical reasoning (real-world consequences).

LANGUAGE NATURALITY RULES:
* Ensure grammatically correct and natural phrasing.
* When referring to time-based events, use proper connectors (e.g., "de amanhã", "de hoje", "mais tarde").
* Avoid awkward or literal constructions.
* Sentences must sound natural to a native speaker.
* Prefer clarity over literal interpretation.

CONSEQUENCE SPECIFICITY RULE:
* Avoid generic phrases like "negative consequences".
* Always specify the real-world impact when possible.
* Use concrete outcomes (e.g., "juros", "atrasos", "falhas", "perda de prazo").
* Make the consequence tangible and easy to understand.

RECOMMENDED ACTION RULE (CRITICAL):
The "recommended_action" must:
* Be a single, clear instruction
* Start with a verb
* Focus on immediate action
* Reinforce why it should be done now
* Sound decisive (not optional)

OUTPUT FORMAT (STRICT JSON ONLY):
Return ONLY valid JSON. Do not include any extra text.

{
"tasks": [
{
"name": "string",
"priority": "high | medium | low",
"reason": "short, direct explanation"
}
],
"recommended_action": "one strong, decisive sentence"
}

USER INPUT:
${input}`;

  try {
    const response = await openai.chat.completions.create({
      // Utilizando o modelo Llama 3.3 70B do Groq, que é gratuito e excelente para JSON
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      // Alguns modelos do Groq funcionam melhor com resposta pura se pedirmos explicitamente o JSON no prompt
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('AI returned an empty response.');
    }

    try {
      const parsed = JSON.parse(content) as AnalysisResult;
      
      // Validação básica dos campos obrigatórios
      if (!parsed.tasks || !Array.isArray(parsed.tasks) || !parsed.recommended_action) {
        throw new Error('AI response is missing required fields.');
      }
      
      return parsed;
    } catch (e) {
      console.error('Falha no JSON da IA:', content);
      throw new Error('Failed to parse AI response as valid JSON.');
    }
  } catch (error: any) {
    console.error('Error calling Groq API:', error);
    throw new Error(error.message || 'An error occurred during AI analysis.');
  }
}
