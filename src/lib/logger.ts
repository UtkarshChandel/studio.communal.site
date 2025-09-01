/**
 * Logger utility with environment-based verbosity control
 * 
 * Environment Variables:
 * - NEXT_PUBLIC_ENV=production: Minimal logging (errors only)
 * - NEXT_PUBLIC_ENV=development|dev: Full verbosity
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
    private isDev: boolean;

    constructor() {
        // Check if we're in development mode
        this.isDev = process.env.NEXT_PUBLIC_ENV === 'development' ||
            process.env.NEXT_PUBLIC_ENV === 'dev' ||
            process.env.NODE_ENV === 'development';
    }

    private shouldLog(level: LogLevel): boolean {
        if (!this.isDev) {
            // In production, only show errors
            return level === 'error';
        }
        // In development, show all logs
        return true;
    }

    private formatMessage(prefix: string, ...args: unknown[]): unknown[] {
        return [`🔥 ${prefix}`, ...args];
    }

    debug(message: string, ...args: unknown[]): void {
        if (this.shouldLog('debug')) {
            console.log(...this.formatMessage(message, ...args));
        }
    }

    info(message: string, ...args: unknown[]): void {
        if (this.shouldLog('info')) {
            console.info(...this.formatMessage(message, ...args));
        }
    }

    warn(message: string, ...args: unknown[]): void {
        if (this.shouldLog('warn')) {
            console.warn(...this.formatMessage(message, ...args));
        }
    }

    error(message: string, ...args: unknown[]): void {
        if (this.shouldLog('error')) {
            console.error(...this.formatMessage(message, ...args));
        }
    }

    // Specific logging methods for different components
    chat(message: string, ...args: unknown[]): void {
        this.debug(`Chat: ${message}`, ...args);
    }

    sse(message: string, ...args: unknown[]): void {
        this.debug(`SSE: ${message}`, ...args);
    }

    component(componentName: string, message: string, ...args: unknown[]): void {
        this.debug(`${componentName}: ${message}`, ...args);
    }

    api(message: string, ...args: unknown[]): void {
        this.debug(`API: ${message}`, ...args);
    }
}

// Export a singleton instance
export const logger = new Logger();

// For backwards compatibility, also export individual methods
export const debugLog = (message: string, ...args: unknown[]) => logger.debug(message, ...args);
export const infoLog = (message: string, ...args: unknown[]) => logger.info(message, ...args);
export const warnLog = (message: string, ...args: unknown[]) => logger.warn(message, ...args);
export const errorLog = (message: string, ...args: unknown[]) => logger.error(message, ...args);
