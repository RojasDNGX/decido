import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnalysisResult } from '@/types';
import { logEvent } from '@/services/analytics/metrics';
import { isLimitReached, incrementUsageCount, saveDecision, getCompactHistory } from '@/services/storage/storage';

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
      router.push('/limite');
      return;
    }

    if (!isRefinementMode) {
      setResult(null);
    }
    setLoading(true);
    setError(null);

    const attemptId = `${userId}-${Date.now()}`;
    logEvent('analyze_started', userId, {
      attempt_id: attemptId,
      input_length: input.length,
      is_refinement: isRefinementMode,
    });

    try {
      const history = getCompactHistory();
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, ...(history.length ? { history } : {}) }),
      });

      if (response.status === 429) {
        logEvent('limit_reached', userId, { attempt_id: attemptId });
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

      let usageCount: number | undefined;
      if (!isRefinementMode) {
        usageCount = incrementUsageCount();
      }
      logEvent('analyze_success', userId, {
        attempt_id: attemptId,
        usage_count: usageCount,
        task_count: data.priorities.length || data.tasks?.length || 0,
        is_refinement: isRefinementMode,
      });

      onSuccess?.();

      if (isLimitReached()) {
        router.push('/limite');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Ocorreu um erro inesperado.';
      logEvent('analyze_error', userId, {
        attempt_id: attemptId,
        error_message: message,
      });
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return { analyze, loading, result, setResult, error, setError };
}
