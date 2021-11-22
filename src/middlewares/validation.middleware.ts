import {Request, Response} from "express";
import {validate} from "class-validator";
import {plainToClass} from "class-transformer";

async function validateBody(req: Request, res: Response, next: any, schema) {
    req.body = plainToClass(schema, req.body);
    req.validationErrors = await validate(req.body);
    next();
}

export function validator(schema) {
    return (req: Request, res: Response, next: any) => validateBody(req, res, next, schema);
}