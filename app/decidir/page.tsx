'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { getUserId, getDecisions, getUsageCount, isLimitReached, getRemainingUsage, clearData, MAX_FREE_ANALYSES, setOnboardingDone } from '@/services/storage/storage';
import { Decision } from '@/types';
import { logEvent } from '@/services/analytics/metrics';
import { useDecision } from '@/features/decision/useDecision';

const EXAMPLES = [
  'Preciso pagar a fatura do cartão que vence hoje, estudar para a prova de amanhã e responder os e-mails do trabalho.',
  'Tenho que marcar uma consulta médica, terminar o relatório do projeto para sexta-feira e lavar a louça.',
  'Renovar o seguro do carro que vence semana que vem, comprar presente de aniversário para minha mãe e fazer supermercado.',
  'Responder mensagens pendentes no WhatsApp, organizar a mesa de trabalho e planejar a viagem de férias.',
  'Pagar o condomínio, agendar a manutenção do ar condicionado e finalizar a apresentação para a diretoria amanhã.',
  'Fazer exercícios por 30 minutos, ler 10 páginas de um livro e terminar a funcionalidade nova do app.',
  'Consertar o vazamento da pia, comprar lâmpadas novas e organizar os documentos do imposto de renda.',
  'Ligar para o banco para contestar uma cobrança, preparar a mala para a viagem e levar o cachorro ao veterinário.',
];

export default function Home() {
  const [userId] = useState<string>(() => typeof window !== 'undefined' ? getUserId() : '');
  const [input, setInput] = useState('');
  const { analyze, loading, result, setResult, error } = useDecision(userId);
  const [usageCount, setUsageCount] = useState<number>(() => typeof window !== 'undefined' ? getUsageCount() : 0);
  const [history, setHistory] = useState<Decision[]>(() => typeof window !== 'undefined' ? getDecisions() : []);
  const [expandedTask, setExpandedTask] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [exampleIndex, setExampleIndex] = useState(-1);
  const [isViewingHistory, setIsViewingHistory] = useState(false);
  const [tourStep, setTourStep] = useState<number>(0); // 0 = hidden, 1 = input, 2 = button...
  const [isRefinementMode, setIsRefinementMode] = useState(false);
  const [isLimit, setIsLimit] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const analyzeBtnRef = useRef<HTMLButtonElement>(null);
  const isDecisionFocus = !!result && !isViewingHistory;

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
      await navigator.clipboard.writeText(result.primary_action || result.recommended_action || '');
      setCopied(true);
      logEvent('copy_action', userId);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: do nothing silently
    }
  };

  useEffect(() => {
    if (tourStep === 4) {
      document.getElementById('app-footer')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [tourStep]);

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
    setIsLimit(isLimitReached());
    // Log page view once on mount; userId was already initialized via lazy state
    logEvent('page_view', userId, { usage: usageCount });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnalyze = () => {
    analyze(input, isRefinementMode, () => {
      setHistory(getDecisions());
      setUsageCount(getUsageCount());
      setIsViewingHistory(true);
      setIsRefinementMode(false);
      setTimeout(() => {
        const resultSection = document.querySelector('.result-section') as HTMLElement;
        if (resultSection) {
          const yOffset = -60;
          const y = resultSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    });
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

  const renderTourPopover = (step: number) => (
    <div className={`tour-popover tour-popover--step-${step}`}>
      <div className="tour-content">
        {step === 1 ? (
          <>
            <h3>Entrada de Dados</h3>
            <p>Cole sua lista de tarefas ou descreva uma situação. Seja específico sobre prazos para melhores resultados.</p>
          </>
        ) : step === 2 ? (
          <>
            <h3>Análise Inteligente</h3>
            <p>O Decido organiza tudo por prioridade e sugere a melhor ação imediata.</p>
          </>
        ) : step === 3 ? (
          <>
            <h3>Histórico Local</h3>
            <p>Suas decisões passadas ficam salvas apenas no seu navegador para consulta rápida.</p>
          </>
        ) : (
          <>
            <h3>Limite e Privacidade</h3>
            <p>Acompanhe seu limite de uso e limpe seus dados quando quiser para reiniciar o histórico.</p>
          </>
        )}
      </div>
      <div className="tour-footer">
        <button className="tour-btn-secondary" onClick={() => { setOnboardingDone(); setTourStep(0); }}>Pular</button>
        <div className="tour-btn-group">
          {step < 4 ? (
            <button className="tour-btn-primary" onClick={() => setTourStep(step + 1)}>Próximo</button>
          ) : (
            <button className="tour-btn-primary" onClick={() => { setOnboardingDone(); setTourStep(0); }}>Entendi</button>
          )}
        </div>
      </div>
      <div className="tour-arrow"></div>
    </div>
  );

  return (
    <main>
      <header style={{ width: '100%', maxWidth: '1400px', margin: '0 auto', padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" className="logo-container" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', transition: 'opacity 0.2s' }}>
            <img 
              src="/images/app-icon.png" 
              alt="Decido Logo" 
              style={{ width: '52px', height: '52px', borderRadius: '12px', objectFit: 'cover' }} 
            />
          </Link>
          
          {mounted && (
            <div className="quick-actions" style={{ display: 'flex', gap: '0.75rem' }}>
              <Link href="/" className="quick-action-btn" title="Ir para Home" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </Link>
              
              {!result && !isViewingHistory && !isLimit && (
                <button 
                  className="quick-action-btn"
                  title="Como funciona"
                  onClick={() => setTourStep(1)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                </button>
              )}
              {history.length > 0 && (
                <>
                  <button 
                    className="quick-action-btn"
                title={result ? "Voltar ao Início" : "Histórico"}
                onClick={() => {
                  if (result) {
                    setResult(null);
                    setInput('');
                    setIsViewingHistory(false);
                    setExampleIndex(-1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
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
            </>
          )}
        </div>
      )}
    </header>
    <div className={`container ${isDecisionFocus ? 'decision-focus-dim' : ''}`} key={mounted ? 'client' : 'server'}>

        <header className="header">
          <h1>Decido</h1>
          <p>Seu assistente inteligente de decisões</p>
        </header>

        {isLimit ? (
          <div className="limit-reached-card">
            <span className="limit-reached-icon">🔒</span>
            <h2>Limite atingido</h2>
            <p>Você usou todas as {MAX_FREE_ANALYSES} análises do plano gratuito.</p>
            <p className="limit-reached-sub">Faça upgrade para continuar decidindo sem limites.</p>
          </div>
        ) : (
          <section className={`input-section ${(tourStep === 1 || tourStep === 2) ? 'tour-highlight-container' : ''}`} style={{ position: 'relative' }}>
            <textarea
              ref={textareaRef}
              id="task-input"
              rows={2}
              className={`auto-resize-textarea ${tourStep === 1 ? 'tour-highlight' : ''}`}
              placeholder="Descreva suas tarefas (inclua prazos ou urgência se houver)"
              value={input}
              onChange={handleInputChange}
              disabled={loading}
            />
            {tourStep === 1 && renderTourPopover(1)}
            {(!input || EXAMPLES.includes(input)) && (
              <button
                id="try-example-btn"
                className="example-btn"
                onClick={handleExample}
                disabled={loading}
              >
                {exampleIndex === -1 ? '✨ Tentar com um exemplo' : '✨ Tentar outro exemplo'}
              </button>
            )}
            
            <div className={tourStep === 2 ? 'tour-highlight-container' : ''} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', position: 'relative' }}>
              {isRefinementMode && (
                <span className="refinement-indicator">Refinando análise anterior</span>
              )}
              <button 
                ref={analyzeBtnRef}
                id="analyze-btn" 
                className={tourStep === 2 ? 'tour-highlight' : ''}
                onClick={handleAnalyze} 
                disabled={loading || !input || input.trim().length === 0}
              >
                {loading ? 'Analisando...' : 'Analisar'}
              </button>
              {tourStep === 2 && renderTourPopover(2)}
            </div>
          </section>
        )}

        {mounted && tourStep > 0 && <div className="tour-overlay" />}

        {mounted && history.length > 0 && !result && !loading && (
          <section id="history-container" className={`history-section ${tourStep === 3 ? 'tour-highlight-container' : ''}`} style={{ position: 'relative' }}>
            <div className={tourStep === 3 ? 'tour-highlight' : ''}>
              <div className="history-header">
                <h2 className="history-title">Decisões anteriores</h2>
                <span className="history-count">{history.length} {history.length === 1 ? 'registro' : 'registros'}</span>
              </div>
              <div className="history-list">
                {history.map((item) => (
                  <div key={item.id} className="history-item" onClick={() => handleLoadHistory(item)}>
                    <div className="history-item-body">
                      <p className="history-item-recommendation">{item.output.primary_action || item.output.recommended_action}</p>
                      <p className="history-item-input">{item.input}</p>
                      <div className="history-item-meta">
                        {item.output.priorities ? (
                          <span className="history-item-badge">{item.output.priorities.length} {item.output.priorities.length === 1 ? 'item' : 'itens'}</span>
                        ) : item.output.tasks ? (
                          <span className="history-item-badge">{item.output.tasks.length} tarefa{item.output.tasks.length !== 1 ? 's' : ''}</span>
                        ) : (
                          <span className="history-item-badge">Ação Única</span>
                        )}
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
            </div>
            {tourStep === 3 && renderTourPopover(3)}
          </section>
        )}

        {mounted && history.length === 0 && !result && !loading && !isLimitReached() && (
          <div id="history-container" className={`empty-history-card ${tourStep === 3 ? 'tour-highlight-container' : ''}`} style={{ position: 'relative' }}>
            <div className={tourStep === 3 ? 'tour-highlight' : ''} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              <span className="empty-history-icon">📝</span>
              <p className="empty-history-title">Nenhuma decisão recente</p>
              <p className="empty-history-sub">As tarefas que você analisar aparecerão aqui para consulta rápida depois.</p>
            </div>
            {tourStep === 3 && renderTourPopover(3)}
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        {loading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        )}

        {result && (
          <section className={`result-section ${isDecisionFocus ? 'decision-focus-active' : ''}`}>
            <div className={`recommended-card ${isDecisionFocus ? 'decision-focus-card' : ''}`}>
              <div className="recommended-card-header">
                <div className="recommended-badge-container">
                  <span className="recommended-badge">O que fazer agora</span>
                </div>
                <button
                  id="copy-action-btn"
                  className={`copy-btn ${copied ? 'copy-btn--copied' : ''}`}
                  onClick={handleCopy}
                  aria-label="Copiar ação recomendada"
                >
                  {copied ? '✓ Copiado!' : '⎘ Copiar'}
                </button>
              </div>
              <div className="recommended-content">
                <p className="recommended-action-line">
                  <span className="recommended-label">Próxima ação:</span>
                  <span className="recommended-text">{result.primary_action || result.recommended_action}</span>
                </p>
                <div className="context-disclaimer">
                  <p>
                    Baseado no seu contexto, esta é a melhor próxima ação. A prioridade pode variar se houver <span className="context-emphasis">prazo ou urgência específica</span>.
                    {' '}
                    <button 
                      className="refine-link"
                      onClick={() => {
                        setIsRefinementMode(true);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        textareaRef.current?.focus();
                      }}
                    >
                      Refinar informações
                    </button>
                  </p>
                </div>
              </div>
            </div>

            {result.priorities ? (
              <div className="task-list-container">
                <div className="task-list-intro">
                  <h3>Priorização das Tarefas</h3>
                  <p>Análise detalhada baseada em urgência e impacto.</p>
                </div>

                <div className="task-list">
                  {['alta', 'média', 'baixa'].map((level) => {
                    const levelTasks = result.priorities.filter(p => p.level === level);
                    if (levelTasks.length === 0) return null;

                    const priorityKey = level === 'alta' ? 'high' : level === 'média' ? 'medium' : 'low';

                    return (
                      <div key={level} className="priority-group">
                        <div className={`priority-group-header priority-group-header--${priorityKey}`}>
                          <h4>
                            {level === 'alta' ? '🔥 Prioridade Máxima' : 
                             level === 'média' ? '⚡ Média Prioridade' : 
                             '💤 Baixa Prioridade'}
                          </h4>
                          <span className="priority-count">{levelTasks.length} {levelTasks.length === 1 ? 'item' : 'itens'}</span>
                        </div>
                        
                        {levelTasks.map((item, pIndex) => {
                          const globalIndex = result.priorities.findIndex(p => p === item);
                          const isExpanded = expandedTask === globalIndex;
                          
                          return (
                            <div key={pIndex} className={`task-card task-card-${priorityKey}`}>
                              <div className="task-header">
                                <span className="task-name">{item.task}</span>
                                <div className="task-header-right">
                                  <button
                                    id={`details-btn-${globalIndex}`}
                                    className="details-toggle-btn"
                                    onClick={() => setExpandedTask(isExpanded ? null : globalIndex)}
                                    aria-expanded={isExpanded}
                                  >
                                    {isExpanded ? 'Ocultar' : 'Por que?'}
                                    <span className={`details-chevron ${isExpanded ? 'details-chevron--open' : ''}`}>›</span>
                                  </button>
                                </div>
                              </div>
                              <div className={`task-details ${isExpanded ? 'task-details--open' : ''}`}>
                                <div className="task-details-inner">
                                  <div className="reason-container">
                                    <p className="task-details-label">Justificativa da análise</p>
                                    <p className="task-reason">{item.reason}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : result.tasks ? (
              <div className="task-list-container">
                <div className="task-list-intro">
                  <h3>Priorização das Tarefas</h3>
                  <p>Análise detalhada baseada em urgência e impacto.</p>
                </div>

                <div className="task-list">
                  {['high', 'medium', 'low'].map((priority) => {
                    const tasks = result.tasks!.filter(t => t.priority === priority);
                    if (tasks.length === 0) return null;

                    return (
                      <div key={priority} className="priority-group">
                        <div className={`priority-group-header priority-group-header--${priority}`}>
                          <h4>
                            {priority === 'high' ? '🔥 Prioridade Máxima' : 
                             priority === 'medium' ? '⚡ Média Prioridade' : 
                             '💤 Baixa Prioridade'}
                          </h4>
                          <span className="priority-count">{tasks.length} {tasks.length === 1 ? 'item' : 'itens'}</span>
                        </div>
                        
                        {tasks.map((task, pIndex) => {
                          const globalIndex = result.tasks!.findIndex(t => t === task);
                          const isExpanded = expandedTask === globalIndex;
                          
                          return (
                            <div key={pIndex} className={`task-card task-card-${task.priority}`}>
                              <div className="task-header">
                                <span className="task-name">{task.name}</span>
                                <div className="task-header-right">
                                  <button
                                    id={`details-btn-${globalIndex}`}
                                    className="details-toggle-btn"
                                    onClick={() => setExpandedTask(isExpanded ? null : globalIndex)}
                                    aria-expanded={isExpanded}
                                  >
                                    {isExpanded ? 'Ocultar' : 'Por que?'}
                                    <span className={`details-chevron ${isExpanded ? 'details-chevron--open' : ''}`}>›</span>
                                  </button>
                                </div>
                              </div>
                              <div className={`task-details ${isExpanded ? 'task-details--open' : ''}`}>
                                <div className="task-details-inner">
                                  <div className="reason-container">
                                    <p className="task-details-label">Justificativa da análise</p>
                                    <p className="task-reason">{task.reason}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="task-list-container">
                <div className="task-list-intro">
                  <h3>Por que esta ação?</h3>
                  <p>O Decido focou no próximo passo de maior retorno e menor fricção agora.</p>
                </div>
                <div className="task-list">
                  <div className="task-card task-card-high">
                    <div className="task-details task-details--open" style={{ maxHeight: 'none' }}>
                       <div className="task-details-inner" style={{ paddingTop: '1.2rem' }}>
                         <div className="reason-container" style={{ marginTop: 0 }}>
                           <p className="task-reason" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>{result.reason}</p>
                         </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="next-actions-container">
              <p className="next-actions-label">Próximos passos sugeridos:</p>
              <div className="next-actions-grid">
                <button className="next-action-pill" onClick={() => alert('Recurso em desenvolvimento: Lembrete')}>
                  <span>Lembrete</span>
                </button>
                <button className="next-action-pill" onClick={() => handleCopy()}>
                  <span>Compartilhar</span>
                </button>
                <button className="next-action-pill" onClick={() => alert('Recurso em desenvolvimento: Alternativas')}>
                  <span>Explorar alternativas</span>
                </button>
                <button className="next-action-pill" onClick={() => alert('Recurso em desenvolvimento: Exoneração Técnica')}>
                  <span>Entender melhor essa decisão</span>
                </button>
              </div>
            </div>
          </section>
        )}

        <footer id="app-footer" className={(tourStep === 4) ? 'tour-highlight-container' : ''} style={{ textAlign: 'center', opacity: (tourStep === 4) ? 1 : 0.5, fontSize: '0.9rem', marginTop: 'auto', marginBottom: '20px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center', borderRadius: '1rem', position: 'relative' }}>
          <div className={tourStep === 4 ? 'tour-highlight' : ''} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
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
          </div>
          {tourStep === 4 && renderTourPopover(4)}
        </footer>

      </div>
    </main>
  );
}
