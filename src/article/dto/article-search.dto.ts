import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsOptional, IsInt, IsPositive, IsArray, IsDate } from 'class-validator';


export class ArticleSearchDto {
    @ApiProperty({ required: false, description: 'Поисковый запрос', example: 'О то' })
    @IsString()
    @IsOptional()
    query?: string;

    @ApiProperty({ required: false, description: 'Идентификаторы авторов', example: [1, 5, 2] })
    @Type(() => Number)
    @IsArray()
    @IsPositive({ each: true })
    @IsInt({ each: true })
    @IsOptional()
    authorIds?: number[];

    @ApiProperty({ required: false, description: 'Начало диапазона времени публикации', example: new Date })
    @Type(() => Date)
    @IsDate()
    @IsOptional()
    start: Date;

    @ApiProperty({ required: false, description: 'Конец диапазона времени публикации', example: new Date(new Date().setHours(100)) })
    @Type(() => Date)
    @IsDate()
    @IsOptional()
    end: Date;
}