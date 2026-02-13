import { Application, Router } from 'express';
import AuthApi from "./AuthApi";
import RequestHandler from "./RequestHandler";
import ApplicationApi from './ApplicationApi';
import ErrorHandler from './error/ErrorHandler';
import ErrorLogger from './error/ErrorLogger';
import ErrorResponseSender from './error/ErrorResponseSender';

/**
 * Contains all request handlers.
 */
class RequestHandlerLoader {
  /**
   * Creates a new instance.
   */
  protected requestHandlers: RequestHandler[];
  protected errorHandlers: ErrorHandler[];

  constructor() {
    this.requestHandlers = [];
    this.errorHandlers = [];
  }

  /**
   * Adds a new request handler.
   *
   * @param {RequestHandler} requestHandler The request handler that will be added.
   */
  addRequestHandler(requestHandler: RequestHandler) {
    this.requestHandlers.push(requestHandler);
  }

  /**
   * Adds a new error handler.
   *
   * @param {ErrorHandler} errorHandler The error handler that will be added.
   */
  addErrorHandler(errorHandler: ErrorHandler) {
    this.errorHandlers.push(errorHandler);
  }

  /** // TODO: why are we using any as the app type?
   * Makes all request handlers available in the specified express
   * Application or Router object.
   *
   * @param {any} app The express application or router hosting the
   *                          request handlers.
   */
  async loadHandlers(app: any) {
    await Promise.all(this.requestHandlers.map(async (requestHandler) => {
      await requestHandler.registerHandler();
      app.use(requestHandler.path, requestHandler.router);
    }));
  }

  /** // TODO: why are we using any as the app type?
   * Makes all error handlers available in the specified express
   * Application object. Note that error handlers can not be loaded via an
   * express router object.
   *
   * @param {Application} app The express application hosting the
   *                          error handlers.
   */
  loadErrorHandlers(app: any) {
    this.errorHandlers.forEach((errorHandler) => {
      errorHandler.registerHandler(app);
    });
  }

}

const loader = new RequestHandlerLoader();
loader.addRequestHandler(new AuthApi());
loader.addRequestHandler(new ApplicationApi());
loader.addErrorHandler(new ErrorLogger());
loader.addErrorHandler(new ErrorResponseSender());

export default loader;
