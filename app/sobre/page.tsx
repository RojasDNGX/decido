import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nossa Missão | Decido',
  description: 'Conheça o propósito do Decido: eliminar a paralisia da escolha e devolver a clareza mental para quem precisa executar com impacto.',
};

export default function AboutPage() {
  return (
    <main>
      <div className="landing-container" style={{ paddingTop: '8rem', paddingBottom: '8rem' }}>
        <Link href="/" style={{ color: 'var(--primary)', textDecoration: 'none', marginBottom: '3rem', display: 'block', fontSize: '0.9rem', fontWeight: '600' }}>← Voltar para Home</Link>
        <h1 className="landing-h1" style={{ marginBottom: '4rem' }}>Clareza para quem executa.</h1>
        
        <div className="grid-responsive">
          <section style={{ padding: '2.5rem', background: 'var(--glass)', borderRadius: '1.5rem', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '0.1em' }}>A CAUSA</span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', lineHeight: '1.2' }}>O fim da paralisia da escolha</h2>
            <p style={{ color: '#a3a3a3', fontSize: '1rem', lineHeight: '1.6' }}>
              O Decido não é sobre fazer mais — é sobre fazer o que importa. Em um mundo saturado de ruído, a maior riqueza é a clareza. Resolvemos o atrito da decisão para que você possa focar no que realmente move o ponteiro.
            </p>
          </section>

          <section style={{ padding: '2.5rem', background: 'var(--glass)', borderRadius: '1.5rem', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '0.1em' }}>FILOSOFIA</span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', lineHeight: '1.2' }}>Inteligência com intenção</h2>
            <p style={{ color: '#a3a3a3', fontSize: '1rem', lineHeight: '1.6' }}>
              Não somos apenas algoritmos. Somos um filtro entre o caos da sua rotina e a paz de um plano de ação pronto. Usamos tecnologia para traduzir complexidade em simplicidade imediata.
            </p>
          </section>

          <section style={{ padding: '2.5rem', background: 'var(--primary)', borderRadius: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', color: 'white', justifyContent: 'center', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '900' }}>Chega de perder tempo decidindo.</h2>
            <p style={{ fontSize: '1rem', opacity: 0.9 }}>Recupere sua energia mental agora.</p>
            <Link href="/decidir" style={{ display: 'inline-block', padding: '1rem 2rem', background: 'white', color: 'var(--primary)', borderRadius: '1rem', textDecoration: 'none', fontWeight: '800', fontSize: '1.1rem', marginTop: '1rem' }}>
              Começar Grátis
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}
