/// Structured Logger

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  error?: Error;
}

function formatLog(entry: LogEntry): string {
  const base = `[${entry.timestamp}] [${entry.level.toUpperCase()}] ${entry.message}`;
  const extras: string[] = [];
  if (entry.context && Object.keys(entry.context).length > 0) {
    extras.push(JSON.stringify(entry.context));
  }
  if (entry.error) {
    extras.push(entry.error.stack ?? entry.error.message);
  }
  return extras.length > 0 ? `${base}\n  ${extras.join("\n  ")}` : base;
}

const logger = {
  debug(message: string, context?: Record<string, unknown>) {
    if (process.env.NODE_ENV !== "production") {
      console.debug(
        formatLog({ level: "debug", message, timestamp: new Date().toISOString(), context }),
      );
    }
  },

  info(message: string, context?: Record<string, unknown>) {
    console.info(
      formatLog({ level: "info", message, timestamp: new Date().toISOString(), context }),
    );
  },

  warn(message: string, context?: Record<string, unknown>) {
    console.warn(
      formatLog({ level: "warn", message, timestamp: new Date().toISOString(), context }),
    );
  },

  error(message: string, error?: Error, context?: Record<string, unknown>) {
    console.error(
      formatLog({ level: "error", message, timestamp: new Date().toISOString(), context, error }),
    );
  },

  api(method: string, path: string, status: number, durationMs: number) {
    this.info(`API ${method} ${path} → ${status}`, { method, path, status, durationMs });
  },
};

export { logger };
