'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LandingClient() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="landing-wrapper">
      {/* Navigation - Full width background, centered content */}
      <nav className="landing-nav" style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 1000,
        background: isScrolled ? 'rgba(0, 0, 0, 0.75)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(12px)' : 'none',
        borderBottom: isScrolled ? '1px solid var(--glass-border)' : '1px solid transparent',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        padding: isScrolled ? '0.8rem 2rem' : '1.5rem 2rem',
        maxWidth: 'none',
        margin: 0
      }}>
        <div className="landing-container" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          maxWidth: '1400px',
          width: '100%',
          margin: '0 auto' 
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', background: 'linear-gradient(to right, #60a5fa, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Decido
          </div>
          <div className="nav-links" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <Link href="/blog" style={{ color: isScrolled ? '#ededed' : '#a3a3a3', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500', transition: 'color 0.3s' }}>Blog</Link>
            <Link href="/sobre" className="mobile-hide" style={{ color: isScrolled ? '#ededed' : '#a3a3a3', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500', transition: 'color 0.3s' }}>Sobre</Link>
            <Link href="/contato" className="mobile-hide" style={{ color: isScrolled ? '#ededed' : '#a3a3a3', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500', transition: 'color 0.3s' }}>Contato</Link>
            <Link href="/decidir" className="cta-button" style={{ 
              padding: '0.6rem 1.2rem', 
              background: 'var(--primary)', 
              color: 'white', 
              borderRadius: '0.75rem', 
              textDecoration: 'none', 
              fontWeight: '600', 
              fontSize: '0.9rem',
              boxShadow: isScrolled ? '0 4px 12px rgba(59, 130, 246, 0.3)' : 'none',
              transition: 'all 0.3s'
            }}>
              {/* Shorten text on mobile if needed, but "Acessar App" is okay */}
              Acessar App
            </Link>
          </div>
        </div>
      </nav>

      <main style={{ width: '100%' }}>
        {/* 1. Hero Section */}
        <section className="landing-section" style={{ textAlign: 'center', paddingTop: '12rem' }}>
          <div className="landing-container" style={{ maxWidth: '1400px' }}>
            <h1 className="landing-h1">
              Pare de decidir o que fazer. <br/>
              <span style={{ background: 'linear-gradient(to right, #60a5fa, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Deixe o Decido decidir por você.</span>
            </h1>
            <p className="hero-sub" style={{ margin: '0 auto 3.5rem' }}>
              Transforme sua lista de tarefas caótica em um plano de ação imediato guiado por inteligência artificial. Recupere sua energia mental hoje.
            </p>
            <Link href="/decidir" style={{ display: 'inline-block', padding: '1.2rem 2.5rem', background: 'var(--primary)', color: 'white', borderRadius: '1rem', textDecoration: 'none', fontWeight: '700', fontSize: '1.2rem', boxShadow: '0 10px 25px rgba(59, 130, 246, 0.4)' }}>
              Começar Grátis
            </Link>
          </div>
        </section>

        {/* 2. Problem Section */}
        <section className="landing-section" style={{ background: 'rgba(255,255,255,0.01)', borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)' }}>
          <div className="landing-container" style={{ maxWidth: '1400px' }}>
            <div className="mobile-stack" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem' }}>
              <div className="feature-card" style={{ flex: '1', minWidth: '300px', maxWidth: '440px' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>😵‍💫</div>
                <h3 className="landing-h3">Fadiga de Decisão</h3>
                <p className="landing-p" style={{ fontSize: '1rem' }}>Gastar mais tempo escolhendo o que fazer do que realmente fazendo.</p>
              </div>
              <div className="feature-card" style={{ flex: '1', minWidth: '300px', maxWidth: '440px' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>📈</div>
                <h3 className="landing-h3">Tarefas em Excesso</h3>
                <p className="landing-p" style={{ fontSize: '1rem' }}>Listas infinitas que geram ansiedade e paralisia em vez de produtividade.</p>
              </div>
              <div className="feature-card" style={{ flex: '1', minWidth: '300px', maxWidth: '440px' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>🌫️</div>
                <h3 className="landing-h3">Falta de Clareza</h3>
                <p className="landing-p" style={{ fontSize: '1rem' }}>Não saber qual tarefa terá o maior impacto no seu dia agora.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. How it Works */}
        <section className="landing-section">
          <div className="landing-container" style={{ maxWidth: '1400px' }}>
            <h2 className="landing-h2">Como funciona</h2>
            
            <div className="how-it-works-step">
              <div style={{ flex: '1' }}>
                <span style={{ background: 'var(--primary)', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 'bold' }}>PASSO 1</span>
                <h3 className="landing-h3" style={{ fontSize: '2rem', margin: '1.5rem 0 1rem' }}>Descarregue sua mente</h3>
                <p className="landing-p" style={{ fontSize: '1.2rem' }}>Cole ou digite todas as tarefas, compromissos e ideias que estão ocupando espaço na sua cabeça.</p>
              </div>
              <div style={{ flex: '1.5', background: 'var(--glass)', padding: '2rem', borderRadius: '1.5rem', border: '1px solid var(--glass-border)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
                <div style={{ opacity: 0.5, fontSize: '1rem', lineHeight: '1.6' }}>"Preciso pagar contas hoje, levar o cachorro no veterinário, terminar o relatório trimestral e responder o e-mail do cliente..."</div>
              </div>
            </div>
            
            <div className="how-it-works-step">
              <div style={{ flex: '1' }}>
                <span style={{ background: 'var(--primary)', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 'bold' }}>PASSO 2</span>
                <h3 className="landing-h3" style={{ fontSize: '2rem', margin: '1.5rem 0 1rem' }}>Análise Inteligente</h3>
                <p className="landing-p" style={{ fontSize: '1.2rem' }}>Nossa inteligência artificial analisa cada item baseada em urgência, impacto e complexidade em segundos.</p>
              </div>
              <div style={{ flex: '1.5', display: 'flex', justifyContent: 'center' }}>
                <div className="spinner" style={{ width: '80px', height: '80px', border: '6px solid var(--glass-border)', borderTopColor: 'var(--primary)', borderRadius: '50%' }}></div>
              </div>
            </div>

            <div className="how-it-works-step" style={{ marginBottom: '0' }}>
              <div style={{ flex: '1' }}>
                <span style={{ background: 'var(--primary)', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 'bold' }}>PASSO 3</span>
                <h3 className="landing-h3" style={{ fontSize: '2rem', margin: '1.5rem 0 1rem' }}>Foque no que importa</h3>
                <p className="landing-p" style={{ fontSize: '1.2rem' }}>Receba uma lista priorizada e uma recomendação clara de qual deve ser sua próxima ação imediata.</p>
              </div>
              <div style={{ flex: '1.5', background: 'rgba(16, 185, 129, 0.05)', padding: '2rem', borderRadius: '1.5rem', border: '1px solid rgba(16, 185, 129, 0.2)', boxShadow: '0 10px 30px rgba(16, 185, 129, 0.1)' }}>
                <div style={{ fontWeight: '800', color: '#10b981', fontSize: '0.8rem', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>🔥 PRÓXIMA AÇÃO:</div>
                <div style={{ fontSize: '1.3rem', fontWeight: '700' }}>Terminar relatório trimestral</div>
                <p style={{ fontSize: '0.9rem', color: '#a3a3a3', marginTop: '0.5rem' }}>Alta urgência e impacto direto no projeto.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Example Block */}
        <section className="landing-section" style={{ background: 'var(--glass)', borderTop: '1px solid var(--glass-border)' }}>
          <div className="landing-container" style={{ maxWidth: '1400px' }}>
            <h2 className="landing-h2">Veja na prática</h2>
            <div style={{ background: 'var(--background)', padding: '2rem', borderRadius: '2.5rem', border: '1px solid var(--glass-border)', textAlign: 'left', boxShadow: '0 30px 60px rgba(0,0,0,0.6)', maxWidth: '1000px', margin: '0 auto' }}>
              <div style={{ marginBottom: '2.5rem' }}>
                <p style={{ fontSize: '0.7rem', fontWeight: '800', color: '#525252', marginBottom: '1rem', letterSpacing: '0.1em' }}>SUA ENTRADA:</p>
                <div style={{ padding: '1.2rem', background: 'rgba(255,255,255,0.03)', borderRadius: '1rem', fontStyle: 'italic', color: '#d4d4d4', border: '1px dashed rgba(255,255,255,0.1)', fontSize: '1rem' }}>
                  "Responder e-mail do chefe, comprar pão, consertar vazamento da pia."
                </div>
              </div>
              <div>
                <p style={{ fontSize: '0.7rem', fontWeight: '800', color: '#525252', marginBottom: '1rem', letterSpacing: '0.1em' }}>ANÁLISE DO DECIDO:</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ padding: '1.2rem', background: 'rgba(239, 68, 68, 0.08)', borderLeft: '4px solid #ef4444', borderRadius: '0.75rem' }}>
                    <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>Consertar vazamento da pia</div>
                  </div>
                  <div style={{ padding: '1.2rem', background: 'rgba(245, 158, 11, 0.08)', borderLeft: '4px solid #f59e0b', borderRadius: '0.75rem' }}>
                    <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>Responder e-mail do chefe</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Differentiation Section */}
        <section className="landing-section" style={{ textAlign: 'center' }}>
          <div className="landing-container" style={{ maxWidth: '1000px' }}>
            <h2 className="landing-h1" style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)' }}>Não é mais um App de Tarefas.</h2>
            <p className="landing-p" style={{ fontSize: '1.3rem', lineHeight: '1.5', marginTop: '2.5rem' }}>
              Gerenciadores de tarefas apenas guardam seus problemas. <br/>
              <strong style={{ color: 'white' }}>O Decido resolve a paralisia da escolha.</strong>
            </p>
          </div>
        </section>

        {/* 6. Final CTA */}
        <section className="landing-section" style={{ paddingBottom: '8rem' }}>
          <div style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)', padding: '4rem 2rem', borderRadius: '3rem', maxWidth: '1000px', width: '100%', textAlign: 'center', boxShadow: '0 30px 60px rgba(37, 99, 235, 0.2)' }}>
            <h2 className="landing-h2" style={{ color: 'white', marginBottom: '2rem' }}>Pronto para focar?</h2>
            <Link href="/decidir" style={{ display: 'inline-block', padding: '1.2rem 3rem', background: 'white', color: '#1e3a8a', borderRadius: '1.2rem', textDecoration: 'none', fontWeight: '800', fontSize: '1.2rem' }}>
              Começar agora
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ padding: '4rem 2rem', borderTop: '1px solid var(--glass-border)', textAlign: 'center', background: 'rgba(0,0,0,0.2)' }}>
        <div className="mobile-stack" style={{ display: 'flex', gap: '3rem', justifyContent: 'center', marginBottom: '3rem', flexWrap: 'wrap' }}>
          <Link href="/blog" style={{ color: '#737373', textDecoration: 'none', fontSize: '0.9rem' }}>Blog</Link>
          <Link href="/sobre" style={{ color: '#737373', textDecoration: 'none', fontSize: '0.9rem' }}>Sobre</Link>
          <Link href="/contato" style={{ color: '#737373', textDecoration: 'none', fontSize: '0.9rem' }}>Contato</Link>
        </div>
        <p style={{ color: '#404040', fontSize: '0.8rem' }}>© 2026 Decido. Inteligência para sua produtividade.</p>
      </footer>

      {/* Back to Top */}
      {showBackToTop && (
        <button 
          className="back-to-top-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Voltar ao topo"
          style={{ animation: 'slideUpFade 0.3s ease' }}
        >
          ↑
        </button>
      )}
    </div>
  );
}
