type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: unknown;
  timestamp: string;
}

class Logger {
  private logToConsole(entry: LogEntry) {
    const logMessage = `[${entry.timestamp}] ${entry.level.toUpperCase()}: ${entry.message}`;
    
    switch (entry.level) {
      case 'error':
        console.error(logMessage, entry.data);
        break;
      case 'warn':
        console.warn(logMessage, entry.data);
        break;
      case 'info':
        console.info(logMessage, entry.data);
        break;
      case 'debug':
        console.debug(logMessage, entry.data);
        break;
    }
  }

  private createLogEntry(level: LogLevel, message: string, data?: unknown): LogEntry {
    return {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  info(message: string, data?: unknown) {
    const entry = this.createLogEntry('info', message, data);
    this.logToConsole(entry);
  }

  warn(message: string, data?: unknown) {
    const entry = this.createLogEntry('warn', message, data);
    this.logToConsole(entry);
  }

  error(message: string, data?: unknown) {
    const entry = this.createLogEntry('error', message, data);
    this.logToConsole(entry);
  }

  debug(message: string, data?: unknown) {
    const entry = this.createLogEntry('debug', message, data);
    this.logToConsole(entry);
  }
}

export const logger = new Logger(); 