import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { TransactionType } from "generated/prisma/enums";


export class CreateTransactionDto{
    @ApiPropertyOptional({ example: 'uuid-of-sender-account' })
    @IsUUID()
    @IsOptional()
    senderAccountId?: string

    @ApiPropertyOptional({ example: 'uuid-of-receiver-account' })
    @IsUUID()
    @IsOptional()
    receiverAccountId?: string

    @ApiProperty({ example: 50000 })
    @IsNumber()
    @Min(0.0001)
    amount: number

    @ApiPropertyOptional({ enum: TransactionType, example: TransactionType.TRANSFER })
    @IsEnum(TransactionType)
    @IsOptional()
    type: TransactionType

    @ApiPropertyOptional({ example: 'Belanja groceries' })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    description?: string
}