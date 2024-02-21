import { ApiProperty } from '@nestjs/swagger';
import { HttpResponse } from 'src/common/http-response/http-response';
import { Expose } from 'class-transformer';

export class ArticleResponse extends HttpResponse {
    @ApiProperty({ description: 'Идентификатор', example: 1 })
    @Expose()
    id: number;

    @ApiProperty({ description: 'Идентификатор автора', example: 1 })
    @Expose()
    authorId: number;

    @ApiProperty({ description: 'Наименование', example: 'О том как я создал свой блог' })
    @Expose()
    name: string;

    @ApiProperty({ description: 'Описание', example: 'Описание моей истории на +100500 слов' })
    @Expose()
    description: string;

    @ApiProperty({ description: 'Дата публикации', example: new Date })
    @Expose()
    createdAt: Date;

    @ApiProperty({ description: 'Дата редактирования', example: new Date })
    @Expose()
    updatedAt: Date;
}