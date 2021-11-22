import {ValidationError} from "class-validator";
import {EUserType} from "./auth";

declare global {
    namespace Express {
        interface Request {
            validationErrors: ValidationError[];
            userId: string;
            userType: EUserType;
        }
    }
}

export {};