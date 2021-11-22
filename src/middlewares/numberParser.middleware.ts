import {Request, Response} from "express";

/**
 * Middleware to parse numbers in post body data because in urlencoded forms every value is a string,
 * but we need numbers as numbers.
 * @param req
 * @param res
 * @param next
 * @param fields
 */
export function numberParserMiddleware(req: Request, res: Response, next: any, fields: string[]) {
    if (!req.body) return next();

    for (let key in req.body) {
        if (!fields.includes(key)) continue;

        if (!isNaN(req.body[key])) {
            req.body[key] = parseInt(req.body[key]);
        }
    }

    return next();
}

export default function (fields: string[]) {
    return (req: Request, res: Response, next: any) => numberParserMiddleware(req, res, next, fields);
}