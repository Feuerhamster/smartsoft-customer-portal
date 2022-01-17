import {Request, Response} from "express";

export default function escapeHTMLMiddleware(req: Request, res: Response, next: any) {
    for (let key in req.body) {
        if (typeof req.body[key] === "string") {
            // escape html control characters
            req.body[key] = req.body[key].replace(/[&<>"']/g, (c) => {
                return {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    '"': "&quot;",
                    "'": "&#x27;",
                }[c];
            });
        }
    }

    next();
}