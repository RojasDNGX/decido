import Link from 'next/link';
import { getShare } from '@/lib/share-db';
import { Priority, Task } from '@/types';

const PRIORITY_LEVELS: Priority['level'][] = ['alta', 'média', 'baixa'];
const TASK_LEVELS: Task['priority'][] = ['high', 'medium', 'low'];

export default async function SharedDecisionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const share = getShare(id);

  if (!share) {
    return (
      <main>
        <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <p style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--foreground)' }}>Decisão indisponível</p>
          <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>Este link não contém uma decisão válida.</p>
          <Link href="/decidir" style={{ marginTop: '0.5rem', color: '#6b7280', fontSize: '0.85rem', textDecoration: 'none' }}>
            Tomar nova decisão
          </Link>
        </div>
      </main>
    );
  }

  const result = share.output;

  return (
    <main>
      <header
        style={{
          width: '100%',
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '1.5rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Link
          href="/decidir"
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', opacity: 0.8 }}
        >
          <img
            src="/images/app-icon.png"
            alt="Decido"
            style={{ width: '40px', height: '40px', borderRadius: '10px', objectFit: 'cover' }}
          />
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <span
            style={{
              fontSize: '0.75rem',
              color: '#6b7280',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '2rem',
              padding: '0.3rem 0.85rem',
              letterSpacing: '0.03em',
            }}
          >
            Visualização compartilhada
          </span>
          <Link
            href="/decidir"
            style={{
              fontSize: '0.75rem',
              color: '#6b7280',
              opacity: 0.65,
              textDecoration: 'none',
              fontWeight: 400,
              whiteSpace: 'nowrap',
            }}
          >
            Tomar decisão
          </Link>
        </div>
      </header>

      <div className="container" style={{ paddingBottom: '4rem' }}>
        <div className="recommended-card">
          <div className="recommended-card-header">
            <div className="recommended-badge-container">
              <span className="recommended-badge">O que fazer agora</span>
            </div>
          </div>
          <div className="recommended-content">
            <p className="recommended-action-line">
              <span className="recommended-label">Próxima ação:</span>
              <span className="recommended-text">
                {result.primary_action || result.recommended_action}
              </span>
            </p>
          </div>
        </div>

        {result.priorities ? (
          <div className="task-list-container">
            <div className="task-list-intro">
              <h3>Priorização das Tarefas</h3>
              <p>Análise detalhada baseada em urgência e impacto.</p>
            </div>
            <div className="task-list">
              {PRIORITY_LEVELS.map((level) => {
                const levelTasks = result.priorities.filter((p) => p.level === level);
                if (levelTasks.length === 0) return null;
                const priorityKey =
                  level === 'alta' ? 'high' : level === 'média' ? 'medium' : 'low';
                return (
                  <div key={level} className="priority-group">
                    <div className={`priority-group-header priority-group-header--${priorityKey}`}>
                      <h4>
                        {level === 'alta'
                          ? '🔥 Prioridade Máxima'
                          : level === 'média'
                          ? '⚡ Média Prioridade'
                          : '💤 Baixa Prioridade'}
                      </h4>
                      <span className="priority-count">
                        {levelTasks.length} {levelTasks.length === 1 ? 'item' : 'itens'}
                      </span>
                    </div>
                    {levelTasks.map((item, pIndex) => (
                      <div
                        key={item.task}
                        className={`task-card task-card-${priorityKey}${pIndex > 0 ? ' task-card--secondary' : ''}`}
                      >
                        <div className="task-header">
                          <div className="task-name-row">
                            <span
                              className={`task-order${levelTasks.length <= 1 ? ' task-order--hidden' : ''}`}
                            >
                              {pIndex + 1}.
                            </span>
                            <span className="task-name">{item.task}</span>
                          </div>
                          <button
                            className="details-toggle-btn shared-details-toggle"
                            data-target={`shared-reason-${item.task}`}
                          >
                            Por que?
                            <span className="details-chevron">›</span>
                          </button>
                        </div>
                        <div className="task-details task-details--open">
                          <div className="task-details-inner">
                            <div className="reason-container">
                              <p className="task-details-label">Justificativa da análise</p>
                              <p className="task-reason">{item.reason}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
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
              {TASK_LEVELS.map((priority) => {
                const tasks = (result.tasks ?? []).filter((t) => t.priority === priority);
                if (tasks.length === 0) return null;
                return (
                  <div key={priority} className="priority-group">
                    <div className={`priority-group-header priority-group-header--${priority}`}>
                      <h4>
                        {priority === 'high'
                          ? '🔥 Prioridade Máxima'
                          : priority === 'medium'
                          ? '⚡ Média Prioridade'
                          : '💤 Baixa Prioridade'}
                      </h4>
                      <span className="priority-count">
                        {tasks.length} {tasks.length === 1 ? 'item' : 'itens'}
                      </span>
                    </div>
                    {tasks.map((task, pIndex) => (
                      <div
                        key={task.name}
                        className={`task-card task-card-${task.priority}${pIndex > 0 ? ' task-card--secondary' : ''}`}
                      >
                        <div className="task-header">
                          <div className="task-name-row">
                            <span
                              className={`task-order${tasks.length <= 1 ? ' task-order--hidden' : ''}`}
                            >
                              {pIndex + 1}.
                            </span>
                            <span className="task-name">{task.name}</span>
                          </div>
                        </div>
                        <div className="task-details task-details--open">
                          <div className="task-details-inner">
                            <div className="reason-container">
                              <p className="task-details-label">Justificativa da análise</p>
                              <p className="task-reason">{task.reason}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
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
                      <p className="task-reason" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                        {result.reason}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
