'use client';

import { useEffect, useState, useRef } from 'react';
import { getUserId, saveDecision, getDecisions, getUsageCount, incrementUsageCount, isLimitReached, getRemainingUsage, clearData, MAX_FREE_ANALYSES } from '@/services/storage';
import { AnalysisResult, Decision } from '@/types';
import { logEvent } from '@/services/metrics';

const EXAMPLES = [
  'Preciso pagar a fatura do cartão que vence hoje, estudar para a prova de amanhã e responder os e-mails do trabalho.',
  'Tenho que marcar uma consulta médica, terminar o relatório do projeto para sexta-feira e lavar a louça.',
  'Renovar o seguro do carro que vence semana que vem, comprar presente de aniversário para minha mãe e fazer supermercado.',
  'Responder mensagens pendentes no WhatsApp, organizar a mesa de trabalho e planejar a viagem de férias.',
  'Pagar o condomínio, agendar a manutenção do ar condicionado e finalizar a apresentação para a diretoria amanhã.',
  'Fazer exercícios por 30 minutos, ler 10 páginas de um livro e terminar a funcionalidade nova do app.',
];

export default function Home() {
  const [userId] = useState<string>(() => typeof window !== 'undefined' ? getUserId() : '');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [usageCount, setUsageCount] = useState<number>(() => typeof window !== 'undefined' ? getUsageCount() : 0);
  const [history, setHistory] = useState<Decision[]>(() => typeof window !== 'undefined' ? getDecisions() : []);
  const [expandedTask, setExpandedTask] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [exampleIndex, setExampleIndex] = useState(-1);
  const [isViewingHistory, setIsViewingHistory] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    setIsViewingHistory(false);
    
    // Auto-resize
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  };

  const handleExample = () => {
    let nextIndex = Math.floor(Math.random() * EXAMPLES.length);
    while (nextIndex === exampleIndex) {
      nextIndex = Math.floor(Math.random() * EXAMPLES.length);
    }
    setExampleIndex(nextIndex);
    setInput(EXAMPLES[nextIndex]);
    setIsViewingHistory(false);
    logEvent('example_used', userId);
    
    // Auto-resize after render
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
      }
    }, 0);
  };

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.recommended_action);
      setCopied(true);
      logEvent('copy_action', userId);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: do nothing silently
    }
  };

  const handleClearData = () => {
    if (window.confirm('Tem certeza que deseja apagar todo o histórico de decisões?')) {
      clearData();
      setHistory([]);
      setResult(null);
      setInput('');
      setIsViewingHistory(false);
      setExampleIndex(-1);
      logEvent('clear_data', userId);
    }
  };

  useEffect(() => {
    setMounted(true);
    // Log page view once on mount; userId was already initialized via lazy state
    logEvent('page_view', userId, { usage: usageCount });
    
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
      setIsViewingHistory(true);
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
    setIsViewingHistory(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Auto-resize after render
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
      }
    }, 0);
  };

  const formatRelativeDate = (timestamp: number): string => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'agora mesmo';
    if (minutes < 60) return `há ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `há ${hours}h`;
    const days = Math.floor(hours / 24);
    return `há ${days} dia${days > 1 ? 's' : ''}`;
  };

  const formatAbsoluteDate = (timestamp: number): string => {
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
        {mounted && history.length > 0 && (
          <div className="quick-actions">
            <button 
              className="quick-action-btn"
              title={result ? "Voltar ao Histórico" : "Histórico"}
              onClick={() => {
                if (result) {
                  setResult(null);
                  setInput('');
                  setIsViewingHistory(false);
                  setExampleIndex(-1);
                  setTimeout(() => {
                    document.querySelector('.history-section')?.scrollIntoView({ behavior: 'smooth' });
                  }, 50);
                } else {
                  document.querySelector('.history-section')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              {result ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
              )}
            </button>
            <button 
              className="quick-action-btn"
              title="Nova Análise"
              onClick={() => {
                setResult(null);
                setInput('');
                setIsViewingHistory(false);
                setExampleIndex(-1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                if (textareaRef.current) {
                  textareaRef.current.style.height = 'auto';
                }
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>
          </div>
        )}

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
              ref={textareaRef}
              id="task-input"
              rows={2}
              className="auto-resize-textarea"
              placeholder="Informe a situação que deseja decidir (seja específico sobre prazos e consequências se possível)."
              value={input}
              onChange={handleInputChange}
              disabled={loading}
            />
            {!input && (
              <button
                id="try-example-btn"
                className="example-btn"
                onClick={handleExample}
                disabled={loading}
              >
                {exampleIndex === -1 ? '✨ Tentar com um exemplo' : '✨ Tentar outro exemplo'}
              </button>
            )}
            
            {isViewingHistory ? (
              <button 
                id="analyze-btn" 
                onClick={() => {
                  setResult(null);
                  setInput('');
                  setIsViewingHistory(false);
                  setExampleIndex(-1);
                  if (textareaRef.current) {
                    textareaRef.current.style.height = 'auto';
                  }
                }}
                disabled={loading}
                style={{ background: 'transparent', border: '1px solid var(--glass-border)' }}
              >
                Nova análise
              </button>
            ) : (
              <button id="analyze-btn" onClick={handleAnalyze} disabled={loading || !input.trim()}>
                {loading ? 'Analisando...' : 'Analisar'}
              </button>
            )}
          </section>
        )}

        {mounted && history.length > 0 && !result && !loading && (
          <section className="history-section">
            <div className="history-header">
              <h2 className="history-title">Decisões Recentes</h2>
              <span className="history-count">{history.length} {history.length === 1 ? 'registro' : 'registros'}</span>
            </div>
            <div className="history-list">
              {history.map((item) => (
                <div key={item.id} className="history-item" onClick={() => handleLoadHistory(item)}>
                  <div className="history-item-body">
                    <p className="history-item-recommendation">{item.output.recommended_action}</p>
                    <p className="history-item-input">{item.input}</p>
                    <div className="history-item-meta">
                      <span className="history-item-badge">{item.output.tasks.length} tarefa{item.output.tasks.length !== 1 ? 's' : ''}</span>
                      <span className="history-item-time">
                        <span className="history-item-relative">{formatRelativeDate(item.timestamp)}</span>
                        <span className="history-item-separator">·</span>
                        <span className="history-item-absolute">{formatAbsoluteDate(item.timestamp)}</span>
                      </span>
                    </div>
                  </div>
                  <span className="history-item-arrow">›</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {mounted && history.length === 0 && !result && !loading && !isLimitReached() && (
          <div className="empty-history-card">
            <span className="empty-history-icon">📝</span>
            <p className="empty-history-title">Nenhuma decisão recente</p>
            <p className="empty-history-sub">As tarefas que você analisar aparecerão aqui para consulta rápida depois.</p>
          </div>
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
              <div className="recommended-card-header">
                <h2>Ação Recomendada Agora</h2>
                <button
                  id="copy-action-btn"
                  className={`copy-btn ${copied ? 'copy-btn--copied' : ''}`}
                  onClick={handleCopy}
                  aria-label="Copiar ação recomendada"
                >
                  {copied ? '✓ Copiado!' : '⎘ Copiar'}
                </button>
              </div>
              <p>{result.recommended_action}</p>
            </div>

            <div className="task-list">
              {[...result.tasks]
                .sort((a, b) => {
                  const order = { high: 0, medium: 1, low: 2 };
                  return order[a.priority] - order[b.priority];
                })
                .map((task, index) => {
                  const isExpanded = expandedTask === index;
                  return (
                    <div key={index} className={`task-card task-card-${task.priority}`}>
                      <div className="task-header">
                        <span className="task-name">{task.name}</span>
                        <div className="task-header-right">
                          <span className={`priority-badge priority-${task.priority}`}>
                            {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
                          </span>
                          <button
                            id={`details-btn-${index}`}
                            className="details-toggle-btn"
                            onClick={() => setExpandedTask(isExpanded ? null : index)}
                            aria-expanded={isExpanded}
                          >
                            {isExpanded ? 'Fechar' : 'Ver detalhes'}
                            <span className={`details-chevron ${isExpanded ? 'details-chevron--open' : ''}`}>›</span>
                          </button>
                        </div>
                      </div>
                      <div className={`task-details ${isExpanded ? 'task-details--open' : ''}`}>
                        <div className="task-details-inner">
                          <p className="task-details-label">Por que esta prioridade?</p>
                          <p className="task-reason">{task.reason}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </section>
        )}

        <footer style={{ textAlign: 'center', opacity: 0.5, fontSize: '0.9rem', marginTop: 'auto', padding: '2rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
          {mounted && (
            isLimitReached() ? (
              <span>Faça upgrade para continuar decidindo sem limites. <a href="#" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Ver planos</a></span>
            ) : (
              <span>Plano Gratuito: {getRemainingUsage()} {getRemainingUsage() === 1 ? 'análise restante' : 'análises restantes'}</span>
            )
          )}
          {mounted && history.length > 0 && (
            <button 
              onClick={handleClearData}
              className="clear-data-btn"
            >
              Limpar dados do histórico
            </button>
          )}
        </footer>

        {showBackToTop && (
          <button 
            className="back-to-top-btn"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Voltar ao topo"
          >
            ↑
          </button>
        )}
      </div>
    </main>
  );
}
