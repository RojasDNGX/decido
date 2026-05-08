import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidade | Decido',
  description: 'Como protegemos seus dados e garantimos sua privacidade de acordo com a LGPD.',
};

export default function PrivacyPage() {
  return (
    <main>
      <div className="landing-container" style={{ paddingTop: '8rem', paddingBottom: '8rem', maxWidth: '800px' }}>
        <Link href="/" style={{ color: 'var(--primary)', textDecoration: 'none', marginBottom: '3rem', display: 'block', fontSize: '0.9rem', fontWeight: '600' }}>← Voltar para Home</Link>
        <h1 className="landing-h1" style={{ marginBottom: '2rem' }}>Política de Privacidade</h1>
        <p style={{ color: '#a3a3a3', marginBottom: '4rem', fontSize: '1.1rem' }}>Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', color: '#e5e5e5', lineHeight: '1.7' }}>
          <section>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem', color: 'white' }}>1. Coleta de Dados</h2>
            <p>
              Ao utilizar o Decido, coletamos apenas as informações essenciais para entregar nossa solução: seu e-mail, nome, foto de perfil (quando aplicável) e o histórico anonimizado das suas decisões, para garantir a funcionalidade do serviço.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem', color: 'white' }}>2. Uso das Informações</h2>
            <p>
              Suas informações são utilizadas exclusivamente para autenticação, prestação do serviço contratado e comunicação sobre atualizações essenciais do produto. Não vendemos, alugamos ou compartilhamos seus dados com terceiros para fins publicitários.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem', color: 'white' }}>3. Seus Direitos (LGPD)</h2>
            <p>
              Você possui controle total sobre seus dados. A qualquer momento, você pode solicitar a exclusão completa e permanente da sua conta (Direito ao Esquecimento). A exclusão removerá todas as suas decisões, senhas e identificadores dos nossos servidores.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem', color: 'white' }}>4. Segurança</h2>
            <p>
              Utilizamos criptografia de ponta a ponta para senhas (bcrypt), sessões HTTP-Only seguras e banco de dados isolado. Todo o tráfego é forçado via SSL/TLS (HTTPS).
            </p>
          </section>

          <section style={{ padding: '2rem', background: 'rgba(255,255,255,0.03)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)', marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '0.5rem', color: 'white' }}>Ficou com alguma dúvida?</h3>
            <p style={{ marginBottom: 0 }}>
              Entre em contato conosco através do e-mail: <a href="mailto:privacidade@decido.com.br" style={{ color: 'var(--primary)' }}>privacidade@decido.com.br</a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
