import Logger from "../../util/Logger";

/**
 * Superclass for all error handlers. Subclasses register middleware that run when errors are passed to next().
 */
abstract class ErrorHandler {
    /**
     * Logger instance for subclasses to use.
     */
    protected logger: Logger;
    constructor() {
        this.logger = new Logger();
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