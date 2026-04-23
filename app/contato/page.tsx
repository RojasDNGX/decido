import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fale com quem decide | Contato',
  description: 'Dúvidas, parcerias ou feedbacks sobre como o Decido está impactando seu dia. Estamos aqui para ouvir.',
};

export default function ContactPage() {
  return (
    <main>
      <div className="landing-container" style={{ paddingTop: '8rem', paddingBottom: '8rem' }}>
        <Link href="/" style={{ color: 'var(--primary)', textDecoration: 'none', marginBottom: '3rem', display: 'block', fontSize: '0.9rem', fontWeight: '600' }}>← Voltar para Home</Link>
        <h1 className="landing-h1" style={{ marginBottom: '4rem' }}>Fale com quem decide.</h1>
        
        <div className="grid-responsive">
          <section style={{ padding: '2.5rem', background: 'var(--glass)', borderRadius: '2rem', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '0.1em' }}>DIÁLOGO ABERTO</span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', lineHeight: '1.2' }}>Sua voz molda o Decido</h2>
            <p style={{ color: '#a3a3a3', fontSize: '1rem', lineHeight: '1.6' }}>
              Tem uma sugestão de como podemos tornar a decisão ainda mais simples? Ou apenas quer compartilhar um impacto positivo? Nossa equipe lê cada mensagem.
            </p>
            <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
              <p style={{ fontSize: '0.7rem', color: '#525252', fontWeight: 'bold', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>EMAIL DIRETO:</p>
              <a href="mailto:contato@decido.com.br" style={{ fontSize: '1.3rem', color: 'var(--primary)', fontWeight: '800', textDecoration: 'none', wordBreak: 'break-all' }}>contato@decido.com.br</a>
            </div>
          </section>

          <section style={{ padding: '2.5rem', background: 'var(--glass)', borderRadius: '2rem', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '0.1em' }}>COMUNIDADE</span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', lineHeight: '1.2' }}>Acompanhe a evolução</h2>
            <p style={{ color: '#a3a3a3', fontSize: '1rem', lineHeight: '1.6' }}>
              Siga nosso progresso e receba dicas semanais sobre foco e gestão estratégica de tempo.
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
