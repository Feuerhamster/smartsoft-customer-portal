import {Controller, Get, Middleware, Post} from "@overnightjs/core";
import {Request, Response} from "express";
import {Service} from "typedi";
import AuthService from "../services/auth.service";
import {DTOLoginCustomer, DTOLoginEmployee, LoginResponseCustomer, LoginResponseEmployee} from "../models/dto/login";
import {validator} from "../middlewares/validation.middleware";
import {loginRequired} from "../middlewares/authentication.middleware";

@Service()
@Controller("auth")
export default class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get("login/customer")
    public loginCustomer(req: Request, res: Response) {
        return res.render("login-customer");
    }

    @Get("login/employee")
    public loginEmployee(req: Request, res: Response) {
        return res.render("login-employee");
    }

    @Post("login/employee")
    @Middleware([validator(DTOLoginEmployee)])
    public async performEmployeeLogin(req: Request<{}, {}, DTOLoginEmployee>, res: Response) {

        // Validation failed
        if (req.validationErrors.length > 0) res.render("login-employee", { error: "validation" });

        let loginResponse: LoginResponseEmployee = await this.authService.loginEmployee(req.body.email, req.body.password);

        // Login failed
        if (!loginResponse) return res.render("login-employee", { error: "authentication" });

        // Successful login
        res.cookie("token", loginResponse.token);
        return res.redirect("/");
    }

    @Post("login/customer")
    @Middleware([validator(DTOLoginCustomer)])
    public async performCustomerLogin(req: Request<{}, {}, DTOLoginCustomer>, res: Response) {
        // Validation failed
        if (req.validationErrors.length > 0) res.render("login-customer", { error: "validation" });

        let loginResponse: LoginResponseCustomer = await this.authService.loginCustomer(req.body.username, req.body.customerNumber);

        // Login failed
        if (!loginResponse) return res.render("login-customer", { error: "authentication" });

        // Successful login
        res.cookie("token", loginResponse.token);
        return res.redirect("/");
    }

    @Get("logout")
    @Middleware([loginRequired()])
    public logout(req: Request, res: Response) {
        res.clearCookie("token");
        return res.redirect("/");
    }
}