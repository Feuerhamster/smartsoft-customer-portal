import {Service} from "typedi";
import {ClassMiddleware, Controller, Get, Middleware, Post} from "@overnightjs/core";
import {MessageService} from "../services/message.service";
import {Request, Response} from "express";
import {loginRequired} from "../middlewares/authentication.middleware";
import {EMessageFrom, Message} from "@prisma/client";
import {EUserType} from "../models/auth";
import {validator} from "../middlewares/validation.middleware";
import {DTOMessage} from "../models/dto/message";
import {CustomerService} from "../services/customer.service";
import {CustomerWithContact, MessageWithCustomerAndEmployee, EmployeeWithCustomers} from "../models/database";
import {EmployeeService} from "../services/employee.service";

@Service()
@Controller("messages")
@ClassMiddleware(loginRequired())
export class MessagesController {
    constructor(
        private readonly messageService: MessageService,
        private readonly customerService: CustomerService,
        private readonly employeeService: EmployeeService,
    ) {}

    @Get("/")
    async getMessages(req: Request, res: Response) {
        let messages: MessageWithCustomerAndEmployee[] = [];

        if (req.userType == EUserType.Employee) {
            messages = await this.messageService.getByEmployee(req.userId);
        } else if (req.userType == EUserType.Customer) {
            messages = await this.messageService.getByCustomer(req.userId);
        }

        res.render("messages", {messages, EMessageFrom});
    }

    @Get("send")
    async sendMessage(req: Request, res: Response) {

        if (req.userType == EUserType.Employee) {
            const employee: EmployeeWithCustomers = await this.employeeService.get(req.userId);
            return res.render("send-message", {customers: employee.customers});
        } else {
            const customer: CustomerWithContact = await this.customerService.get(req.userId);
            res.render("send-message", {contact: customer.contact});
        }
    }

    @Post("send")
    @Middleware(validator(DTOMessage))
    async executeSendMessage(req: Request, res: Response) {

        let messageCustomerId: string;
        let messageEmployeeId: string;
        let from: EMessageFrom;

        if (req.userType == EUserType.Customer) {
            let customer: CustomerWithContact = await this.customerService.get(req.userId);
            messageCustomerId = customer.id;
            messageEmployeeId = customer.contact.id;
            from = EMessageFrom.Customer;
        } else if (req.userType == EUserType.Employee) {
            messageCustomerId = req.body.to;
            messageEmployeeId = req.userId;
            from = EMessageFrom.Employee;
        }

        await this.messageService.send(req.body, messageEmployeeId, messageCustomerId, from);

        res.redirect("/messages");
    }

}