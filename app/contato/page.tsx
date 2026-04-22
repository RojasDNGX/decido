import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contato | Decido',
  description: 'Entre em contato com a equipe do Decido para suporte, feedbacks ou parcerias.',
};

export default function ContactPage() {
  return (
    <main>
      <div className="landing-container" style={{ paddingTop: '8rem', paddingBottom: '8rem' }}>
        <Link href="/" style={{ color: 'var(--primary)', textDecoration: 'none', marginBottom: '3rem', display: 'block', fontSize: '0.9rem', fontWeight: '600' }}>← Voltar para Home</Link>
        <h1 className="landing-h1" style={{ marginBottom: '4rem' }}>Contato</h1>
        
        <div className="grid-responsive">
          <section style={{ padding: '2.5rem', background: 'var(--glass)', borderRadius: '2rem', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '0.1em' }}>SUPORTE E FEEDBACK</span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', lineHeight: '1.2' }}>Adoraríamos ouvir você</h2>
            <p style={{ color: '#a3a3a3', fontSize: '1rem', lineHeight: '1.6' }}>
              Dúvidas, sugestões ou apenas quer dizer oi? Nossa equipe está sempre aberta a ouvir como o Decido está impactando sua produtividade.
            </p>
            <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
              <p style={{ fontSize: '0.7rem', color: '#525252', fontWeight: 'bold', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>EMAIL DIRETO:</p>
              <a href="mailto:contato@decido.com" style={{ fontSize: '1.3rem', color: 'var(--primary)', fontWeight: '800', textDecoration: 'none', wordBreak: 'break-all' }}>contato@decido.com.br</a>
            </div>
          </section>

          <section style={{ padding: '2.5rem', background: 'var(--glass)', borderRadius: '2rem', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '0.1em' }}>REDES SOCIAIS</span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', lineHeight: '1.2' }}>Acompanhe as novidades</h2>
            <p style={{ color: '#a3a3a3', fontSize: '1rem', lineHeight: '1.6' }}>
              Siga nossas redes para dicas diárias de produtividade e atualizações.
            </p>
            <div className="mobile-stack" style={{ display: 'flex', gap: '1rem', marginTop: 'auto', flexWrap: 'wrap' }}>
              <span style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem', fontSize: '0.8rem', color: '#a3a3a3' }}>LinkedIn</span>
              <span style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem', fontSize: '0.8rem', color: '#a3a3a3' }}>Instagram</span>
              <span style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem', fontSize: '0.8rem', color: '#a3a3a3' }}>Twitter</span>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
