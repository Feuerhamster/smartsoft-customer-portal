import {Request, Response} from "express";
import escape from "escape-html";

export default function escapeHTMLMiddleware(req: Request, res: Response, next: any) {
    for (let key in req.body) {
        if (typeof req.body[key] === "string") {
            req.body[key] = escape(req.body[key]);
        }
    }

    next();
}