import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto {
    @ApiProperty({ example: 'Jane Doe' })
    @IsString()
    @IsNotEmpty()
    name: string;
}