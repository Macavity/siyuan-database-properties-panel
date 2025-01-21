import { LogLevel } from "@/services/LoggerService";

export interface LogEntry {
  timestamp: number;
  level: LogLevel;
  service: string | null;
  args: unknown[];
}
