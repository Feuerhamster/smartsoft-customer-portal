import {Service} from "typedi";
import DatabaseService from "./database.service";
import {EMessageFrom, Message} from "@prisma/client";
import {DTOMessage} from "../models/dto/message";
import {MessageWithCustomerAndEmployee} from "../models/database";

@Service()
export class MessageService {
    constructor(private readonly database: DatabaseService) {}

    /**
     * Get all messages that a specific employee sent or received
     * @param id
     */
    public async getByEmployee(id: string): Promise<MessageWithCustomerAndEmployee[]> {
        return await this.database.findMessages({
            employee: {id}
        });
    }

    /**
     * Get all messages that a specific customer send or received
     * @param id
     */
    public async getByCustomer(id: string): Promise<MessageWithCustomerAndEmployee[]> {
        return await this.database.findMessages({
            customer: {id}
        });
    }

    /**
     * Create a new message
     * @param message
     * @param employee
     * @param customer
     * @param from
     */
    public async send(message: DTOMessage, employee: string, customer: string, from: EMessageFrom): Promise<Message> {
        return await this.database.createMessage(
            message.subject,
            message.text,
            employee,
            customer,
            from
        );
    }
}