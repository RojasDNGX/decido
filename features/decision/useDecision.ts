import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnalysisResult } from '@/types';
import { logEvent } from '@/services/analytics/metrics';
import { isLimitReached, incrementUsageCount, saveDecision } from '@/services/storage/storage';

export function useDecision(userId: string) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyze = async (
    input: string,
    isRefinementMode: boolean,
    onSuccess?: () => void,
  ): Promise<void> => {
    if (!input.trim()) {
      setError('Por favor, descreva suas tarefas para que eu possa decidi-las.');
      return;
    }

    if (isLimitReached()) {
      logEvent('limit_reached', userId);
      router.push('/limite');
      return;
    }

    if (!isRefinementMode) {
      setResult(null);
    }
    setLoading(true);
    setError(null);
    logEvent('analyze_started', userId, { inputLength: input.length, isRefinement: isRefinementMode });

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      });

      if (response.status === 429) {
        logEvent('limit_reached', userId);
        router.push('/limite');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha na análise das tarefas.');
      }

      const data: AnalysisResult = await response.json();
      setResult(data);
      saveDecision({ input, output: data });

      if (!isRefinementMode) {
        const newCount = incrementUsageCount();
        logEvent('analyze_success', userId, { usageCount: newCount, taskCount: data.tasks?.length });
      } else {
        logEvent('analyze_success', userId, { refinement: true, taskCount: data.tasks?.length });
      }

      onSuccess?.();

      if (isLimitReached()) {
        router.push('/limite');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Ocorreu um erro inesperado.';
      logEvent('analyze_error', userId, { message });
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return { analyze, loading, result, setResult, error, setError };
}
