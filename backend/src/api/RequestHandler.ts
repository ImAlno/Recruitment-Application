import express, { Router, Request, Response, NextFunction } from 'express';
import { Controller } from '../controller/Controller';
import Logger from '../util/Logger';

/**
 * Superclass for all request handlers.
 */
abstract class RequestHandler {
    /**
     * Constructs a new instance, and also creates router and logger
     * for use by subclasses.
     */
    public router: Router;
    protected logger: Logger;
    protected controller?: Controller;
    constructor() {
        this.router = express.Router();
        this.logger = new Logger();
    }

    /**
     * The URL paths handled by this request handler.
     */
    abstract get path(): string;

    /**
     * Registers the request handler's routes.
     */
    abstract registerHandler(): Promise<void>;

    /**
    * Protocol part (http) of a URL.
    */
    static get URL_PREFIX() {
        return 'http://';
    }

    /**
    * Creates the controller, which shall be used by subclasses.
    */
    async retrieveController() {
        this.controller = await Controller.createController();
    }

    /**
    * Sends an http response with the specified http status and body.
    * @param {Request} res The express Response object.
    * @param {number} status The status code of the response.
    * @param {any} body The body of the response.
    */
    sendHttpResponse(res: Response, status: number, body: any): void {
        if (body === undefined) {
            res.status(status).end();
            return;
        }
        let errOrSucc = undefined;
        if (status < 400) {
            errOrSucc = 'success';
        } else {
            errOrSucc = 'error';
        }
        res.status(status).json({ [errOrSucc]: body });
    }
}

export default RequestHandler;
