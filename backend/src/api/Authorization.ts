import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { Controller } from '../controller/Controller';

export class Authorization {

    /** Name of the authentication cookie. */
    static get AUTH_COOKIE_NAME() {
        return 'Authorization';
    }

    static async checkLogin(contr: Controller, req: Request, res: Response, errorHandler: (res: Response, code: number, msg: string) => void): Promise<boolean> {
        const authCookie = req.cookies[this.AUTH_COOKIE_NAME];
        if (!authCookie) {
            errorHandler(res, 401, 'Invalid or missing authorization token');
            return false;
        }
        try {
            const userJWTPayload: any = jwt.verify(authCookie, process.env.JWT_SECRET || "temporary_secret_key");
            const loggedInUser = await contr.isLoggedIn(userJWTPayload.username);
            if (!loggedInUser) {
                res.clearCookie(this.AUTH_COOKIE_NAME);
                errorHandler(res, 401, 'Invalid or missing authorization token');
                return false;
            }

            (req as any).user = loggedInUser;
            return true;
        } catch (err) {
            res.clearCookie(this.AUTH_COOKIE_NAME);
            errorHandler(res, 401, 'Invalid or missing authorization token');
            return false;
        }
    }

    static sendAuthCookie(user: any, res: Response) {
        const jwtToken = jwt.sign(
            {id: user.id, username: user.username, role: user.role},
            process.env.JWT_SECRET || "temporary_secret_key",
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

    static logout(res: Response) {
        res.clearCookie(this.AUTH_COOKIE_NAME);
    }
}