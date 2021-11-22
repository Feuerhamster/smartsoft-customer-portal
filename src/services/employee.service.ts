import {Service} from "typedi";
import DatabaseService from "./database.service";
import {Employee} from "@Prisma/client";
import {DTOAddEmployee} from "../models/dto/employee";
import AuthService from "./auth.service";
import crypto from "crypto";
import {EmployeeWithCustomers} from "../models/database";

@Service()
export class EmployeeService {
    constructor(
       private readonly database: DatabaseService,
       private readonly auth: AuthService
    ) {}

    /**
     * Get all employees
     */
    public getAll(): Promise<Employee[]> {
        return this.database.getEmployees();
    }

    public get(id: string): Promise<EmployeeWithCustomers> {
        return this.database.findEmployee({id});
    }

    /**
     * Add new employee
     * @param employee Employee DTO Object
     */
    public async add(employee: DTOAddEmployee): Promise<Employee> {

        let { key, salt } = await this.auth.encryptPassword(employee.password);

        return this.database.addEmployee(
            employee.firstName,
            employee.lastName,
            employee.email,
            key,
            salt
        );
    }

    /**
     * Delete an employee
     * @param id
     */
    public async delete(id: string): Promise<boolean> {
        let employee: Employee = await this.database.deleteEmployee(id);
        return !!employee;
    }

    /**
     * Generate a default employee with a random password
     */
    public async generateDefaultEmployee() {
        let count: number = await this.database.getEmployeeCount();

        if(count > 0) return;

        let password: string = crypto.randomBytes(3).toString("hex");

        await this.add({
            firstName: "Admin",
            lastName: "",
            email: "admin@host.local",
            password
        })

        console.log(`Default user created (usr: admin@host.local pwd: ${password})`);
    }
}