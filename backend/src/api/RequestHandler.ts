'use strict';

import express, { Router, Request, Response, NextFunction } from 'express';
import { Controller } from '../controller/Controller';
//import { Logger } from '../util/Logger';
//import { Validators } from '../util/Validators';

/**
 * Superclass for all request handlers.
 */
class RequestHandler {
  /**
   * Constructs a new instance, and also creates router and logger
   * for use by subclasses.
   */
    protected router: Router;
    protected contr?: Controller;
    //protected logger: Logger; un comment if logging is implemented
    constructor() {
        this.router = express.Router(); // eslint-disable-line new-cap
        //this.logger = new Logger();
    }

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
        this.contr = await Controller.createController();
    }

    /**
    * Sends an http response with the specified http status and body.
    * @param {Request} res The express Response object.
    * @param {number} status The status code of the response.
    * @param {any} body The body of the response.
    */
    sendHttpResponse(res: Response, status: number, body: JSON): void {
        //Validators.isIntegerBetween(status, 200, 501); uncomment if validation is implemented
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
        res.status(status).json({[errOrSucc]: body});
    }
}

export default RequestHandler;