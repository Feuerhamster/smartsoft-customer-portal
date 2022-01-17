import {Service} from "typedi";
import {ClassMiddleware, Controller, Get, Middleware, Post} from "@overnightjs/core";
import {loginRequired} from "../middlewares/authentication.middleware";
import {Request, Response} from "express";
import {CustomerService} from "../services/customer.service";
import {Customer, Employee} from "@prisma/client";
import {validator} from "../middlewares/validation.middleware";
import {DTOAddCustomer} from "../models/dto/customer";
import {EmployeeService} from "../services/employee.service";
import {EUserType} from "../models/auth";
import {CustomerWithContact} from "../models/database";
import escapeHTMLMiddleware from "../middlewares/escape.middleware";

@Service()
@Controller("customers")
@ClassMiddleware([loginRequired(EUserType.Employee)])
export class CustomerController {
    constructor(
        private readonly customerService: CustomerService,
        private readonly employeeService: EmployeeService,
    ) {}

    @Get("/")
    public async index(req: Request, res: Response) {
        let customers: CustomerWithContact[] = await this.customerService.getAll();

        res.render("customers", { customers });
    }

    @Get("add")
    public async createCustomer(req: Request, res: Response) {
        let employees: Employee[] = await this.employeeService.getAll();

        res.render("create-customer", {employees})
    }


    @Post("add")
    @Middleware([escapeHTMLMiddleware, validator(DTOAddCustomer)])
    public async executeCreateCustomer(req: Request<{}, {}, DTOAddCustomer>, res: Response) {
        if (req.validationErrors.length > 1) return res.render("customers", { error: "validation" })

        await this.customerService.add(req.body);

        res.redirect("/customers");
    }

    @Get(":id/delete")
    public async deleteCustomer(req: Request<{id: string}>, res: Response) {
        let deleted: boolean = await this.customerService.delete(req.params.id);

        if (deleted) {
            res.redirect("/customers");
        } else {
            let customers: CustomerWithContact[] = await this.customerService.getAll();
            let employees: Employee[] = await this.employeeService.getAll();
            res.render("customers", { customers, employees, error: "customer_delete_exception" });
        }
    }
}