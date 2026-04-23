import Link from 'next/link';
import { Metadata } from 'next';
import { posts } from './posts';

export const metadata: Metadata = {
  title: 'Blog Decido | Dicas de Produtividade e Gestão de Tempo',
  description:
    'Aprenda a priorizar, decidir mais rápido e parar de procrastinar com os artigos práticos do Decido.',
};

export default function BlogListing() {
  return (
    <main>
      <div className="landing-container" style={{ paddingTop: '8rem', paddingBottom: '8rem' }}>
        <Link
          href="/"
          style={{
            color: 'var(--primary)',
            textDecoration: 'none',
            marginBottom: '3rem',
            display: 'block',
            fontSize: '0.9rem',
            fontWeight: '600',
          }}
        >
          ← Voltar para Home
        </Link>

        <h1 className="landing-h1" style={{ marginBottom: '1.5rem' }}>
          Ideias para quem decide.
        </h1>
        <p
          style={{
            color: '#a3a3a3',
            fontSize: '1.1rem',
            marginBottom: '4rem',
            maxWidth: '540px',
            lineHeight: '1.6'
          }}
        >
          Conteúdo prático para quem não tem tempo a perder com indecisão e busca foco estratégico na rotina.
        </p>

        <div className="grid-responsive">
          {posts.map((post) => (
            <article
              key={post.slug}
              style={{
                padding: '2.5rem',
                background: 'var(--glass)',
                borderRadius: '1.5rem',
                border: '1px solid var(--glass-border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: '800',
                    color: 'var(--primary)',
                    letterSpacing: '0.1em',
                  }}
                >
                  {post.category}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{post.readTime}</span>
              </div>

              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', lineHeight: '1.25' }}>
                {post.title}
              </h2>

              <p style={{ color: '#a3a3a3', fontSize: '1rem', lineHeight: '1.6', flex: 1 }}>
                {post.description}
              </p>

              <Link
                href={`/blog/${post.slug}`}
                style={{
                  color: 'var(--primary)',
                  fontWeight: '700',
                  textDecoration: 'none',
                  marginTop: 'auto',
                  fontSize: '0.95rem',
                }}
              >
                Ler artigo →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
