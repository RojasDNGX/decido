type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'SECURITY' | 'BILLING';

interface LogContext {
  userId?: string;
  requestId?: string;
  plan?: string;
  [key: string]: unknown;
}

class Logger {
  private isProd = process.env.NODE_ENV === 'production';

  private formatMessage(level: LogLevel, message: string, context?: LogContext) {
    const timestamp = new Date().toISOString();
    const ctxString = context ? ` | Context: ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level}] ${message}${ctxString}`;
  }

  info(message: string, context?: LogContext) {
    console.log(this.formatMessage('INFO', message, context));
  }

  warn(message: string, context?: LogContext) {
    console.warn(this.formatMessage('WARN', message, context));
  }

  error(message: string, error?: unknown, context?: LogContext) {
    const errStack = error instanceof Error ? `\nStack: ${error.stack}` : '';
    console.error(this.formatMessage('ERROR', message, context) + errStack);
  }

  security(message: string, context?: LogContext) {
    console.warn(this.formatMessage('SECURITY', message, { ...context, alert: true }));
    // Futuro: Enviar alerta para Slack/Discord/Email
  }

  billing(message: string, context?: LogContext) {
    console.log(this.formatMessage('BILLING', message, context));
  }
}

export const logger = new Logger();
