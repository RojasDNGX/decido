import { Priority } from '@/types';

const META_PATTERNS = [
  'organizar tudo',
  'organizar tarefas',
  'resolver coisas',
  'gerenciar tarefas',
  'dar conta de tudo',
  'organizar o dia',
  'planejar tarefas',
];

function hasVerb(text: string): boolean {
  // More inclusive heuristic for Portuguese verbs (imperative or infinitive)
  const lower = text.toLowerCase().trim();
  // Check if it ends with common verb suffixes or has 3+ chars
  // In Decido, a task is usually "Verbo + Objeto"
  const firstWord = lower.split(' ')[0];
  return firstWord.length >= 3 && (
    firstWord.endsWith('ar') || 
    firstWord.endsWith('er') || 
    firstWord.endsWith('ir') ||
    // Common imperative endings
    firstWord.endsWith('e') || 
    firstWord.endsWith('a') ||
    // Irregulars
    ['faz', 'diz', 'vai', 'põe', 'dê', 'vem', 'traz', 'tenha', 'seja'].includes(firstWord)
  );
}

function isMetaTask(title: string): boolean {
  const lower = title.toLowerCase();
  return META_PATTERNS.some(p => lower.includes(p));
}

function isRawInputLeak(title: string): boolean {
  const lower = title.toLowerCase();
  return (
    title.length > 70 ||
    lower.includes('várias coisas') ||
    lower.includes('tenho pouco tempo') ||
    lower.includes('muitas tarefas') ||
    lower.includes('estou sobrecarregado')
  );
}

function isValidTask(task: Priority): boolean {
  if (!task.task || !task.reason) return false;
  if (isMetaTask(task.task)) return false;
  if (isRawInputLeak(task.task)) return false;
  return true;
}

export function sanitizeTasks(tasks: Priority[]): Priority[] {
  // 1. Filter invalid tasks
  const filtered = tasks.filter(isValidTask);
  
  // 2. Deduplicate
  const seen = new Set<string>();
  return filtered.filter(t => {
    const key = t.task.toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function isDuplicate(task: string, existing: Priority[]): boolean {
  const norm = task.toLowerCase().trim();
  return existing.some(t => t.task.toLowerCase().trim() === norm);
}

export function recoverCoverage(input: string, currentTasks: Priority[]): Priority[] {
  if (currentTasks.length >= 2) return currentTasks;

  const lower = input.toLowerCase();
  const added: Priority[] = [...currentTasks];

  const fallbacks: { keyword: string; task: string; reason: string }[] = [
    {
      keyword: 'atrasada',
      task: 'Resolver tarefa atrasada',
      reason: 'Já está atrasado e pode gerar impacto imediato.'
    },
    {
      keyword: 'tempo',
      task: 'Definir próxima ação prioritária',
      reason: 'Evita perda de tempo nas próximas decisões.'
    },
    {
      keyword: 'importante',
      task: 'Executar próxima tarefa importante',
      reason: 'Pode gerar atraso acumulado se ignorado.'
    },
    {
      keyword: 'hoje',
      task: 'Finalizar pendência de hoje',
      reason: 'Garante que o dia termine sem acúmulos.'
    }
  ];

  for (const f of fallbacks) {
    if (lower.includes(f.keyword) && !isDuplicate(f.task, added)) {
      added.push({
        task: f.task,
        level: 'média',
        reason: f.reason
      });
      if (added.length >= 2) break;
    }
  }

  return added;
}
