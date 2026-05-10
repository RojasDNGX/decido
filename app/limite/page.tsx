'use client';

import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';
import { useState } from 'react';
import ProfileMenu from '@/components/ProfileMenu';

import { useRouter } from 'next/navigation';

export default function LimitePage() {
  const { data: session, update: updateSession } = useSession();
  const router = useRouter();
  const [activeContext, setActiveContext] = useState('Você > pessoal');
  const [loading, setLoading] = useState(false);
  const [upgraded, setUpgraded] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
      });
      
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Erro ao processar upgrade. Tente novamente.');
      }
    } catch (e) {
      alert('Falha na conexão.');
    } finally {
      setLoading(false);
    }
  };

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
          <ProfileMenu activeContext={activeContext} onContextChange={setActiveContext} />
          <Link href="/" className="quick-action-btn" title="Ir para Home" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </Link>
          <Link href="/decidir" className="quick-action-btn" title="Voltar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </Link>
        </div>
      </header>

      <div className="container">
        <header className="header">
          <h1>Decido</h1>
          <p>Seu assistente inteligente de decisões</p>
        </header>

        <div className="limit-reached-card" style={{ maxWidth: '500px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'center', padding: '2rem', alignItems: 'center' }}>
          {!upgraded ? (
            <>
              <span className="limit-reached-icon">✨</span>
              <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Decida com Inteligência Estratégica</h2>
              <p style={{ maxWidth: '100%', opacity: 0.8 }}>O Decido PRO entende o porquê de cada tarefa e mantém seu contexto vivo.</p>

              <div className="upgrade-card-experience" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'transparent', border: 'none', padding: 0 }}>
                <div className="experience-comparison" style={{ marginTop: '1rem' }}>
                  <div className="comparison-row" style={{ gap: '1rem', width: '100%', display: 'flex' }}>
                    <div className="comparison-item" style={{ textAlign: 'left', flex: '1 1 0', width: '50%' }}>
                      <p className="comparison-label">FREE</p>
                      <ul className="experience-list" style={{ fontSize: '0.85rem' }}>
                        <li>• Decisões isoladas</li>
                        <li>• Limite diário</li>
                        <li>• Sem contexto acumulado</li>
                      </ul>
                    </div>
                    <div className="comparison-divider" />
                    <div className="comparison-item" style={{ textAlign: 'left', flex: '1 1 0', width: '50%' }}>
                      <p className="comparison-label comparison-label--pro">PRO</p>
                      <ul className="experience-list experience-list--pro" style={{ fontSize: '0.85rem' }}>
                        <li>• Justificativas Estratégicas</li>
                        <li>• Segurança Automática</li>
                        <li>• Contexto acumulado</li>
                        <li>• Sem limite diário</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div style={{ marginTop: '2rem', marginBottom: '1rem' }}>
                    <p style={{ fontSize: '1.5rem', fontWeight: 800 }}>R$19<span style={{ fontSize: '0.9rem', opacity: 0.6 }}>/mês</span></p>
                  </div>

                  {!session ? (
                    <button 
                      className="limit-modal-cta" 
                      style={{ width: '100%' }}
                      onClick={() => signIn('google', { callbackUrl: '/limite' })}
                    >
                      Entrar para continuar
                    </button>
                  ) : (
                    <button 
                      className="limit-modal-cta" 
                      style={{ width: '100%' }}
                      onClick={handleUpgrade}
                      disabled={loading}
                    >
                      {loading ? 'Processando...' : 'Fazer Upgrade para PRO'}
                    </button>
                  )}
                  
                  <button 
                    className="clear-data-btn" 
                    style={{ marginTop: '1rem', background: 'transparent', border: 'none', opacity: 0.6 }}
                    onClick={() => router.push('/decidir')}
                  >
                    Voltar para o plano gratuito
                  </button>
                  
                  <p style={{ fontSize: '0.75rem', marginTop: '1.5rem', opacity: 0.5 }}>
                    Você pode cancelar a qualquer momento.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div style={{ padding: '2rem 0' }}>
              <span className="limit-reached-icon">🎉</span>
              <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>Agora o Decido continua com você</h2>
              <p style={{ opacity: 0.8, marginBottom: '2rem' }}>Seu plano PRO está ativo. Suas próximas decisões terão todo o contexto acumulado.</p>
              <button 
                className="limit-modal-cta" 
                onClick={() => window.location.href = '/decidir'}
                style={{ width: '100%' }}
              >
                Começar a decidir
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
