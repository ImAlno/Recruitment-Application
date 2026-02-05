import { Application, Router } from 'express';
import AuthApi from "./AuthApi";
import RequestHandler from "./RequestHandler";
import ApplicationApi from './ApplicationApi';

/**
 * Contains all request handlers.
 */
class RequestHandlerLoader {
  /**
   * Creates a new instance.
   */
  protected requestHandlers: RequestHandler[];

  constructor() {
    this.requestHandlers = [];
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

}

const loader = new RequestHandlerLoader();
loader.addRequestHandler(new AuthApi());
loader.addRequestHandler(new ApplicationApi)
export default loader;
