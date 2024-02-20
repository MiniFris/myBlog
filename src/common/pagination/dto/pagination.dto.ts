import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
    @ApiProperty({ description: 'Количество элементов, которое нужно получить', example: 10 })
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    @IsOptional()
    limit?: number;

    @ApiProperty({ description: 'Количество элементов, которое нужно пропустить', example: 0 })
    @Type(() => Number)
    @Min(0)
    @IsInt()
    @IsOptional()
    offset?: number;
}