import {EPricingModel, Employee, Customer} from "@prisma/client";
import {EMessageFrom} from "@prisma/client";

export type CustomerWithContact = {
    id: string
    username: string
    pricingModel: EPricingModel
    customerNumber: string
    createdAt: Date
    updatedAt: Date
    contact: Employee
}

export type MessageWithCustomerAndEmployee = {
    id: string
    subject: string
    text: string
    from: EMessageFrom
    employee: Employee
    customer: Customer
    createdAt: Date
    updatedAt: Date
}


export type EmployeeWithCustomers = {
    id: string
    firstName: string
    lastName: string
    email: string
    password: string
    salt: string
    createdAt: Date
    updatedAt: Date
    customers: Customer[]
}