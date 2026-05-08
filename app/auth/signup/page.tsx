'use client';

import { signUpAction } from '@/lib/actions';
import Link from 'next/link';
import { useState } from 'react';

export default function SignUpPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await signUpAction(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Criar Conta</h1>
          <p>Junte-se ao Decido e reduza sua carga cognitiva.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Nome (opcional)</label>
            <input type="text" id="name" name="name" placeholder="Seu nome" />
          </div>

          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input type="email" id="email" name="email" placeholder="seu@email.com" required />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input type="password" id="password" name="password" placeholder="Sua senha" required />
          </div>

          <div className="form-group checkbox-group">
            <input type="checkbox" id="marketing_opt_in" name="marketing_opt_in" defaultChecked />
            <label htmlFor="marketing_opt_in" className="checkbox-label">
              Aceito receber e-mails sobre novidades, melhorias e promoções. (Você pode cancelar quando quiser)
            </label>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'Criando conta...' : 'Cadastrar'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Já tem uma conta? <Link href="/auth/signin">Entrar</Link></p>
        </div>
      </div>

      <style jsx>{`
        .auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at 50% 0%, #1a365d 0%, #0a0a0a 100%);
          background-attachment: fixed;
          padding: 20px;
          font-family: 'Outfit', sans-serif;
        }

        .auth-card {
          width: 100%;
          max-width: 420px;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 28px;
          padding: 48px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .auth-header h1 {
          color: white;
          font-size: 32px;
          margin-bottom: 8px;
          font-weight: 800;
          letter-spacing: -1px;
          background: linear-gradient(to right, #60a5fa, #a855f7);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .auth-header p {
          color: #a3a3a3;
          font-size: 15px;
          margin-bottom: 36px;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .form-group label {
          color: #888;
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          padding-left: 4px;
        }

        .form-group input {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 14px;
          padding: 16px;
          color: white;
          font-size: 16px;
          transition: all 0.3s ease;
        }

        .form-group input:focus {
          outline: none;
          border-color: #3b82f6;
          background: rgba(0, 0, 0, 0.5);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
        }

        .checkbox-group {
          flex-direction: row !important;
          align-items: flex-start;
          gap: 12px;
          margin-top: 10px;
          margin-bottom: 25px;
        }

        .checkbox-group input[type="checkbox"] {
          width: 18px;
          height: 18px;
          margin-top: 2px;
          accent-color: #3b82f6;
          cursor: pointer;
        }

        .checkbox-label {
          font-size: 13px !important;
          color: #888 !important;
          line-height: 1.5;
          cursor: pointer;
          font-weight: 400 !important;
          margin-bottom: 0 !important;
        }

        .auth-error {
          color: #fb7185;
          font-size: 14px;
          background: rgba(251, 113, 133, 0.1);
          padding: 14px;
          border-radius: 12px;
          border: 1px solid rgba(251, 113, 133, 0.2);
        }

        .auth-submit-btn {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          border: none;
          border-radius: 14px;
          padding: 18px;
          font-weight: 700;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          margin-top: 10px;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }

        .auth-submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
          filter: brightness(1.1);
        }

        .auth-submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .auth-footer {
          margin-top: 40px;
          text-align: center;
          color: #888;
          font-size: 15px;
        }

        .auth-footer a {
          color: #60a5fa;
          text-decoration: none;
          font-weight: 600;
        }

        .auth-footer a:hover {
          text-decoration: underline;
        }
      `}</style>

    </div>
  );
}
