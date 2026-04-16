import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { AccountType } from "generated/prisma/enums";


export class CreateAccountDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEnum(AccountType)
    type: AccountType
}