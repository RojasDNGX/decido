import { logger } from './logger';

export interface AnalyticsEvent {
  event: string;
  userId?: string;
  properties?: Record<string, unknown>;
  timestamp: string;
}

class Analytics {
  private isProd = process.env.NODE_ENV === 'production';

  /**
   * Registra um evento de negócio importante.
   * Em produção, isso pode ser enviado para Mixpanel, Amplitude ou GA4.
   * Por enquanto, enviamos para nosso Logger estruturado.
   */
  track(event: string, properties?: Record<string, unknown>, userId?: string) {
    const payload: AnalyticsEvent = {
      event,
      userId,
      properties,
      timestamp: new Date().toISOString()
    };

    // Log estruturado para auditoria
    logger.info(`[Analytics] ${event}`, payload);

    if (this.isProd) {
      // Futuro: Chamada de API para serviço externo de Analytics
    }
  }

  // Atalhos para eventos comuns
  trackSignup(userId: string, method: string) {
    this.track('user_signup', { method }, userId);
  }

  trackUpgrade(userId: string | number, plan: string, priceId: string) {
    this.track('plan_upgrade', { plan, priceId }, String(userId));
  }

  trackQuotaExhausted(identifier: string, plan: string) {
    this.track('quota_exhausted', { plan }, identifier);
  }

  trackDecisionCreated(identifier: string, plan: string) {
    this.track('decision_created', { plan }, identifier);
  }
}

export const analytics = new Analytics();
