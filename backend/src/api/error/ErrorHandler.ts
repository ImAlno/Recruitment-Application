//import { Logger } from "./util/Logger";

/**
 * Superclass for all error handlers.
 */
abstract class ErrorHandler {
    /**
    * Constructs a new instance, and also creates a logger
    * for use by subclasses.
    */
    //protected logger: Logger; // TODO: Implement the logging fuctionality
    constructor() {
    // this.logger = new Logger();
    }

    /**
        * The URL paths handled by this request handler.
        */
    abstract get path(): string;

    /**
        * Registers the request handler's routes.
        */
    abstract registerHandler(app: any): void;
}

export default ErrorHandler;