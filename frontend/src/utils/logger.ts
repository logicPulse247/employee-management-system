type LogLevel = 'log' | 'warn' | 'error' | 'info' | 'debug';

class Logger {
  private isDevelopment = import.meta.env.DEV;

  private logMessage(level: LogLevel, ...args: any[]): void {
    if (level === 'error') {
      // eslint-disable-next-line no-console
      console.error(...args);
      // Send to error tracking service (e.g., Sentry)
      // Sentry.captureException(args[0]);
      return;
    }

    if (this.isDevelopment) {
      // eslint-disable-next-line no-console
      console[level](...args);
    }
  }

  log(...args: any[]): void {
    this.logMessage('log', ...args);
  }

  warn(...args: any[]): void {
    this.logMessage('warn', ...args);
  }

  error(...args: any[]): void {
    this.logMessage('error', ...args);
  }

  info(...args: any[]): void {
    this.logMessage('info', ...args);
  }

  debug(...args: any[]): void {
    this.logMessage('debug', ...args);
  }
}

export const logger = new Logger();
