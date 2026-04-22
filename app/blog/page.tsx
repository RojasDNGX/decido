import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog Decido | Dicas de Produtividade e Gestão de Tempo',
  description: 'Aprenda a vencer a fadiga de decisão e a priorizar o que realmente importa com os artigos do Decido.',
};

export default function BlogListing() {
  return (
    <main>
      <div className="landing-container" style={{ paddingTop: '8rem', paddingBottom: '8rem' }}>
        <Link href="/" style={{ color: 'var(--primary)', textDecoration: 'none', marginBottom: '3rem', display: 'block', fontSize: '0.9rem', fontWeight: '600' }}>← Voltar para Home</Link>
        <h1 className="landing-h1" style={{ marginBottom: '4rem' }}>Blog Decido</h1>
        <div className="grid-responsive">
          <article style={{ padding: '2.5rem', background: 'var(--glass)', borderRadius: '1.5rem', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '0.1em' }}>PRODUTIVIDADE</span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', lineHeight: '1.2' }}>Como vencer a fadiga de decisão</h2>
            <p style={{ color: '#a3a3a3', fontSize: '1rem', lineHeight: '1.6' }}>Descubra como delegar pequenas escolhas para a tecnologia pode liberar sua energia mental para o que realmente importa.</p>
            <Link href="/blog/vencendo-fadiga-decisao" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none', marginTop: 'auto' }}>Ler mais →</Link>
          </article>

          <article style={{ padding: '2.5rem', background: 'var(--glass)', borderRadius: '1.5rem', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '0.1em' }}>IA & TRABALHO</span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', lineHeight: '1.2' }}>O futuro da priorização com IA</h2>
            <p style={{ color: '#a3a3a3', fontSize: '1rem', lineHeight: '1.6' }}>Por que listas de tarefas estáticas estão morrendo e como a inteligência artificial está criando fluxos de trabalho dinâmicos.</p>
            <Link href="/blog/futuro-priorizacao-ia" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none', marginTop: 'auto' }}>Ler mais →</Link>
          </article>

          <article style={{ padding: '2.5rem', background: 'var(--glass)', borderRadius: '1.5rem', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '0.1em' }}>FOCO</span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', lineHeight: '1.2' }}>A arte de dizer não às tarefas certas</h2>
            <p style={{ color: '#a3a3a3', fontSize: '1rem', lineHeight: '1.6' }}>Priorizar não é apenas escolher o que fazer, mas ter a clareza de saber o que ignorar sem culpa.</p>
            <Link href="/blog/arte-dizer-nao" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none', marginTop: 'auto' }}>Ler mais →</Link>
          </article>
        </div>
      </div>
    </main>
  );
}
