import {Service} from "typedi";
import DatabaseService from "./database.service";
import {Customer} from "@prisma/client";
import {DTOAddCustomer} from "../models/dto/customer";
import {CustomerWithContact} from "../models/database";

@Service()
export class CustomerService {
    constructor(private readonly database: DatabaseService) {}

    public async getAll(): Promise<CustomerWithContact[]> {
        return await this.database.getCustomers();
    }

    public async get(id: string): Promise<CustomerWithContact> {
        return await this.database.findCustomer({id});
    }

    public async add(customer: DTOAddCustomer): Promise<Customer> {
        return await this.database.addCustomer(
            customer.username,
            customer.customerNumber,
            customer.pricingModel,
            customer.contact
        );
    }

    public async delete(id: string): Promise<boolean> {
        let customer: Customer =  await this.database.deleteCustomer(id);
        return !!customer;
    }
}