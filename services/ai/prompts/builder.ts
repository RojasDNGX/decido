import fs from 'fs';
import path from 'path';
import { Plan } from '@/types';
import { LANGUAGE_RULE, OUTPUT_FORMAT, HEALTH_POLICY } from './shared';

const PROMPTS_DIR = path.join(process.cwd(), 'services/ai/prompts');
const LAYERS_DIR = path.join(PROMPTS_DIR, 'layers');
const EXECUTION_DIR = path.join(PROMPTS_DIR, 'execution');

function loadFile(filePath: string): string {
  try {
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, 'utf8');
    }
  } catch (error) {
    console.error(`Error loading file ${filePath}:`, error);
  }
  return '';
}

type HistoryItem = { input_summary: string; primary_action: string };

export function buildLayeredPrompt(plan: Plan, input: string, history?: HistoryItem[]): string {
  // 1. Load all potential layers
  const core = loadFile(path.join(LAYERS_DIR, 'core.md'));
  const heuristics = loadFile(path.join(LAYERS_DIR, 'heuristics.md'));
  const primaryAction = loadFile(path.join(EXECUTION_DIR, 'primary-action.md'));
  const render = loadFile(path.join(LAYERS_DIR, 'render.md'));
  const context = loadFile(path.join(LAYERS_DIR, 'context.md'));
  const validation = loadFile(path.join(LAYERS_DIR, 'validation.md'));
  const pipeline = loadFile(path.join(PROMPTS_DIR, 'pipeline.md'));
  const memoryLayer = loadFile(path.join(LAYERS_DIR, 'memory.md'));

  // 2. Assemble in EXACT REQUIRED ORDER
  // 1. LANGUAGE_RULE
  // 2. HEALTH_POLICY (Global Constraint)
  // 3. core (decision)
  // 4. heuristics (reasoning signals)
  // 5. primary-action (execution selection)
  // 6. render (signal-based justification — ALL PLANS)
  // 7. (if PRO) context
  // 8. (if PRO) validation
  // 9. (if PRO) memory
  // 10. pipeline (orchestration — ALWAYS LAST)

  const promptParts: string[] = [LANGUAGE_RULE, HEALTH_POLICY];

  if (core) promptParts.push(core);
  if (heuristics) promptParts.push(heuristics);
  if (primaryAction) promptParts.push(primaryAction);
  if (render) promptParts.push(render);

  if (plan === 'pro' || plan === 'enterprise') {
    if (context) promptParts.push(context);
    if (validation) promptParts.push(validation);
    
    if (history && history.length > 0) {
      const historyContext = `\nCONTEXT MEMORY (uso interno — NÃO mencione ao usuário):
O usuário fez decisões similares recentemente:
${history.map(h => `* "${h.input_summary}" → ${h.primary_action}`).join('\n')}
${memoryLayer}`;
      promptParts.push(historyContext);
    }
  }

  // Pipeline is ALWAYS LAST
  if (pipeline) promptParts.push(pipeline);

  // --- REINFORÇO DE PLANO (COMPORTAMENTO) ---
  const planBehavior = plan === 'free'
    ? `[MODO FREE — RESTRITO]:
      - PERSONA: Um assistente prático e extremamente direto.
      - REPOSTA: Máximo 1 frase curta por justificativa.
      - FOCO: Apenas o "o que fazer" e "por que agora" imediato.
      - PROIBIDO: Explicar políticas (como precaução), discutir o futuro, comparar tarefas ou usar termos técnicos como "momentum" ou "heurística".`
    : `[MODO PRO — ESTRATEGISTA]:
      - PERSONA: Um conselheiro estratégico e confiável.
      - RESPOSTA: Justificativas ricas (1-2 frases).
      - FOCO: Explicar a POLÍTICA por trás da decisão e a RELAÇÃO entre as tarefas.
      - ADICIONAL: Discuta incertezas, ofereça nuances de segurança e sugira refinamentos contextuais.`;
  
  promptParts.push(planBehavior);

  promptParts.push(OUTPUT_FORMAT);
  promptParts.push(`ENTRADA DO USUÁRIO:\n${input}`);

  return promptParts.join('\n\n');
}
