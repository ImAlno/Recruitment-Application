import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { Controller } from '../controller/Controller';
import Logger from '../util/Logger';

/**
 * Utility class handling authorization, roles, and JSON Web Tokens (JWT).
 */
export class Authorization {
    private static logger = new Logger();

    /** Name of the authentication cookie. */
    static get AUTH_COOKIE_NAME() {
        return 'Authorization';
    }

    /**
     * Checks if the user is currently logged in by verifying the authorization cookie.
     */
    static async checkLogin(contr: Controller, req: Request, res: Response, errorHandler: (res: Response, code: number, msg: string) => void): Promise<boolean> {
        const authCookie = req.cookies[this.AUTH_COOKIE_NAME];
        if (!authCookie) {
            errorHandler(res, 401, 'Invalid or missing authorization token');
            return false;
        }
        try {
            const jwtSecret = process.env.JWT_SECRET;
            if (!jwtSecret) {
                throw new Error("Missing or invalid environment variable JWT_SECRET");
            }
            const userJWTPayload: any = jwt.verify(authCookie, jwtSecret);
            const loggedInUser = await contr.isLoggedIn(userJWTPayload.username);

            (req as any).user = loggedInUser;
            return true;
        } catch (err) {
            res.clearCookie(this.AUTH_COOKIE_NAME);
            errorHandler(res, 401, 'Invalid or missing authorization token');
            Authorization.logger.logError(err);
            return false;
        }
    }

    /**
     * Express middleware to require an authenticated user for a route.
     */
    static requireAuth(contr: Controller) {
        return async (req: Request, res: Response, next: NextFunction) => {
            const isAuth = await this.checkLogin(
                contr,
                req,
                res,
                (res, code, msg) => res.status(code).json({ error: msg })
            );

            if (isAuth) {
                next();
            }
        };
    }

    /**
     * Express middleware to restrict a route to a specific user role.
     */
    static requireRole(requiredRole: string) {
        return (req: Request, res: Response, next: NextFunction) => {
            const user = (req as any).user;
            if (user && user.role === requiredRole) {
                next();
            } else {
                res.status(403).json({ error: `Forbidden: Requires ${requiredRole} privileges.` });
            }
        };
    }

    /**
     * Creates and sends an authorization cookie containing the user's JWT token.
     */
    static sendAuthCookie(user: any, res: Response) {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error("Missing or invalid environment variable JWT_SECRET");
        }
        const jwtToken = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            jwtSecret,
            {
                expiresIn: '1h'
            }
        );

        res.cookie(this.AUTH_COOKIE_NAME, jwtToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            expires: new Date(Date.now() + 3600000)
        });
    }

    /**
     * Clears the authorization cookie, logging the user out.
     */
    static logout(res: Response) {
        res.clearCookie(this.AUTH_COOKIE_NAME);
    }
}