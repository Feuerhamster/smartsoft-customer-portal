import {EMessageFrom} from "@prisma/client";
import {IsEnum, IsNotEmpty, IsOptional, IsString, Length} from "class-validator";

export class DTOMessage {

    @IsOptional()
    @IsString()
    to?: string;

    @IsString()
    @Length(0, 255)
    subject: string;

    @IsNotEmpty()
    @IsString()
    @Length(1, 12000)
    text: string;
}