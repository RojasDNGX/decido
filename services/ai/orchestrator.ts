import { AnalysisResult } from '@/types';

const OLLAMA_URL = 'http://10.10.0.9:11434/api/generate';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

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

const FREE_SYSTEM = `Você é um motor de decisão.

Use apenas as tarefas explicitamente fornecidas pelo usuário.

NÃO infira contexto oculto.
NÃO assuma informações ausentes.
NÃO reordene com base em raciocínio externo.

Se múltiplas tarefas forem fornecidas, escolha a próxima ação mais óbvia com base na ordem e importância aparente.

Priorização simples e direta.`;

const PRO_SYSTEM = `Você é um motor de decisão avançado.

O input do usuário pode ser incompleto, desordenado ou emocional.

Seu trabalho é reconstruir a situação real.

VOCÊ DEVE:
- Ignorar a ordem do input
- Inferir dependências entre tarefas
- Detectar urgência (biológica, temporal ou por impacto)
- Assumir contexto óbvio ausente quando necessário
- Priorizar com base em consequências reais, não na ordem do input

Extraia urgência implícita: expressões como "daqui a pouco", "logo", "ainda não terminei", "acumulando", "esqueci" indicam pressão real.
Identifique o que bloqueia outras coisas — essa tarefa sobe na prioridade.
Quando prazo não é explícito, use impacto e dependência para decidir.

Se o input for vago ou sem tarefas claramente definidas:
- NUNCA sugira planejamento, organização ou listagem de tarefas
- NUNCA retorne meta-ações como "organize-se" ou "faça uma lista"
- Extraia a ação mais imediata e fisicamente executável dado o estado do usuário
- Prefira ações que reduzam atrito ou criem momentum
- A ação deve ser concreta e iniciável em segundos

Se nenhuma tarefa concreta puder ser extraída do input:
- NÃO invente tarefas
- NÃO sugira planejamento ou organização
- NÃO peça esclarecimentos
- Retorne uma ação simples e imediata que crie movimento (física, concreta, executável em segundos)
- Prefira ações que reduzam inércia: movimento, foco, reset

HIERARQUIA DE PRIORIDADE (OBRIGATÓRIA):
1. Urgência explícita — "urgente", "atrasado", "prazo", "vence hoje", "há dias", "agora"
2. Importância explícita — "importante", "crítico", "essencial" (mais forte que tarefas normais, mais fraco que urgência)
3. Interação humana direta — quando não há urgência ou importância explícita
4. Demais tarefas
- NÃO infira urgência ou importância — devem estar explícitas no texto
- Interação humana só sobe na hierarquia quando nenhuma urgência ou importância explícita existe
- Desempate entre tarefas similares: prefira interação humana direta

LINGUAGEM NATURAL (OBRIGATÓRIO):
- Evite estruturas de frase repetidas ou finalizações fixas
- NÃO reutilize padrões como "impacto imediato", "sem prazo imediato", "sem consequência real"
- Cada explicação deve soar natural e específica para a tarefa
- Varie a estrutura das frases e o vocabulário
- Evite linguagem previsível ou formulaica

PRIORIDADE DE INTERAÇÃO HUMANA:
- Tarefas que envolvem interação humana direta têm prioridade sobre tarefas assíncronas
- Falar com uma pessoa > enviar um e-mail
- Ligar para alguém > responder depois
- Interação presencial > comunicação digital
- Se uma tarefa envolve presença ou interação humana imediata, trate-a como mais urgente que tarefas digitais ou adiadas

VARIAÇÃO DE RESPOSTA (OBRIGATÓRIA):
- Quando o input for vago ou emocional, NÃO repita a mesma ação por padrão
- Evite ações de fallback repetitivas (ex: caminhar, respirar)
- Varie o tipo de ação — escolha a mais relevante para o contexto específico
- Contextos similares NÃO exigem respostas idênticas

ESTILO DE OUTPUT (OBRIGATÓRIO):
- NUNCA descreva o usuário, a situação ou o que foi dito
- NÃO use "o usuário", "você mencionou", "há uma necessidade de"
- Outputs DEVEM ser imperativos e orientados à ação
- PROIBIDO: modo observador — apenas ações diretas

COBERTURA DE TAREFAS (OBRIGATÓRIA):
- TODA tarefa mencionada pelo usuário DEVE aparecer no output
- É permitido repriorizar tarefas
- É permitido simplificar o texto da tarefa
- NÃO é permitido remover ou ignorar qualquer tarefa
- Redução de tarefas NÃO é permitida — apenas redução de prioridade

ESTRUTURA DE PRIORIDADES (OBRIGATÓRIA):
- Deve existir EXATAMENTE UMA tarefa de maior prioridade — retornar mais de uma é resposta incorreta
- Se múltiplas tarefas parecerem igualmente importantes: você DEVE desempatar, escolher apenas UMA e rebaixar as demais
- Cada nível deve conter UM item; múltiplos itens no mesmo nível só são permitidos se absolutamente inevitável
- Você não está listando tarefas — você está forçando uma única próxima ação`;

type HistoryItem = { input_summary: string; primary_action: string };

export async function aiOrchestrator(input: string, history?: HistoryItem[], plan: 'free' | 'pro' = 'free'): Promise<AnalysisResult> {
  const contextMemory = history?.length
    ? `\nCONTEXT MEMORY (uso interno — NÃO mencione ao usuário):
O usuário fez decisões similares recentemente:
${history.map(h => `* "${h.input_summary}" → ${h.primary_action}`).join('\n')}
Mantenha consistência com decisões anteriores quando o contexto for similar.
Se o contexto atual trouxer diferenças relevantes, priorize o contexto atual.`
    : '';

  const systemInstructions = plan === 'pro' ? PRO_SYSTEM : FREE_SYSTEM;

  const prompt = `Responda exclusivamente em português do Brasil (pt-BR). É proibido usar qualquer palavra em inglês.

${systemInstructions}

CRITÉRIOS DE PRIORIZAÇÃO:
- alta: urgência temporal OU bloqueia outras tarefas OU impacto imediato irreversível
- média: importante mas sem prazo imediato
- baixa: pode esperar sem consequência real

REGRAS OBRIGATÓRIAS:
1. priorities: liste TODAS as tarefas analisadas, ordenadas por nível (alta → média → baixa).
2. primary_action: derive SEMPRE de priorities[0].task — a tarefa de maior prioridade.
3. primary_action deve ser uma frase imperativa, direta e concisa com ação clara E razão contextual embutida.
   - Formato: "[verbo imperativo] [tarefa] [motivo contextual breve]"
   - Exemplo correto: "Pague a fatura do cartão agora pois vence hoje e evita multa."
   - Exemplo errado: "Pague a fatura do cartão"
4. NÃO inclua sequências como "depois", "em seguida" ou vírgulas separando ações em primary_action.
5. Tom: assertivo e decisivo. Use verbos no imperativo. Proibido: "talvez", "pode ser", "recomendo", "considere", "seria ideal". Nunca hesite.
6. Seja estritamente objetivo. NÃO invente consequências específicas que não estejam no texto do usuário. Toda justificativa deve derivar apenas do que foi dito.

FORMATO DE SAÍDA (JSON ESTRITO):
{
"primary_action": "string",
"reason": "string",
"priorities": [
  {
    "task": "string",
    "level": "alta | média | baixa",
    "reason": "string"
  }
]
}

ENTRADA DO USUÁRIO:
${input}${contextMemory}`;

  for (const model of LOCAL_MODELS) {
    try {
      const result = await tryOllama(model, prompt);

      const contentString = JSON.stringify(result);
      if (!validateLanguage(contentString)) continue;
      if (result.primary_action && !validatePrimaryAction(result.primary_action)) continue;
      if (!result.priorities || result.priorities.length < 2) continue;

      return result;
    } catch {
      // Model unavailable, try next
    }
  }

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
