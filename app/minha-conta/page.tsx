'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getOrCreateFingerprint } from '@/services/storage/storage';

export default function MinhaContaPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [usageCount, setUsageCount] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'perfil' | 'seguranca' | 'planos'>('perfil');

  // Profile Form States
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileProfession, setProfileProfession] = useState('');
  const [profileCompany, setProfileCompany] = useState('');
  const [profLoading, setProfLoading] = useState(false);
  const [profMessage, setProfMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Security Form States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [secLoading, setSecLoading] = useState(false);
  const [hasPassword, setHasPassword] = useState(true);
  const [secMessage, setSecMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Billing States
  const [plan, setPlan] = useState<'free' | 'pro' | 'enterprise'>('free');
  const [subStatus, setSubStatus] = useState<string>('none');
  const [periodEnd, setPeriodEnd] = useState<string | null>(null);
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(false);
  const [billingLoading, setBillingLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/decidir');
    
    if (status === 'authenticated') {
      const fetchUsage = async () => {
        try {
          const fp = getOrCreateFingerprint();
          const res = await fetch(`/api/usage/sync?fingerprint=${fp}`);
          const data = await res.json();
          setUsageCount(data.count);
        } catch (e) {
          // fallback
        }
      };
      fetchUsage();

      const fetchProfile = async () => {
        try {
          const res = await fetch('/api/user/profile');
          if (res.ok) {
            const data = await res.json();
            setProfileName(data.name || '');
            setProfilePhone(data.phone || '');
            setProfileProfession(data.profession || '');
            setProfileCompany(data.company || '');
            setHasPassword(data.hasPassword);
            setPlan(data.plan);
            setSubStatus(data.subscriptionStatus);
            setPeriodEnd(data.periodEnd);
            setCancelAtPeriodEnd(data.cancelAtPeriodEnd);
          }
        } catch (e) {
          console.error("Failed to load profile");
        }
      };
      fetchProfile();
    }
  }, [status, router]);

  if (status === 'loading' || !session) return null;

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setSecLoading(true);
    setSecMessage(null);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSecMessage({ type: 'success', text: data.message });
      setCurrentPassword('');
      setNewPassword('');
      setHasPassword(true); // Now they have a password!
    } catch (err: any) {
      setSecMessage({ type: 'error', text: err.message });
    } finally {
      setSecLoading(false);
    }
  }

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    setProfLoading(true);
    setProfMessage(null);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: profileName, 
          phone: profilePhone, 
          profession: profileProfession, 
          company: profileCompany 
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setProfMessage({ type: 'success', text: data.message });
    } catch (err: any) {
      setProfMessage({ type: 'error', text: err.message });
    } finally {
      setProfLoading(false);
    }
  }

  async function handleManageSubscription() {
    try {
      setBillingLoading(true);
      const res = await fetch('/api/billing/portal', { method: 'POST' });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Erro ao acessar portal de cobrança');
      }
    } catch (e) {
      alert('Erro de conexão');
    } finally {
      setBillingLoading(false);
    }
  }

  async function handleStartCheckout() {
    try {
      setBillingLoading(true);
      const res = await fetch('/api/billing/checkout', { method: 'POST' });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Erro ao iniciar checkout. Verifique se o STRIPE_PRO_PRICE_ID está configurado.');
      }
    } catch (e) {
      console.error('Checkout error:', e);
      alert('Falha na conexão ao iniciar checkout. Verifique o terminal do servidor.');
    } finally {
      setBillingLoading(false);
    }
  }

  return (
    <main className="account-main">
      <header className="account-header">
        <Link href="/" className="logo-container" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', transition: 'opacity 0.2s' }}>
          <img src="/images/app-icon.png" alt="Decido Logo" style={{ width: '52px', height: '52px', borderRadius: '12px', objectFit: 'cover' }} />
        </Link>
        <div className="quick-actions" style={{ display: 'flex', gap: '0.75rem' }}>
          <Link href="/decidir" className="quick-action-btn" title="Voltar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </Link>
        </div>
      </header>

      <div className="container account-container">
        <div className="account-card">
          
          <div className="account-profile-header">
            {session.user?.image ? (
              <img src={session.user.image} alt="avatar" className="account-avatar" />
            ) : (
              <div className="account-avatar-placeholder">
                {session.user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <div className="account-profile-info">
              <h2>{session.user?.name}</h2>
              <p>{session.user?.email}</p>
            </div>
            <div className={`plan-badge ${plan === 'pro' ? 'plan-badge-pro' : ''}`}>
              {plan.toUpperCase()}
            </div>
          </div>

          <div className="account-tabs">
            <button className={`tab-btn ${activeTab === 'perfil' ? 'active' : ''}`} onClick={() => setActiveTab('perfil')}>Perfil</button>
            <button className={`tab-btn ${activeTab === 'seguranca' ? 'active' : ''}`} onClick={() => setActiveTab('seguranca')}>Segurança</button>
            <button className={`tab-btn ${activeTab === 'planos' ? 'active' : ''}`} onClick={() => setActiveTab('planos')}>Assinatura</button>
          </div>

          <div className="account-content">
            {/* TABS CONTENT */}
            {activeTab === 'perfil' && (
              <div className="tab-pane fade-in">
                <h3>Dados Cadastrais</h3>
                <p className="pane-desc">Informações básicas da sua conta. Mantenha-as atualizadas para uma melhor experiência.</p>
                
                {profMessage && (
                  <div className={profMessage.type === 'success' ? 'auth-success' : 'auth-error'}>
                    {profMessage.text}
                  </div>
                )}

                <form onSubmit={handleProfileSave}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Nome Completo</label>
                      <input 
                        type="text" 
                        value={profileName} 
                        onChange={e => setProfileName(e.target.value)} 
                        placeholder="Seu nome"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>E-mail (ID da Conta)</label>
                      <input type="text" value={session.user?.email || ''} readOnly className="read-only-input" style={{ opacity: 0.6 }} />
                    </div>
                    <div className="form-group">
                      <label>Telefone / WhatsApp</label>
                      <input 
                        type="text" 
                        value={profilePhone} 
                        onChange={e => setProfilePhone(e.target.value)} 
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                    <div className="form-group">
                      <label>Sua Profissão / Cargo</label>
                      <input 
                        type="text" 
                        value={profileProfession} 
                        onChange={e => setProfileProfession(e.target.value)} 
                        placeholder="Ex: Gerente, Desenvolvedor..."
                      />
                    </div>
                  </div>
                  
                  <div className="form-group" style={{ marginTop: '20px' }}>
                    <label>Empresa / Projeto</label>
                    <input 
                      type="text" 
                      value={profileCompany} 
                      onChange={e => setProfileCompany(e.target.value)} 
                      placeholder="Nome da sua empresa"
                    />
                  </div>
                  
                  <button type="submit" className="auth-submit-btn" disabled={profLoading}>
                    {profLoading ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'seguranca' && (
              <div className="tab-pane fade-in">
                <h3>{hasPassword ? 'Redefinir Senha' : 'Criar Senha'}</h3>
                <p className="pane-desc">
                  {hasPassword 
                    ? 'Mantenha sua conta segura atualizando sua senha periodicamente.'
                    : 'Crie uma senha para poder acessar sua conta usando E-mail e Senha, sem depender apenas do Google.'}
                </p>
                
                {secMessage && (
                  <div className={secMessage.type === 'success' ? 'auth-success' : 'auth-error'}>
                    {secMessage.text}
                  </div>
                )}

                <form onSubmit={handlePasswordChange}>
                  {hasPassword && (
                    <div className="form-group">
                      <label>Senha Atual</label>
                      <input 
                        type="password" 
                        required={hasPassword}
                        value={currentPassword}
                        onChange={e => setCurrentPassword(e.target.value)}
                      />
                    </div>
                  )}
                  <div className="form-group">
                    <label>Nova Senha</label>
                    <input 
                      type="password" 
                      required 
                      minLength={6}
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="auth-submit-btn" disabled={secLoading}>
                    {secLoading ? 'Processando...' : (hasPassword ? 'Alterar Senha' : 'Criar Senha')}
                  </button>
                </form>

                <div className="danger-zone" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', borderTop: 'none', paddingTop: 0 }}>
                  <button className="clear-data-btn" onClick={() => signOut({ callbackUrl: '/auth/signin' })}>
                    Sair da conta
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'planos' && (
              <div className="tab-content fade-in">
                <header className="account-section-header" style={{ marginBottom: '20px' }}>
                  <h3>Sua Assinatura</h3>
                  <p>Gerencie seus limites e recursos avançados.</p>
                </header>

                {cancelAtPeriodEnd && periodEnd && (
                  <div style={{ 
                    padding: '12px 16px', 
                    background: 'rgba(239, 68, 68, 0.1)', 
                    borderRadius: '12px', 
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    fontSize: '14px',
                    color: '#fca5a5',
                    width: '100%',
                    textAlign: 'left',
                    lineHeight: '1.4',
                    marginBottom: '20px'
                  }}>
                    <strong>Assinatura cancelada:</strong> Você ainda tem acesso PRO por mais 
                    <span style={{ color: 'white', margin: '0 4px', fontWeight: 'bold' }}>
                      {Math.max(0, Math.ceil((new Date(periodEnd).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} dias
                    </span>. 
                    Ainda dá tempo de continuar com a gente! Basta clicar em <strong>Gerenciar Cobrança</strong> e reativar.
                  </div>
                )}

                <div className="plan-card active-plan" style={{ position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ fontSize: '12px', color: '#818cf8', fontWeight: 600, letterSpacing: '0.05em', margin: 0 }}>PLANO ATUAL</p>
                      <h4 style={{ margin: '5px 0', fontSize: '20px', color: 'white' }}>
                        Decido {plan.toUpperCase()} 
                        {subStatus === 'past_due' && <span style={{ marginLeft: '10px', fontSize: '12px', color: '#ef4444' }}>(Pagamento Pendente)</span>}
                        {plan === 'free' && <div style={{ marginTop: '4px', fontSize: '14px', color: '#818cf8', fontWeight: 500 }}>Apenas R$ 19/mês no plano PRO</div>}
                      </h4>
                    </div>
                    {plan === 'pro' && (
                      <button 
                        className="manage-billing-btn" 
                        onClick={handleManageSubscription}
                        disabled={billingLoading}
                      >
                        {billingLoading ? '...' : 'Gerenciar Cobrança'}
                      </button>
                    )}
                  </div>
                  
                  <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <p style={{ fontSize: '14px', opacity: 0.6 }}>Próxima renovação: <strong>{periodEnd ? new Date(periodEnd).toLocaleDateString() : 'N/A'}</strong></p>
                  </div>
                </div>

                  <div className="experience-comparison" style={{ border: 'none', background: 'transparent', padding: 0 }}>
                    <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
                      <div className="comparison-item" style={{ textAlign: 'left', flex: '1 1 0', minWidth: '250px' }}>
                        <p className="comparison-label">GRÁTIS</p>
                        <ul className="experience-list">
                          <li>• 3 análises diárias</li>
                          <li>• Histórico local básico</li>
                          <li>• Motor de decisão padrão</li>
                        </ul>
                      </div>
                      <div className="comparison-divider" />
                      <div className="comparison-item" style={{ textAlign: 'left', flex: '1 1 0', minWidth: '250px' }}>
                        <p className="comparison-label comparison-label--pro">PRO</p>
                        <ul className="experience-list experience-list--pro">
                          <li>• Estrategista: entenda o "porquê"</li>
                          <li>• Políticas de Segurança Automáticas</li>
                          <li>• Decisões com contexto acumulado</li>
                          <li>• Sem limite diário</li>
                        </ul>
                      </div>
                    </div>
                    {plan === 'free' && (
                      <button 
                        className="limit-modal-cta" 
                        style={{ marginTop: '2rem', width: '100%' }}
                        onClick={handleStartCheckout}
                        disabled={billingLoading}
                      >
                        {billingLoading ? 'Processando...' : 'Fazer Upgrade para PRO - R$ 19/mês'}
                      </button>
                    )}
                  </div>
                </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .account-main {
          min-height: 100vh;
          background: radial-gradient(circle at 50% 0%, #1a365d 0%, #0a0a0a 100%);
          background-attachment: fixed;
          font-family: 'Outfit', sans-serif;
          display: flex;
          flex-direction: column;
        }

        .account-header {
          width: 100%;
          max-width: 1000px;
          margin: 0 auto;
          padding: 1.5rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .quick-action-btn {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.05);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.2s;
        }
        .quick-action-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }

        .account-container {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: flex-start; /* Ensures it doesn't stretch vertically incorrectly */
          padding: 0 20px 40px;
          width: 100%;
        }

        .account-card {
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          margin-top: 20px;
        }

        .account-profile-header {
          padding: 40px;
          display: flex;
          align-items: center;
          gap: 20px;
          background: rgba(0,0,0,0.2);
          border-bottom: 1px solid rgba(255,255,255,0.05);
          position: relative;
        }

        .account-avatar, .account-avatar-placeholder {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid rgba(255,255,255,0.1);
        }

        .account-avatar-placeholder {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          font-weight: 700;
          color: white;
        }

        .account-profile-info h2 {
          margin: 0 0 5px 0;
          color: white;
          font-size: 24px;
          font-weight: 700;
        }

        .account-profile-info p {
          margin: 0;
          color: #a3a3a3;
          font-size: 15px;
        }

        .plan-badge {
          position: absolute;
          top: 40px;
          right: 40px;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1px;
          background: rgba(255,255,255,0.1);
          color: #ccc;
        }

        .plan-badge-pro {
          background: linear-gradient(135deg, #60a5fa, #a855f7);
          color: white;
          box-shadow: 0 4px 15px rgba(168, 85, 247, 0.4);
        }

        .account-tabs {
          display: flex;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          background: rgba(0,0,0,0.1);
        }

        .tab-btn {
          flex: 1;
          padding: 20px;
          background: none;
          border: none;
          color: #888;
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.2s;
          border-bottom: 2px solid transparent;
        }

        .tab-btn:hover {
          color: white;
          background: rgba(255,255,255,0.02);
        }

        .tab-btn.active {
          color: #60a5fa;
          border-bottom-color: #60a5fa;
          background: rgba(96, 165, 250, 0.05);
        }

        .account-content {
          padding: 40px;
        }

        .tab-pane h3 {
          margin: 0 0 5px 0;
          color: white;
          font-size: 20px;
        }

        .pane-desc {
          margin: 0 0 30px 0;
          color: #a3a3a3;
          font-size: 14px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }

        @media (min-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          color: #888;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          padding-left: 4px;
        }

        .form-group input {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 14px 16px;
          color: white;
          font-size: 15px;
          transition: all 0.3s ease;
        }

        .form-group input:focus {
          outline: none;
          border-color: #3b82f6;
          background: rgba(0, 0, 0, 0.5);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
        }

        .read-only-input {
          background: rgba(0,0,0,0.1) !important;
          border-color: transparent !important;
          color: #aaa !important;
          cursor: default;
        }

        .auth-submit-btn {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          border: none;
          border-radius: 14px;
          padding: 16px;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
          margin-top: 10px;
        }

        .auth-submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
        }

        .manage-billing-btn {
          padding: 10px 20px;
          border-radius: 12px;
          background: rgba(255,255,255,0.05);
          color: white;
          border: 1px solid rgba(255,255,255,0.1);
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .manage-billing-btn:hover {
          background: white;
          color: #1a365d;
        }

        .auth-success, .auth-error {
          font-size: 14px;
          padding: 14px;
          border-radius: 12px;
          margin-bottom: 24px;
        }

        .auth-success {
          color: #4ade80;
          background: rgba(74, 222, 128, 0.1);
          border: 1px solid rgba(74, 222, 128, 0.2);
        }

        .auth-error {
          color: #fb7185;
          background: rgba(251, 113, 133, 0.1);
          border: 1px solid rgba(251, 113, 133, 0.2);
        }

        .danger-zone {
          margin-top: 40px;
          padding-top: 30px;
          border-top: 1px solid rgba(255,255,255,0.05);
        }

        .danger-zone h4 {
          color: white;
          margin: 0 0 15px 0;
          font-size: 16px;
        }

        .clear-data-btn {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.2);
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .clear-data-btn:hover {
          background: rgba(239, 68, 68, 0.2);
        }

        .fade-in {
          animation: fadeIn 0.3s ease forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 600px) {
          .account-profile-header {
            flex-direction: column;
            text-align: center;
            padding: 30px 20px;
          }
          .plan-badge {
            position: relative;
            top: 0;
            right: 0;
            margin-top: 15px;
          }
        }
      `}</style>
    </main>
  );
}

