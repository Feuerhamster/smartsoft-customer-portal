import {ClassMiddleware, Controller, Get, Middleware, Post} from "@overnightjs/core";
import {Service} from "typedi";
import {Request, Response} from "express";
import {loginRequired} from "../middlewares/authentication.middleware";
import {EmployeeService} from "../services/employee.service";
import {Employee} from "@prisma/client";
import {DTOAddEmployee} from "../models/dto/employee";
import {EUserType} from "../models/auth";
import {validator} from "../middlewares/validation.middleware";
import {DTOAddCustomer} from "../models/dto/customer";
import escapeHTMLMiddleware from "../middlewares/escape.middleware";

@Service()
@Controller("employees")
@ClassMiddleware(loginRequired(EUserType.Employee))
export class EmployeeController {
    constructor(private readonly employeeService: EmployeeService) {}

    @Get("/")
    public async index(req: Request, res: Response) {
        let employees: Employee[] = await this.employeeService.getAll();

        res.render("employees", { employees });
    }

    @Get("add")
    public async createEmployee(req: Request, res: Response) {
        res.render("create-employee");
    }

    @Post("add")
    @Middleware([escapeHTMLMiddleware, validator(DTOAddEmployee)])
    public async executeCreateEmployee(req: Request<{}, {}, DTOAddEmployee>, res: Response) {
        await this.employeeService.add(req.body);
        res.redirect("/employees");
    }

    @Get(":id/delete")
    public async deleteEmployee(req: Request<{id: string}>, res: Response) {
        let deleted: boolean = await this.employeeService.delete(req.params.id);

        if(deleted) {
            res.redirect("/employees");
        } else {
            let employees: Employee[] = await this.employeeService.getAll();
            res.render("employees", { employees, error: "employee_delete_exception" });
        }
    }
}