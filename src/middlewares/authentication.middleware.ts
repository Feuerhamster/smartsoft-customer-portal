import {Request, Response} from "express";
import {EUserType, JWTClaimsCustomer, JWTClaimsEmployee} from "../models/auth";
import {ConfigService} from "../services/config.service";
import jwt from "jsonwebtoken";
import {Service} from "typedi";

@Service()
export class AuthMiddleware {
    constructor(private readonly config: ConfigService) {}

    /**
     * Express middleware to handle if a user is logged in or not
     */
    public injectUserData(req: Request, res: Response, next: any): void {
        let token: string = req.cookies.token;

        let claims: JWTClaimsEmployee | JWTClaimsCustomer = null;

        // Verify the json web token and set user claims, if the token is present in the cookie header
        if (token) {
            try {
                claims = jwt.verify(token, this.config.jwtSecret);
            } catch (e) {}

            if (claims) {
                req.userId = claims.id;
                req.userType = claims.type;
            }
        }

        let render = res.render;

        // Overwrite the render function to have the user data injected by default
        res.render = function (view: string, options: any = {}) {
            options.user = claims;
            options.EUserType = EUserType;
            options.routePath = req.originalUrl;
            render.call(this, view, options);
        };

        next();
    }

    public middleware() {
        return (req: Request, res: Response, next: any)  => this.injectUserData(req, res, next);
    }
}

function loginRequiredMiddleware(req: Request, res: Response, next: any, onlyFor?: EUserType) {
    if (!req.userId) {
        return res.redirect("/auth/login");
    }

    if (onlyFor && req.userType !== onlyFor) {
        return res.redirect("/auth/login-customer");
    }

    return next();
}

export function loginRequired(onlyFor?: EUserType) {
    return (req, res, next) => loginRequiredMiddleware(req, res, next, onlyFor);
}
