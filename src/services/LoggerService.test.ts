import { beforeEach, describe, expect, it } from "vitest";
import { LoggerService, LogLevel } from "@/services/LoggerService";

describe("LoggerService", () => {
  let logger: LoggerService = new LoggerService("Test", LogLevel.OFF);
  beforeEach(() => {
    LoggerService.clearLogs();
  });

  it("should return formatted log strings", () => {
    logger.debug("Debug message");
    logger.info("Info message");
    logger.warn("Warn message");
    logger.error("Error message");

    const logs = LoggerService.getLogs();
    expect(logs.length).toBe(4);

    const [debugLog, infoLog, warnLog, errorLog] = logs;

    expect(debugLog).toMatch(/\[DEBUG] Test \| Debug message/);
    expect(infoLog).toMatch(/\[INFO] Test \| Info message/);
    expect(warnLog).toMatch(/\[WARN] Test \| Warn message/);
    expect(errorLog).toMatch(/\[ERROR] Test \| Error message/);
  });

  it("should not exceed the maximum number of logs", () => {
    for (let i = 0; i < 25; i++) {
      logger.debug(`Debug message ${i}`);
    }

    const logs = LoggerService.getLogs();
    expect(logs.length).toBe(20);
    expect(logs[0]).toMatch(/Debug message 5/);
  });

  it("should handle objects in logs", () => {
    const obj = {
      someKey: "someValue",
      ["1-2"]: {
        anArray: ["a", "b", "c"],
      },
    };
    logger.debug("Debug message", obj);

    const logs = LoggerService.getLogs();
    logs.forEach((log) => console.log(log));
    expect(logs.length).toBe(1);

    const [debugLog] = logs;

    expect(debugLog).contains("someKey");
    expect(debugLog).contains("anArray");
    expect(debugLog).contains("1-2");
    expect(debugLog).contains('["a","b","c"]');
  });
});
