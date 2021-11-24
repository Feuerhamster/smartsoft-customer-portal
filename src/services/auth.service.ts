import {Service} from "typedi";
import DatabaseService from "./database.service";
import {Employee} from "@Prisma/client";
import * as crypto from "crypto";
import {LoginResponseCustomer, LoginResponseEmployee} from "../models/dto/login";
import jwt from "jsonwebtoken";
import {ConfigService} from "./config.service";
import {EUserType, JWTClaimsCustomer, JWTClaimsEmployee} from "../models/auth";

@Service()
export default class AuthService {
    constructor(
        private readonly database: DatabaseService,
        private readonly config: ConfigService
    ) {}

    /**
     * Authenticate an employee
     * @param email
     * @param {string} password
     * @returns {Promise<LoginResponseEmployee>} Object with token and user data or null if login failed
     */
    public async loginEmployee(email: string, password: string): Promise<LoginResponseEmployee> {
        let employee: Employee = await this.database.findEmployee({email});

        if (employee == null) return null;

        let pw = await this.encryptPassword(password, employee.salt);
        if (pw.key !== employee.password) return null;

        let claims: JWTClaimsEmployee = {
            id: employee.id,
            type: EUserType.Employee,
            firstName: employee.firstName,
            lastName: employee.lastName,
        };

        let token = jwt.sign(claims, this.config.jwtSecret);

        return {
            token: token,
            employee: employee
        }
    }

    /**
     * Authenticate a customer
     * @param username
     * @param customerNumber
     */
    public async loginCustomer(username: string, customerNumber: string): Promise<LoginResponseCustomer> {
        let customer = await this.database.findCustomer({username, customerNumber});

        if (customer == null) return null;

        let claims: JWTClaimsCustomer = {
            id: customer.id,
            type: EUserType.Customer,
            username: customer.username,
            customerNumber: customer.customerNumber,
        };

        let token = jwt.sign(claims, this.config.jwtSecret);

        return {
            token: token,
            customer: customer
        }
    }

    /**
     * Encrypt a password (string) with a 128 length key scrypt and a 16 bytes salt
     * @param password
     * @param salt (optional)
     * @returns {Promise<{key, salt}|err>}
     */
    public encryptPassword(password: string, salt?: string): Promise<{key: string, salt: string}> {
        return new Promise((resolve, reject) => {
            if(!salt) {
                // Generate 16 bytes salt as hex string to salt the password
                let buff = crypto.randomBytes(16);
                salt = buff.toString("hex");
            }

            crypto.scrypt(password, salt, 128, (err, keyBuffer) => {
                if (err) throw reject(err);
                let key: string = keyBuffer.toString("hex");

                resolve({ key, salt });
            });
        });
    }
}