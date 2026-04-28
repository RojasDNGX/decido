'use client';

import Link from 'next/link';

export default function LimitePage() {
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

        <div className="quick-actions" style={{ display: 'flex', gap: '0.75rem' }}>
          <Link href="/" className="quick-action-btn" title="Ir para Home" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </Link>
          <Link href="/decidir" className="quick-action-btn" title="Histórico" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
          </Link>
        </div>
      </header>

      <div className="container">
        <header className="header">
          <h1>Decido</h1>
          <p>Seu assistente inteligente de decisões</p>
        </header>

        <div className="limit-reached-card" style={{ maxWidth: '100%' }}>
          <span className="limit-reached-icon">🔒</span>
          <h2>Limite atingido</h2>
          <p style={{ maxWidth: '100%' }}>Você usou todas as análises do plano gratuito.</p>
          <p className="limit-reached-sub" style={{ maxWidth: '100%' }}>Tente novamente amanhã.</p>
        </div>

        <div className="empty-history-card" style={{ marginTop: '1rem', textAlign: 'center', gap: '0.5rem', maxWidth: '100%' }}>
          <span className="empty-history-icon">✨</span>
          <p className="empty-history-title">Planos e estrutura Enterprise em breve</p>
          <p className="empty-history-sub" style={{ maxWidth: '100%' }}>
            Estamos construindo opções para quem precisa decidir mais, com mais contexto e em escala.
            <br />
            Obrigado por usar o Decido no plano gratuito — sua confiança nos motiva.
          </p>
        </div>
      </div>
    </main>
  );
}
