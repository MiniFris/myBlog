import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthLoginDto {
    @ApiProperty({ example: 'test@mail.ru', description: 'Электронная почта' })
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'geyvu4DLNLdl3pyCtciwlwSLnbfSRx', description: 'Пароль' })
    @IsString()
    @IsNotEmpty()
    password: string;
}