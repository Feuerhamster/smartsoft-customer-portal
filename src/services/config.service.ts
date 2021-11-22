import {Service} from "typedi";

@Service()
export class ConfigService {
    public readonly jwtSecret: string;

    constructor() {
        this.jwtSecret = process.env.JWT_SECRET;
    }
}