'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const PERSON_ICON = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

interface ProfileMenuProps {
  activeContext: string;
  onContextChange: (label: string) => void;
}

const CONTEXTS = [
  { label: 'Você > pessoal', main: 'Você', sub: 'pessoal' },
  { label: 'Time > workspace', main: 'Time', sub: 'workspace' },
];

export default function ProfileMenu({ activeContext, onContextChange }: ProfileMenuProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  if (!session) {
    return (
      <button
        className="quick-action-btn"
        title="Entrar"
        onClick={() => router.push('/auth/signin')}
      >
        {PERSON_ICON}
      </button>
    );
  }

  const plan = (session.user as { plan?: string })?.plan ?? 'free';
  const isPro = plan === 'pro' || plan === 'enterprise';
  const isEnterprise = plan === 'enterprise';

  return (
    <div
      ref={menuRef}
      className="context-switcher"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div style={{ position: 'relative', display: 'inline-flex' }}>
        <button
          className="quick-action-btn"
          title={session.user?.name ?? 'Minha conta'}
          onClick={() => setOpen(o => !o)}
          style={{ padding: '4px' }}
        >
          {session.user?.image ? (
            <img
              src={session.user.image}
              alt={session.user.name ?? 'avatar'}
              style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            PERSON_ICON
          )}
        </button>
        {isPro && (
          <span style={{
            position: 'absolute',
            bottom: '-2px',
            right: '-6px',
            fontSize: '9px',
            fontWeight: 700,
            letterSpacing: '0.04em',
            background: '#6366f1',
            color: '#fff',
            padding: '1px 4px',
            borderRadius: '4px',
            lineHeight: 1.4,
            pointerEvents: 'none',
          }}>
            PRO
          </span>
        )}
      </div>

      {open && (
        <div className="context-switcher-menu">
          <div className="context-switcher-item" style={{ pointerEvents: 'none', paddingBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.75rem', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Plano atual</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
              <span style={{ fontWeight: 700, color: isPro ? '#818cf8' : 'white' }}>{isPro ? 'PRO' : 'FREE'}</span>
              {!isPro && (
                <Link href="/limite" style={{ fontSize: '0.75rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
                  Upgrade
                </Link>
              )}
            </div>
          </div>
          
          <div className="context-switcher-divider" />

          <Link
            href="/minha-conta"
            className="context-switcher-item"
            style={{ textDecoration: 'none' }}
            onClick={() => setOpen(false)}
          >
            Meu Perfil
          </Link>

          <div className="context-switcher-divider" />

          {CONTEXTS.map(({ label, main, sub }) => {
            const isWorkspaceItem = label.includes('Time > workspace');
            const disabled = isWorkspaceItem && !isEnterprise;

            return (
              <button
                key={label}
                className={`context-switcher-item${activeContext === label ? ' context-switcher-item--active' : ''}`}
                style={{
                  cursor: disabled ? 'not-allowed' : 'pointer'
                }}
                onClick={() => {
                  if (disabled) return;
                  onContextChange(label);
                  setOpen(false);
                }}
                title={disabled ? 'Recurso exclusivo do plano Enterprise' : ''}
              >
                {main} <span style={{ opacity: 0.45 }}>{`- ${sub}`}</span>
              </button>
            );
          })}
          <button
            className="context-switcher-item context-switcher-item--muted"
            style={{
              cursor: !isEnterprise ? 'not-allowed' : 'pointer'
            }}
            onClick={() => {
              if (!isEnterprise) return;
              setOpen(false);
            }}
            title={!isEnterprise ? 'Recurso exclusivo do plano Enterprise' : ''}
          >
            + Criar workspace
          </button>

          <div className="context-switcher-divider" />

          <button
            className="context-switcher-item context-switcher-item--muted"
            onClick={() => { signOut(); setOpen(false); }}
          >
            Sair
          </button>
        </div>
      )}
    </div>
  );
}
