'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense } from 'react';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      setLoading(false);
      return;
    }

    if (!token) {
      setError('Token inválido ou não fornecido na URL.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Ocorreu um erro.');
      }

      setMessage(data.message);
      setTimeout(() => {
        router.push('/auth/signin');
      }, 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao redefinir senha.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Nova Senha</h1>
          <p>Crie uma nova senha segura para sua conta.</p>
        </div>

        {message && <div className="auth-success">{message}<br/><br/>Redirecionando para o login...</div>}

        {!message && (
          <form onSubmit={handleReset} className="auth-form">
            <div className="form-group">
              <label htmlFor="password">Nova Senha</label>
              <input 
                type="password" 
                id="password" 
                placeholder="Mínimo de 6 caracteres" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                minLength={6}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Nova Senha</label>
              <input 
                type="password" 
                id="confirmPassword" 
                placeholder="Digite a senha novamente" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required 
                minLength={6}
              />
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Redefinindo...' : 'Redefinir Senha'}
            </button>
          </form>
        )}
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

        .auth-success {
          color: #4ade80;
          font-size: 14px;
          background: rgba(74, 222, 128, 0.1);
          padding: 14px;
          border-radius: 12px;
          border: 1px solid rgba(74, 222, 128, 0.2);
          margin-bottom: 24px;
          text-align: center;
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
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
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
      `}</style>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0a0a0a', color: 'white' }}>
        Carregando...
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
