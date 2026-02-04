import { Request, Response, NextFunction } from 'express';
import RequestHandler from "./RequestHandler";
import { Authorization } from './Authorization';

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
                async (request: Request, response: Response, next: NextFunction) => {
                    try {
                        const registeredUser = await this.controller?.register(request.body);
                        if (registeredUser === null) {
                            this.sendHttpResponse(response, 401, "Registration failed");
                            return;
                        } else {
                            this.sendHttpResponse(response, 200, "Registration successful");
                        }
                    } catch (error) {
                        console.error("Registration error:", error);
                        this.sendHttpResponse(response, 500, "Internal Server Error");
                    }
                }
            );

            /*
                Check if username or email is available.
            */
            this.router.get(
                "/availability",
                async (request: Request, response: Response, next: NextFunction) => {
                    try {
                        const { username, email } = request.query;
                        const status = await this.controller?.isAvailable(
                            username as string,
                            email as string
                        );
                        this.sendHttpResponse(response, 200, status);
                    } catch (error) {
                        console.error("Availability check error:", error);
                        this.sendHttpResponse(response, 500, "Internal Server Error");
                    }
                }
            );

            /*
                User login. When user tries to log in to the web service a request will be sent here.
            */

/*             this.router.post(
                "/login",
                async (request: Request, response: Response, next: NextFunction) => {
                    try {
                        const { username, password } = request.body;
                        const result = await this.controller?.login(username, password);
                        if (result) {
                            const roleName = result.user.role === 1 ? 'recruiter' : 'applicant';
                            response.cookie('Authorization', result.token, {
                                httpOnly: true,
                                secure: false,
                                sameSite: 'lax',
                                maxAge: 3600000
                            });
                            const responseBody = {
                                token: result.token,
                                user: {
                                    id: result.user.id,
                                    username: result.user.username,
                                    role: roleName
                                }
                            };
                            this.sendHttpResponse(response, 200, responseBody);
                        } else {
                            this.sendHttpResponse(response, 401, "Invalid credentials");
                        }
                    } catch (error) {
                        console.error("Login error:", error);
                        this.sendHttpResponse(response, 500, "Internal Server Error");
                    }
                }
            ); */

            this.router.post(
                "/login",
                async (request: Request, response: Response) => {
                    try {
                        const { username, password } = request.body;
                        const user = await this.controller?.login(username, password);
                        if (user) {
                            //Authorization.sendAuthCookie(user, response);
                            this.sendHttpResponse(response, 200, user);
                        } else {
                            this.sendHttpResponse(response, 401, "Invalid credentials");
                        }
                    } catch (error) {
                        console.error("Login error:", error);
                        this.sendHttpResponse(response, 500, "Internal Server Error");
                    }
                }
            );

            this.router.post(
                "/logout",
                async (request: Request, response: Response) => {
                    try {
                        Authorization.logout(response);
                        this.sendHttpResponse(response, 200, "Logout successful");
                    } catch (error) {
                        console.error("Logout error:", error);
                        this.sendHttpResponse(response, 500, "Internal Server Error");
                    }
                }
            );

            // TODO add /me or /:id route

        } catch (error) {
            console.error("AuthApi initialization error:", error);
        }
    }
}

export default AuthApi;