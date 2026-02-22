/**
 * Utility class to log any events that are needed by the applcation.
 */
class Logger {
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
  }

  private printError(error: Error, depth = 0): void {
    console.error(`Name: ${error.name}`);
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