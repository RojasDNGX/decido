import { AnalysisResult } from '@/types';

export function isOverloadInput(input: string): boolean {
  const text = input.toLowerCase();

  return (
    text.includes('muitas coisas') ||
    text.includes('não sei por onde começar') ||
    text.includes('nem sei por onde começar') ||
    text.includes('tudo ao mesmo tempo') ||
    text.includes('estou perdido') ||
    text.includes('não sei o que fazer') ||
    text.includes('sobrecarregado') ||
    text.includes('muita tarefa')
  );
}

export function buildOverloadResponse(): AnalysisResult {
  return {
    primary_action: "Pare por um momento e escolha uma tarefa simples agora.",
    reason: "Reduzir a sobrecarga mental permite que você tome a primeira decisão sem pressão.",
    priorities: [
      {
        task: "Escolher uma tarefa simples",
        level: 'alta',
        reason: "Reduz a sobrecarga mental e cria um ponto de partida claro."
      }
    ]
  };
}

export function buildOverloadResponseFree(): AnalysisResult {
  return {
    primary_action: "Escolha uma tarefa simples e comece agora.",
    reason: "Ajuda a começar sem travar.",
    priorities: [
      {
        task: "Escolher uma tarefa simples",
        level: 'alta',
        reason: "Ajuda a dar o primeiro passo quando há muitas tarefas pendentes."
      }
    ]
  };
}
