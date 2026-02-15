import ErrorHandler from "./ErrorHandler";
import { NextFunction, Request, Response } from "express";

/**
 * This is the last resort for error handling. Sends an error message in
 * response to all uncaught exceptions.
 */
class ErrorResponseSender extends ErrorHandler {
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
   * Registers the request handling function, which sends a response describing
   * the error, with HTTP status code 500. Request handling ends after
   * executing this method, since it does not call next().
   *
   * @param {Application} app The express application hosting the
   *                          error handler.
   */
  registerHandler(app: any): void {
    /**
     * Returns error message.
     */
    app.use(this.path, (error: Error, request: Request, response: Response, next: NextFunction) => {
      if (response.headersSent) { // if the response has started sending already we pass the error to the Express default handler
        return next(error);
      }
      response.status(500).json({error: "Internal server error"});
    });
  }
}

export default ErrorResponseSender;