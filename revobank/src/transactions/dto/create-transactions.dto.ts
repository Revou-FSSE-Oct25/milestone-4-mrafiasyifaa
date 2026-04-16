import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from "class-validator";
import { TransactionType } from "generated/prisma/enums";


export class CreateTransactionDto{
    @IsUUID()
    @IsOptional()
    senderAccountId?: string

    @IsUUID()
    @IsOptional()
    receiverAccountId?: string

    @IsNumber()
    @Min(0.0001)
    amount: number

    @IsEnum(TransactionType)
    type: TransactionType

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    description?: string
}