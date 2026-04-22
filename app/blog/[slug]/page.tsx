import Link from 'next/link';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const title = params.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  return {
    title: `${title} | Blog Decido`,
    description: `Leia mais sobre ${title.toLowerCase()} e como o Decido pode ajudar sua produtividade.`,
  };
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  return (
    <main>
      <div className="landing-container" style={{ paddingTop: '8rem', paddingBottom: '8rem', maxWidth: '1000px' }}>
        <Link href="/blog" style={{ color: 'var(--primary)', textDecoration: 'none', marginBottom: '3rem', display: 'block', fontSize: '0.9rem', fontWeight: '600' }}>← Voltar para o Blog</Link>
        <article>
          <h1 className="landing-h1" style={{ marginBottom: '2.5rem' }}>{params.slug.replace(/-/g, ' ')}</h1>
          <div style={{ color: '#d1d5db', lineHeight: '1.8', fontSize: '1.1rem' }}>
            <p>Este é um artigo de exemplo sobre como o Decido ajuda você a focar no que importa.</p>
            <p style={{ marginTop: '2rem' }}>[Conteúdo em desenvolvimento]</p>
          </div>
        </article>
        
        <div style={{ marginTop: '4rem', padding: '2.5rem', background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', borderRadius: '1.5rem', textAlign: 'center' }}>
          <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1.5rem' }}>Pronto para simplificar sua vida?</h2>
          <Link href="/decidir" style={{ display: 'inline-block', padding: '1rem 2rem', background: 'white', color: '#1e3a8a', borderRadius: '1rem', fontWeight: 'bold', textDecoration: 'none' }}>
            Testar o Decido agora
          </Link>
        </div>
      </div>
    </main>
  );
}

