/**
 * Minimal structured console logger. Each line is tagged with the source
 * file, the function name passed in by the caller, and the call site's line
 * number (read off a captured stack trace, so it never goes stale as code
 * shifts around it) — e.g. `[INFO] [src/services/kitchenApi.ts:42] [getKitchens] start`.
 */

function callerLine(): string {
  const stack = new Error().stack;
  if (!stack) return '?';
  // stack[0] = "Error", stack[1] = callerLine, stack[2] = logger.info/error, stack[3] = actual call site.
  const frame = stack.split('\n')[3];
  if (!frame) return '?';
  const match = frame.match(/:(\d+):\d+\)?\s*$/);
  return match ? match[1] : '?';
}

export interface Logger {
  info(functionName: string, message: string, ...data: unknown[]): void;
  error(functionName: string, message: string, ...data: unknown[]): void;
}

export function createLogger(fileName: string): Logger {
  return {
    info(functionName: string, message: string, ...data: unknown[]): void {
      // eslint-disable-next-line no-console
      console.log(`[INFO] [${fileName}:${callerLine()}] [${functionName}] ${message}`, ...data);
    },
    error(functionName: string, message: string, ...data: unknown[]): void {
      // eslint-disable-next-line no-console
      console.error(`[ERROR] [${fileName}:${callerLine()}] [${functionName}] ${message}`, ...data);
    },
  };
}
