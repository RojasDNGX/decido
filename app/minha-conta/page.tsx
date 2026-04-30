'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function MinhaContaPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/decidir');
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
        <div className="limit-reached-card" style={{ maxWidth: '420px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left', padding: '2rem' }}>
          {session.user?.image && (
            <img
              src={session.user.image}
              alt="avatar"
              style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }}
            />
          )}
          <div>
            <p style={{ fontSize: '1.15rem', fontWeight: 600, margin: 0 }}>{session.user?.name}</p>
            <p style={{ fontSize: '0.9rem', opacity: 0.6, margin: '0.25rem 0 0' }}>{session.user?.email}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ opacity: 0.6 }}>Plano</span>
            <span
              className="history-item-badge"
              style={{
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                fontSize: '0.75rem',
                ...(plan === 'pro' ? { background: 'rgba(99,102,241,0.15)', color: '#818cf8' } : {}),
              }}
            >
              {plan === 'pro' ? 'PRO' : 'Free'}
            </span>
          </div>
          <button
            className="clear-data-btn"
            style={{ marginTop: '0.75rem', alignSelf: 'flex-start' }}
            onClick={() => signOut({ callbackUrl: '/decidir' })}
          >
            Sair da conta
          </button>
        </div>
      </div>
    </main>
  );
}
