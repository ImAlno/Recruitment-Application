import { Request, Response, NextFunction } from 'express';
import RequestHandler from "./RequestHandler";
import { Authorization } from './Authorization';
import { body, query, validationResult } from "express-validator";

class AuthApi extends RequestHandler {
    /**
    * Constructs a new instance.
    */
    constructor() {
        super();
    }

    /**
    * @return {string} The URL paths handled by this request handler.
    */
    get path(): string {
        return AuthApi.AUTH_API_PATH;
    }

    /**
    * @return {string} The URL paths handled by this request handler, /auth becomes a prefix to all other routes in this API.
    */
    static get AUTH_API_PATH(): string {
        return '/auth';
    }

    async registerHandler(): Promise<void> {
        try {
            await this.retrieveController();

            /*
                User account registration. When user creates their account in the web service a request will be sent here.
            */
            this.router.post(
                "/register", 
                [
                    body("firstName")
                      .isString()
                      .withMessage("Field: firstName (string) required"),

                    body("lastName")
                      .isString()
                      .withMessage("Field: lastName (string) required"),

                    body("email")
                      .isString()
                      .withMessage("Field: email (string) required"),

                    body("personNumber")
                      .isString()
                      .withMessage("Field: personNumber (string) required"),

                    body("username")
                      .isString()
                      .withMessage("Field: username (string) required"),

                    body("password")
                      .isString()
                      .withMessage("Field: password (string) required"),
                ],
                async (request: Request, response: Response, next: NextFunction) => {
                    try {
                        const errors = validationResult(request);
                        if (!errors.isEmpty()) {
                            this.sendHttpResponse(response, 400, errors.array());
                            return;
                        }

                        await this.controller?.register(request.body);
                        this.sendHttpResponse(response, 201, "Registration successful");
                    } catch (error) {
                        next(error);
                    }
                }
            );

            /*
                Check if username or email is available.
            */
            this.router.get(
                "/availability", 
                [
                    query("username")
                      .optional()   // Optional means this validation is not required, //? should we split it up?
                      .isString()
                      .withMessage("Field: username (string) required"),

                    query("email")
                      .optional()
                      .isString()
                      .withMessage("Field: email (string) required"),
                ],
                async (request: Request, response: Response, next: NextFunction) => {
                    try {
                        const errors = validationResult(request);
                        if (!errors.isEmpty()) {
                            this.sendHttpResponse(response, 400, errors.array());
                            return;
                        }

                        const { username, email } = request.query; // in get requests parameters are stored in the query string not in body
                        const status = await this.controller?.isAvailable(username as string, email as string);
                        this.sendHttpResponse(response, 200, status);
                    } catch (error) {
                        next(error);
                    }
                }
            );

            /*
                User login. When user tries to log in to the web service a request will be sent here.
            */
            this.router.post(
                "/login",
                [
                    body("username")
                      .isString()
                      .withMessage("Field: username (string) required"),

                    body("password")
                      .isString()
                      .withMessage("Field: password (string) required"),
                ],
                async (request: Request, response: Response, next: NextFunction) => {
                    try {
                        const errors = validationResult(request);
                        if (!errors.isEmpty()) {
                            this.sendHttpResponse(response, 400, errors.array());
                            return;
                        }

                        const { username, password } = request.body;
                        const user = await this.controller?.login(username, password);
                        if (user) {
                            Authorization.sendAuthCookie(user, response);
                            this.sendHttpResponse(response, 200, user);
                        } else {
                            this.sendHttpResponse(response, 401, "Invalid credentials"); // TODO: handle in next() somehow
                        }
                    } catch (error) {
                        next(error);
                    }
                }
            );

            this.router.post(
                "/logout", // Nothing to validate as request body is empty
                async (request: Request, response: Response, next: NextFunction) => {
                    try {
                        Authorization.logout(response);
                        this.sendHttpResponse(response, 200, "Logout successful");
                    } catch (error) {
                        next(error);
                    }
                }
            );

            // TODO add /me or /:id route

        } catch (error) {
            this.logger.logError(error);
        }
    }
}

export default AuthApi;