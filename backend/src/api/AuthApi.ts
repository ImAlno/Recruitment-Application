import { Request, Response, NextFunction } from 'express';
import RequestHandler from "./RequestHandler";

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
            )

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
            )
        } catch (error) {
            console.error("AuthApi initialization error:", error);
        }
    }
}

export default AuthApi;