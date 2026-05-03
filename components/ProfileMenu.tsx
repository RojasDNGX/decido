'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
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
        onClick={() => signIn('google')}
      >
        {PERSON_ICON}
      </button>
    );
  }

  const isPro = (session.user as { plan?: string })?.plan === 'pro';

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
          <Link
            href="/minha-conta"
            className="context-switcher-item"
            style={{ textDecoration: 'none' }}
            onClick={() => setOpen(false)}
          >
            Minha conta
          </Link>

          <div className="context-switcher-divider" />

          {CONTEXTS.map(({ label, main, sub }) => (
            <button
              key={label}
              className={`context-switcher-item${activeContext === label ? ' context-switcher-item--active' : ''}`}
              onClick={() => {
                onContextChange(label);
                setOpen(false);
              }}
            >
              {main} <span style={{ opacity: 0.45 }}>{`- ${sub}`}</span>
            </button>
          ))}
          <button
            className="context-switcher-item context-switcher-item--muted"
            onClick={() => setOpen(false)}
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
