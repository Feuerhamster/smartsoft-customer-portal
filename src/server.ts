import "reflect-metadata";
import express from "express";
import { Server } from "@overnightjs/core";
import {Container} from "typedi";
import AuthController from "./controllers/auth.controller";
import {IndexController} from "./controllers/index.controller";
import {AuthMiddleware} from "./middlewares/authentication.middleware";
import cookieParser from "cookie-parser";
import {EmployeeController} from "./controllers/employees.controller";
import {EmployeeService} from "./services/employee.service";
import {CustomerController} from "./controllers/customers.controller";
import {MessagesController} from "./controllers/messages.controller";
import {DesignController} from "./controllers/design.controller";

export class SmartSoftCustomerPortalServer extends Server {

    constructor() {
        super(false);

        // Parse body from post requests of urlencoded html forms
        this.app.use(express.urlencoded({extended: true}));

        this.app.use(express.static("public"));
        this.app.use(cookieParser());

        // Configure template engine (frontend pages)
        this.app.set("views", "views");
        this.app.set("view engine", "pug");

        // Use authentication middleware globally to inject user data to all routes
        let authMiddleware: AuthMiddleware = Container.get(AuthMiddleware);
        this.app.use(authMiddleware.middleware());

        this.setupControllers();

        // Generate default user if not exists
        let es: EmployeeService = Container.get(EmployeeService);
        es.generateDefaultEmployee();
    }

    /**
     * Setup all the controllers
     */
    private setupControllers(): void {
        const indexController = Container.get(IndexController);
        const authController = Container.get(AuthController);
        const employeeController = Container.get(EmployeeController);
        const customerController = Container.get(CustomerController);
        const messagesController = Container.get(MessagesController);
        const designController = Container.get(DesignController);

        super.addControllers([
            indexController,
            authController,
            employeeController,
            customerController,
            messagesController,
            designController
        ]);
    }

    /**
     * Start the server
     * @param {number} port Port for the server to listen on
     */
    public start(port: number): void {
        this.app.listen(port, () => {
            console.log("Server started on port " + port);
        })
    }
}