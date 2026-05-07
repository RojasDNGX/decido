'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getOrCreateFingerprint } from '@/services/storage/storage';

export default function MinhaContaPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [usageCount, setUsageCount] = useState<number | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/decidir');
    
    if (status === 'authenticated') {
      const fetchUsage = async () => {
        try {
          const fp = getOrCreateFingerprint();
          const res = await fetch(`/api/usage/sync?fingerprint=${fp}`);
          const data = await res.json();
          setUsageCount(data.count);
        } catch (e) {
          // fallback
        }
      };
      fetchUsage();
    }
  }, [status, router]);

  if (status === 'loading' || !session) return null;

  const plan = (session.user as { plan?: string })?.plan ?? 'free';

  return (
    <main>
      <header style={{ width: '100%', maxWidth: '1400px', margin: '0 auto', padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" className="logo-container" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', transition: 'opacity 0.2s' }}>
          <img src="/images/app-icon.png" alt="Decido Logo" style={{ width: '52px', height: '52px', borderRadius: '12px', objectFit: 'cover' }} />
        </Link>
        <div className="quick-actions" style={{ display: 'flex', gap: '0.75rem' }}>
          <Link href="/decidir" className="quick-action-btn" title="Voltar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </Link>
        </div>
      </header>

      <div className="container">
        <div className="limit-reached-card" style={{ maxWidth: '500px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'center', padding: '2rem', alignItems: 'center' }}>
          {session.user?.image && (
            <img
              src={session.user.image}
              alt="avatar"
              style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', marginBottom: '0.5rem' }}
            />
          )}
          <div style={{ marginBottom: '0.5rem' }}>
            <p style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>{session.user?.name}</p>
            <p style={{ fontSize: '0.9rem', opacity: 0.6, margin: '0.25rem 0 0' }}>{session.user?.email}</p>
          </div>
          <div className="upgrade-card-experience" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p className="upgrade-card-title" style={{ marginBottom: '0.25rem' }}>Plano atual: <span style={{ color: plan === 'pro' ? '#818cf8' : 'inherit' }}>{plan.toUpperCase()}</span></p>
            {plan === 'free' && usageCount !== null && (
              <p style={{ fontSize: '0.85rem', opacity: 0.6, marginBottom: '1.25rem' }}>
                {usageCount === 0 ? 'Você ainda não decidiu hoje' : (usageCount === 1 ? 'Você decidiu 1 vez hoje' : `Você decidiu ${usageCount} vezes hoje`)}
              </p>
            )}
            
            {plan === 'pro' && (
              <div style={{ margin: '1.5rem 0' }}>
                <p style={{ color: '#818cf8', fontWeight: 600, fontSize: '1.1rem' }}>Você está decidindo com continuidade</p>
                <p style={{ fontSize: '0.9rem', opacity: 0.6, marginTop: '0.5rem' }}>O Decido acompanha você ao longo do dia.</p>
              </div>
            )}

            <div className="experience-comparison">
              <div className="comparison-row" style={{ width: '100%', display: 'flex' }}>
                <div className="comparison-item" style={{ textAlign: 'left', flex: '1 1 0', width: '50%' }}>
                  <p className="comparison-label">FREE</p>
                  <ul className="experience-list">
                    <li>• decisões baseadas no agora</li>
                    <li>• cada decisão começa do zero</li>
                    <li>• limite diário</li>
                  </ul>
                </div>
                <div className="comparison-divider" />
                <div className="comparison-item" style={{ textAlign: 'left', flex: '1 1 0', width: '50%' }}>
                  <p className="comparison-label comparison-label--pro">PRO</p>
                  <ul className="experience-list experience-list--pro">
                    <li>• o Decido continua com você</li>
                    <li>• decisões com contexto acumulado</li>
                    <li>• sem limite</li>
                    <li>• menos esforço ao longo do dia</li>
                  </ul>
                </div>
              </div>
              {plan === 'free' && (
                <button 
                  className="limit-modal-cta" 
                  style={{ marginTop: '1.5rem', width: '100%' }}
                  onClick={() => router.push('/limite')}
                >
                  Decidir com continuidade
                </button>
              )}
            </div>
          </div>
          <button
            className="clear-data-btn"
            style={{ marginTop: '0.75rem', alignSelf: 'center' }}
            onClick={() => signOut({ callbackUrl: '/decidir' })}
          >
            Sair da conta
          </button>
        </div>
      </div>
    </main>
  );
}
