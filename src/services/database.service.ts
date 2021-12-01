import {Service} from "typedi";
import { PrismaClient, Employee, Customer, EPricingModel } from "@prisma/client";
import {EMessageFrom, Message} from "@prisma/client";
import {CustomerWithContact, EmployeeWithCustomers, MessageWithCustomerAndEmployee} from "../models/database";

@Service()
export default class DatabaseService {

    private db: PrismaClient;

    constructor() {
        this.db = new PrismaClient();
        console.log("Database connected");
    }

    /**
     * Find employee by a where filter
     * @param where
     * @returns {Promise<Employee | null>} Employee object or null
     */
    public async findEmployee(where: object): Promise<EmployeeWithCustomers> {
        return await this.db.employee.findFirst({
                where,
                include: {
                    customers: true
                }
            });
    }

    /**
     * Get all employees
     * @returns {Promise<Employee[]>} Employee Array
     */
    public async getEmployees(): Promise<Employee[]> {
        return await this.db.employee.findMany()
    }

    /**
     * Get count of employees
     * @returns {Promise<number>} Count of employees
     */
    public async getEmployeeCount(): Promise<number> {
        return await this.db.employee.count();
    }

    /**
     * Create a new employee
     * @param firstName
     * @param lastName
     * @param email
     * @param password
     * @param salt
     * @returns {Promise<Employee>}
     */
    public async addEmployee(
        firstName: string,
        lastName: string,
        email: string,
        password: string,
        salt: string
    ): Promise<Employee> {
        return await this.db.employee.create({
                data: {
                    firstName, lastName, email, password, salt
                }
            });
    }

    /**
     * Delete an employee
     * @param id
     */
    public async deleteEmployee(id: string): Promise<Employee> {
        try {
            return await this.db.employee.delete({
                where: { id }
            });
        } catch (e) {
            return null;
        }
    }

    /**
     * Get all customers
     * @returns {Promise<Customer[]>} Customer Array
     */
    public async getCustomers(): Promise<CustomerWithContact[]> {
        return await this.db.customer.findMany({
                include: {
                    contact: true
                }
            });
    }

    /**
     * Find customer by where filter
     * @param where
     */
    public async findCustomer(where: object): Promise<CustomerWithContact> {
        return await this.db.customer.findFirst({
                where,
                include: {
                    contact: true
                }
            });
    }

    /**
     * Add a new customer
     * @param username
     * @param customerNumber
     * @param pricingModel
     * @param contact
     */
    public async addCustomer(
        username: string,
        customerNumber: string,
        pricingModel: EPricingModel,
        contact: string
    ): Promise<Customer> {
        return await this.db.customer.create({
                data: {
                    username, customerNumber, pricingModel, contact: {
                        connect: {
                            id: contact
                        }
                    }
                }
            });
    }

    /**
     * Delete a customer
     * @param id
     */
    public async deleteCustomer(id: string): Promise<Customer> {
        try {
            return await this.db.customer.delete({
                where: { id }
            });
        } catch (e) {
            return null;
        }
    }

    /**
     * Find messages from a where filter
     * @param where
     */
    public async findMessages(where: object): Promise<MessageWithCustomerAndEmployee[]> {
        return await this.db.message.findMany({
            where,
            include: {
                employee: true,
                customer: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });
    }

    /**
     * Add a new message
     * @param subject Message subject
     * @param text Text of the message
     * @param employee Id of the employee
     * @param customer Id of the customer
     * @param from If the message is from the customer or an employee
     */
    public async createMessage(
        subject: string,
        text: string,
        employee: string,
        customer: string,
        from: EMessageFrom
    ): Promise<Message> {
        return await this.db.message.create({
            data: {
                employee: {
                    connect: {
                        id: employee
                    }
                },
                customer: {
                    connect: {
                        id: customer
                    }
                },
                subject,
                text,
                from
            }
        });
    }
}