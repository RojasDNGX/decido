import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnalysisResult } from '@/types';
import { logEvent } from '@/services/analytics/metrics';
import { getUsageCount, incrementUsageCount, getRemainingUsage, getOrCreateFingerprint, getCompactHistory } from '@/services/storage/storage';

export function useDecision(userId: string) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [limitReached, setLimitReached] = useState(false);
  const [conversionTrigger, setConversionTrigger] = useState<unknown>(null);

  const analyze = async (
    input: string,
    isRefinementMode: boolean,
    isPro: boolean,
    onSuccess?: () => void,
  ): Promise<void> => {
    if (!input.trim()) {
      setError('Por favor, descreva suas tarefas para que eu possa decidi-las.');
      return;
    }

    if (!isRefinementMode) {
      setResult(null);
    }
    setLoading(true);
    setError(null);
    setLimitReached(null);
    setConversionTrigger(null);

    const attemptId = `${userId}-${Date.now()}`;
    const fingerprint = getOrCreateFingerprint();
    
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
        body: JSON.stringify({ 
          input, 
          fingerprint,
          ...(history.length ? { history } : {}) 
        }),
      });

      if (response.status === 429) {
        const data = await response.json();
        if (data.type === 'limit_reached') {
          setLimitReached(data.message);
          logEvent('limit_reached_screen', userId, { attempt_id: attemptId });
          return;
        }
        logEvent('limit_reached_generic', userId, { attempt_id: attemptId });
        router.push('/limite');
        return;
      }

      if (response.status === 403) {
        logEvent('access_denied', userId, { attempt_id: attemptId });
        router.push('/limite');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha na análise das tarefas.');
      }

      const data = await response.json();
      
      // Extract conversion_trigger before setting result
      const { conversion_trigger, ...analysisResult } = data;
      setResult(analysisResult as AnalysisResult);
      
      if (conversion_trigger) {
        // Delay the modal so the user sees the result first
        setTimeout(() => {
          setConversionTrigger(conversion_trigger);
        }, 3000);
      }

      // History is now automatically managed by the server for authenticated users
      let usageCount: number | undefined;
      if (!isRefinementMode) {
        usageCount = incrementUsageCount();
      }
      logEvent('analyze_success', userId, {
        attempt_id: attemptId,
        usage_count: usageCount,
        task_count: analysisResult.priorities?.length || analysisResult.tasks?.length || 0,
        is_refinement: isRefinementMode,
      });

      onSuccess?.();
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

  return { analyze, loading, result, setResult, error, setError, limitReached, setLimitReached, conversionTrigger, setConversionTrigger };
}

