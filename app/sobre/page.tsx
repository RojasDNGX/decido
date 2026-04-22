import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sobre o Decido | Nossa Missão',
  description: 'Conheça a história por trás do Decido e como estamos ajudando pessoas a recuperarem sua clareza mental e foco.',
};

export default function AboutPage() {
  return (
    <main>
      <div className="landing-container" style={{ paddingTop: '8rem', paddingBottom: '8rem' }}>
        <Link href="/" style={{ color: 'var(--primary)', textDecoration: 'none', marginBottom: '3rem', display: 'block', fontSize: '0.9rem', fontWeight: '600' }}>← Voltar para Home</Link>
        <h1 className="landing-h1" style={{ marginBottom: '4rem' }}>Sobre o Decido</h1>
        
        <div className="grid-responsive">
          <section style={{ padding: '2.5rem', background: 'var(--glass)', borderRadius: '1.5rem', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '0.1em' }}>NOSSA HISTÓRIA</span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', lineHeight: '1.2' }}>O fim da paralisia da escolha</h2>
            <p style={{ color: '#a3a3a3', fontSize: '1rem', lineHeight: '1.6' }}>
              O Decido nasceu para ajudar pessoas produtivas a superarem a fadiga de decisão. 
              Em um mundo com excesso de informação, o problema não é a falta de tarefas, mas a clareza de saber qual delas importa agora.
            </p>
          </section>

          <section style={{ padding: '2.5rem', background: 'var(--glass)', borderRadius: '1.5rem', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '0.1em' }}>TECNOLOGIA</span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', lineHeight: '1.2' }}>IA com propósito</h2>
            <p style={{ color: '#a3a3a3', fontSize: '1rem', lineHeight: '1.6' }}>
              Nossa missão é usar inteligência artificial para filtrar o ruído e dizer exatamente o que você deve fazer. 
              Não somos apenas mais um gerenciador de tarefas; somos o seu assistente de decisão.
            </p>
          </section>

          <section style={{ padding: '2.5rem', background: 'var(--primary)', borderRadius: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', color: 'white', justifyContent: 'center', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '900' }}>Pronto para focar?</h2>
            <p style={{ fontSize: '1rem', opacity: 0.9 }}>Recupere sua energia mental hoje mesmo.</p>
            <Link href="/decidir" style={{ display: 'inline-block', padding: '1rem 2rem', background: 'white', color: 'var(--primary)', borderRadius: '1rem', textDecoration: 'none', fontWeight: '800', fontSize: '1.1rem', marginTop: '1rem' }}>
              Começar agora
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}
