import {IsEmail, IsNotEmpty, IsString, Length} from "class-validator";
import {Employee} from "@prisma/client";
import {Customer} from "@prisma/client";
import {CustomerWithContact} from "../database";

export class DTOLoginEmployee {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @Length(5, 200)
    password: string;
}

export class DTOLoginCustomer {
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @Length(10, 10)
    customerNumber: string;
}

export interface LoginResponseEmployee {
    employee: Employee;
    token: string;
}

export interface LoginResponseCustomer {
    customer: CustomerWithContact;
    token: string;
}