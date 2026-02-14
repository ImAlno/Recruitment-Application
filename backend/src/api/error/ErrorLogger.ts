import ErrorHandler from "./ErrorHandler";
import { NextFunction, Request, Response } from "express";

/**
 * This is the last resort for error handling. Sends an error message in
 * response to all uncaught exceptions.
 */
class ErrorLogger extends ErrorHandler {
  /**
  * Constructs a new instance.
  */
  constructor() {
    super();
  }

  /**
  * @return {string} The URL paths handled by this error handler.
  */
  get path() {
    return '/';
  }

  /** // TODO: why are we using any as the app type?
   * Registers the request handling function, which will log
   * the caught exception.
   *
   * @param {Application} app The express application hosting the
   *                          error handler.
   */
  registerHandler(app: any): void {
    /**
     * Logs errors to the console.
     */
    app.use(this.path, (error: Error, request: Request, response: Response, next: NextFunction) => {
        this.logger.logError(error);
        next(error);
    });
  }
}

export default ErrorLogger;