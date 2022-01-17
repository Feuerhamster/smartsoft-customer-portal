import {Service} from "typedi";
import DatabaseService from "./database.service";
import {Customer} from "@prisma/client";
import {DTOAddCustomer} from "../models/dto/customer";
import {CustomerWithContact} from "../models/database";

@Service()
export class CustomerService {
    constructor(private readonly database: DatabaseService) {}

    /**
     * Get all customers
     * @returns {Promise<CustomerWithContact[]>} Array of customers with corresponding contact employee loaded in
     */
    public async getAll(): Promise<CustomerWithContact[]> {
        return await this.database.getCustomers();
    }

    /**
     * Get a customer by id
     * @param {string} id Customer id
     * @returns {Promise<CustomerWithContact>} Customer with contact employee loaded in
     */
    public async get(id: string): Promise<CustomerWithContact> {
        return await this.database.findCustomer({id});
    }

    /**
     * Add a customer
     * @param {DTOAddCustomer} customer Instance of a DTO AddCustomer class
     * @returns {Promise<Customer>} Customer added
     */
    public async add(customer: DTOAddCustomer): Promise<Customer> {
        return await this.database.addCustomer(
            customer.username,
            customer.customerNumber,
            customer.pricingModel,
            customer.contact
        );
    }

    /**
     * Delete a customer
     * @param id If of the customer to delete
     */
    public async delete(id: string): Promise<boolean> {
        await this.database.deleteMessages({ customerId: id })
        
        let customer: Customer =  await this.database.deleteCustomer(id);
        return !!customer;
    }
}