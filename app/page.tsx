'use client';

import { useState } from 'react';

interface Task {
  name: string;
  priority: 'high' | 'medium' | 'low';
  reason: string;
}

interface AnalysisResult {
  tasks: Task[];
  recommended_action: string;
}

export default function Home() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [decisionsLeft, setDecisionsLeft] = useState(5);

  const handleAnalyze = async () => {
    if (!input.trim()) {
      setError('Por favor, descreva suas tarefas para que eu possa decidi-las.');
      return;
    }

    if (decisionsLeft <= 0) {
      setError('Limite de uso do plano gratuito atingido. Faça upgrade para continuar decidindo.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

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
      setDecisionsLeft((prev) => prev - 1);
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <div className="container">
        <header className="header">
          <h1>Decido</h1>
          <p>Seu assistente inteligente de decisões</p>
        </header>

        <section className="input-section">
          <textarea
            rows={4}
            placeholder="O que você precisa fazer hoje? (ex: Preciso estudar, pagar conta hoje e ir na academia)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button onClick={handleAnalyze} disabled={loading || !input.trim()}>
            {loading ? 'Analisando...' : 'Analisar'}
          </button>
        </section>

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
              {result.tasks.map((task, index) => (
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
          </section>
        )}

        <footer style={{ textAlign: 'center', opacity: 0.5, fontSize: '0.9rem', marginTop: 'auto', padding: '2rem 0' }}>
          Plano Gratuito: {decisionsLeft} {decisionsLeft === 1 ? 'decisão restante' : 'decisões restantes'}
        </footer>
      </div>
    </main>
  );
}
