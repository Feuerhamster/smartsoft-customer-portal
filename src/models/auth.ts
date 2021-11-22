export enum EUserType {
    Employee,
    Customer
}

export interface JWTClaimsEmployee {
    id: string;
    type: EUserType.Employee;
    firstName: string;
    lastName: string;
}

export interface JWTClaimsCustomer {
    id: string;
    type: EUserType.Customer
    username: string;
    customerNumber: string;
}