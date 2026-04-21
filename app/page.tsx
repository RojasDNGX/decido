'use client';

import { useEffect, useState } from 'react';
import { getUserId, saveDecision, getDecisions, getUsageCount, incrementUsageCount, isLimitReached, MAX_FREE_ANALYSES } from '@/services/storage';
import { AnalysisResult, Decision } from '@/types';
import { logEvent } from '@/services/metrics';

export default function Home() {
  const EXAMPLE_INPUT = 'Preciso pagar a fatura do cartão que vence hoje, estudar para a prova de amanhã e responder os e-mails do trabalho.';
  const [userId] = useState<string>(() => typeof window !== 'undefined' ? getUserId() : '');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [usageCount, setUsageCount] = useState<number>(() => typeof window !== 'undefined' ? getUsageCount() : 0);
  const [history, setHistory] = useState<Decision[]>(() => typeof window !== 'undefined' ? getDecisions() : []);

  useEffect(() => {
    // Log page view once on mount; userId was already initialized via lazy state
    logEvent('page_view', userId, { usage: usageCount });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnalyze = async () => {
    if (!input.trim()) {
      setError('Por favor, descreva suas tarefas para que eu possa decidi-las.');
      return;
    }

    if (isLimitReached()) {
      logEvent('limit_reached', userId);
      setError('Limite de uso do plano gratuito atingido. Faça upgrade para continuar decidindo.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    logEvent('analyze_started', userId, { inputLength: input.length });

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha na análise das tarefas.');
      }

      const data = await response.json();
      setResult(data);
      saveDecision({ input, output: data });
      setHistory(getDecisions());
      const newCount = incrementUsageCount();
      setUsageCount(newCount);
      logEvent('analyze_success', userId, { usageCount: newCount, taskCount: data.tasks?.length });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Ocorreu um erro inesperado.';
      logEvent('analyze_error', userId, { message });
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadHistory = (decision: Decision) => {
    logEvent('history_opened', userId, { decisionId: decision.id });
    setInput(decision.input);
    setResult(decision.output);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(timestamp));
  };

  return (
    <main>
      <div className="container">
        <header className="header">
          <h1>Decido</h1>
          <p>Seu assistente inteligente de decisões</p>
        </header>

        {isLimitReached() ? (
          <div className="limit-reached-card">
            <span className="limit-reached-icon">🔒</span>
            <h2>Limite atingido</h2>
            <p>Você usou todas as {MAX_FREE_ANALYSES} análises do plano gratuito.</p>
            <p className="limit-reached-sub">Faça upgrade para continuar decidindo sem limites.</p>
          </div>
        ) : (
          <section className="input-section">
            <textarea
              id="task-input"
              rows={4}
              placeholder="Liste o que precisa fazer hoje. Seja específico sobre prazos e consequências."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            {!input && (
              <button
                id="try-example-btn"
                className="example-btn"
                onClick={() => { logEvent('example_used', userId); setInput(EXAMPLE_INPUT); }}
                disabled={loading}
              >
                ✨ Tentar com um exemplo
              </button>
            )}
            <button id="analyze-btn" onClick={handleAnalyze} disabled={loading || !input.trim()}>
              {loading ? 'Analisando...' : 'Analisar'}
            </button>
          </section>
        )}

        {history.length > 0 && !result && !loading && (
          <section className="history-section">
            <h2 className="history-title">Decisões Recentes</h2>
            <div className="history-list">
              {history.map((item) => (
                <div key={item.id} className="history-item" onClick={() => handleLoadHistory(item)}>
                  <div className="history-item-content">
                    <span className="history-item-text">{item.input}</span>
                    <span className="history-item-date">{formatDate(item.timestamp)}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {error && <div className="error-message">{error}</div>}

        {loading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        )}

        {result && (
          <section className="result-section">
            <div className="recommended-card">
              <h2>Ação Recomendada Agora</h2>
              <p>{result.recommended_action}</p>
            </div>

            <div className="task-list">
              {[...result.tasks]
                .sort((a, b) => {
                  const order = { high: 0, medium: 1, low: 2 };
                  return order[a.priority] - order[b.priority];
                })
                .map((task, index) => (
                <div key={index} className="task-card">
                  <div className="task-header">
                    <span className="task-name">{task.name}</span>
                    <span className={`priority-badge priority-${task.priority}`}>
                      {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
                    </span>
                  </div>
                  <p className="task-reason">{task.reason}</p>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => { setResult(null); setInput(''); }} 
              style={{ background: 'transparent', border: '1px solid var(--glass-border)', marginTop: '1rem' }}
            >
              Nova Análise
            </button>
          </section>
        )}

        <footer style={{ textAlign: 'center', opacity: 0.5, fontSize: '0.9rem', marginTop: 'auto', padding: '2rem 0' }}>
          {!isLimitReached() && (
            <>Plano Gratuito: {MAX_FREE_ANALYSES - usageCount} {(MAX_FREE_ANALYSES - usageCount) === 1 ? 'análise restante' : 'análises restantes'}</>
          )}
        </footer>
      </div>
    </main>
  );
}
