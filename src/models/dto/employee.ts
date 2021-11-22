import {IsEmail, IsNotEmpty, Length} from "class-validator";

export class DTOAddEmployee {
    @IsNotEmpty()
    @Length(2, 30)
    public firstName: string;

    @IsNotEmpty()
    @Length(2, 30)
    public lastName: string;

    @IsNotEmpty()
    @IsEmail()
    public email: string;

    @IsNotEmpty()
    @Length(5, 200)
    public password: string;
}