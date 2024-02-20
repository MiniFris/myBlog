import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, IsOptional } from 'class-validator';

export class UpdateArticleDto {
    @ApiProperty({ required: false, description: 'Наименование', example: 'О том как я создал свой блог' })
    @IsNotEmpty()
    @IsString()
    @Length(10, 255)
    @IsOptional()
    name?: string;

    @ApiProperty({ required: false, description: 'Описание', example: 'Описание моей истории на +100500 слов' })
    @IsNotEmpty()
    @IsString()
    @Length(10)
    @IsOptional()
    description?: string;
}