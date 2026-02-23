/**
 * Utility class to log any events that are needed by the applcation.
 */
class Logger {
  /**
   * Logs a general application event with optional data.
   *
   * @param eventName - The name or type of the event (e.g., 'USER_LOGIN', 'APPLICATION_SUBMITTED').
   * @param data - Optional data associated with the event. For example:
   * {
   *   userId: 1,
   *   username: 'testuser',
   * }
   */
  logEvent(eventName: string, data?: Record<string, unknown>): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event: eventName,
      ...(data && { data }),
    };

    // Outputs the event as a structured JSON string
    console.log(JSON.stringify(logEntry));

    // TODO: add file logging
  }

  /**
  * Logs an error to the console, including its full cause chain if present.
  *
  * Accepts unknown values safely. If the provided value is an instance of
  * {@link Error}, its name, message, stack trace, and any nested `cause`
  * errors are printed recursively. If a non-Error value is provided, it is logged as-is.
  *
  * @param error - The error or unknown value to log.
  */
  logError(error: unknown): void {
    if (!(error instanceof Error)) {
      console.error("Non-Error thrown:", error);
      return;
    }
    this.printError(error);

    // TODO: add file logging
  }

  /**
  * Recursively prints an error and its cause chain to the console.
  */
  private printError(error: Error, depth = 0): void {
    console.error(`Name: ${error.name}`);
    console.error(`Timestamp: ${new Date().toISOString()}`);
    console.error(`Message: ${error.message}`);

    if (error.stack) {
      console.error(`Stack:`);

      const stackLines = error.stack.split("\n");
      for (const line of stackLines) {
        console.error(`  ${line}`);
      }
    }

    if (error.cause) {
      console.error(`Caused by:`);

      if (error.cause instanceof Error) {
        this.printError(error.cause, depth + 1);
      } else {
        console.error(`  Non-Error cause: ${error.cause}`);
      }
    }
  }
}

export default Logger;