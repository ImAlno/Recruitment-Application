import { Application } from 'express';
import AuthApi from "./AuthApi";
import RequestHandler from "./RequestHandler";

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
   * Application object.
   *
   * @param {Application} app The express application hosting the
   *                          request handlers.
   */
  async loadHandlers(app: Application) {
    await Promise.all(this.requestHandlers.map(async (requestHandler) => {
      await requestHandler.registerHandler();
      app.use(requestHandler.path, requestHandler.router);
    }));
  }

}

const loader = new RequestHandlerLoader();
loader.addRequestHandler(new AuthApi());

export default loader;
