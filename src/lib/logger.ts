import pino from 'pino';

const isDev = process.env.NODE_ENV !== 'production';

const logger = pino({
  level: process.env.LOG_LEVEL || (isDev ? 'debug' : 'info'),
  transport: isDev
    ? {
        target: 'pino-pretty',
        options: { colorize: true, translateTime: 'HH:MM:ss Z', ignore: 'pid,hostname' },
      }
    : undefined,
  formatters: {
    level: (label) => ({ level: label }),
  },
  timestamp: () => `,"time":"${new Date().toISOString()}"`,
});

export function createChildLogger(bindings: Record<string, unknown>) {
  return logger.child(bindings);
}

export function logRequest(request: Request, requestId: string, startTime: number) {
  const duration = Date.now() - startTime;
  logger.info(
    {
      requestId,
      method: request.method,
      url: new URL(request.url).pathname,
      userAgent: request.headers.get('user-agent'),
      duration,
    },
    'HTTP request'
  );
}

export { logger };
