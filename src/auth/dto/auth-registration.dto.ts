import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class AuthRegistrationDto {
    @ApiProperty({ example: 'test@mail.ru', description: 'Электронная почта' })
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'Вася', description: 'Имя пользователя' })
    @IsString()
    @IsNotEmpty()
    @Length(2, 30)
    firstName: string;

    @ApiProperty({ example: 'geyvu4DLNLdl3pyCtciwlwSLnbfSRx', description: 'Пароль' })
    @IsString()
    @IsNotEmpty()
    @Length(8, 60)
    password: string;
}