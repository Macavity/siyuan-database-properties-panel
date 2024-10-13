export enum LogLevel {
  OFF = -1,
  DEBUG = 0,
  LOG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
}

const PREFIX = "[plugin:database-properties-panel]";

class LoggerService {
  private verbosity: LogLevel;

  constructor(verbosity: LogLevel = LogLevel.OFF) {
    this.verbosity = verbosity;
  }

  public setVerbosity(verbosity: LogLevel) {
    this.verbosity = verbosity;
  }

  private shouldLog(level: LogLevel): boolean {
    return this.verbosity !== LogLevel.OFF && level >= this.verbosity;
  }

  debug(...args: unknown[]) {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.debug(PREFIX, ...args);
    }
  }

  info(...args: unknown[]) {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(PREFIX, ...args);
    }
  }

  warn(...args: unknown[]) {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(PREFIX, ...args);
    }
  }

  log(...args: unknown[]) {
    if (this.shouldLog(LogLevel.LOG)) {
      console.log(PREFIX, ...args);
    }
  }

  error(...args: unknown[]) {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(PREFIX, ...args);
    }
  }
}

const logLevel =
  process.env.NODE_ENV === "production" ? LogLevel.OFF : LogLevel.DEBUG;
export const Logger = new LoggerService(logLevel);
