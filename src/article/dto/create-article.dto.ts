import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';


export class CreateArticleDto {
    @ApiProperty({ description: 'Наименование', example: 'О том как я создал свой блог' })
    @IsNotEmpty()
    @IsString()
    @Length(10, 255)
    name: string;

    @ApiProperty({ description: 'Описание', example: 'Описание моей истории на +100500 слов' })
    @IsNotEmpty()
    @IsString()
    @Length(10)
    description: string;
}