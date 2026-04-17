import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { AccountType } from "generated/prisma/enums";


export class CreateAccountDto {
    @ApiProperty({ example: 'My Savings' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ enum: AccountType, example: AccountType.SAVINGS })
    @IsEnum(AccountType)
    type: AccountType
}