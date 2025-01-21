import { LogEntry } from "@/types/LogEntry";

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
  process.env.NODE_ENV === "production" ? LogLevel.ERROR : LogLevel.DEBUG;

export class LoggerService {
  private static logs: LogEntry[] = [];
  private static readonly MAX_LOGS = 20;

  constructor(
    private serviceName = null,
    private verbosity: LogLevel = DEFAULT_LOGLEVEL,
  ) {}

  get prefix() {
    return this.serviceName ? `${PLUGIN}:${this.serviceName} |` : `${PLUGIN} |`;
  }

  private addLog(level: LogLevel, args: unknown[]) {
    LoggerService.logs.push({
      timestamp: Date.now(),
      level,
      service: this.serviceName,
      args: [this.prefix, ...args],
    });
    if (LoggerService.logs.length > LoggerService.MAX_LOGS) {
      LoggerService.logs.shift();
    }
  }

  private shouldOutputToConsole(level: LogLevel): boolean {
    return this.verbosity !== LogLevel.OFF && level >= this.verbosity;
  }

  debug(...args: unknown[]) {
    if (this.shouldOutputToConsole(LogLevel.DEBUG)) {
      console.debug(this.prefix, ...args);
    }
    this.addLog(LogLevel.DEBUG, args);
  }

  info(...args: unknown[]) {
    if (this.shouldOutputToConsole(LogLevel.INFO)) {
      console.info(this.prefix, ...args);
    }
    this.addLog(LogLevel.INFO, args);
  }

  warn(...args: unknown[]) {
    if (this.shouldOutputToConsole(LogLevel.WARN)) {
      console.warn(this.prefix, ...args);
    }
    this.addLog(LogLevel.WARN, args);
  }

  error(...args: unknown[]) {
    if (this.shouldOutputToConsole(LogLevel.ERROR)) {
      console.error(this.prefix, ...args);
    }
    this.addLog(LogLevel.ERROR, args);
  }

  static getLogs(): LogEntry[] {
    return LoggerService.logs;
  }
}

export const Logger = new LoggerService(null, DEFAULT_LOGLEVEL);
