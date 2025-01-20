export enum LogLevel {
  OFF = -1,
  DEBUG = 0,
  LOG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
}

const PLUGIN = "plugin:database-properties-panel";
export const DEFAULT_LOGLEVEL =
  process.env.NODE_ENV === "production" ? LogLevel.OFF : LogLevel.DEBUG;

export class LoggerService {
  constructor(
    private serviceName = null,
    private verbosity: LogLevel = DEFAULT_LOGLEVEL,
  ) {}

  public setVerbosity(verbosity: LogLevel) {
    this.verbosity = verbosity;
  }

  get prefix() {
    return this.serviceName ? `${PLUGIN}:${this.serviceName} |` : `${PLUGIN} |`;
  }

  private shouldLog(level: LogLevel): boolean {
    return this.verbosity !== LogLevel.OFF && level >= this.verbosity;
  }

  debug(...args: unknown[]) {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.debug(this.prefix, ...args);
    }
  }

  info(...args: unknown[]) {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(this.prefix, ...args);
    }
  }

  warn(...args: unknown[]) {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.prefix, ...args);
    }
  }

  log(...args: unknown[]) {
    if (this.shouldLog(LogLevel.LOG)) {
      console.log(this.prefix, ...args);
    }
  }

  error(...args: unknown[]) {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(this.prefix, ...args);
    }
  }
}

export const Logger = new LoggerService(null, DEFAULT_LOGLEVEL);
