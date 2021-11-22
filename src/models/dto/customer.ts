import {EPricingModel} from "@prisma/client";
import {IsEnum, IsNotEmpty, Length} from "class-validator";

export class DTOAddCustomer {
    @IsNotEmpty()
    @Length(3, 100)
    username: string;

    @IsNotEmpty()
    @Length(10,10)
    customerNumber: string;

    @IsNotEmpty()
    @IsEnum(EPricingModel)
    pricingModel: EPricingModel;

    @IsNotEmpty()
    contact: string;
}