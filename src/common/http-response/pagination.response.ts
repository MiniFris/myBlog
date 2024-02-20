import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { HttpResponse } from './http-response';

export class PaginationResponse<T> extends HttpResponse {
    @ApiProperty({ description: 'Количество имеющихся элементов', example: 5 })
    @Expose()
    totalCount: number;

    @Expose()
    items: T[];

    static createResponse<F extends typeof HttpResponse>(response: F): typeof PaginationResponse<F> {
        const className = `Rows${response.name}`;
        const rowsClass = { [className]: class extends PaginationResponse<F> {} };
        const decorators = [Type(() => response), ApiProperty({ description: 'Элементы', type: () => [response] })];
        Reflect.decorate([Reflect.metadata('design:type', response)], rowsClass[className]);
        Reflect.decorate(decorators, rowsClass[className].prototype, 'items', Object.getOwnPropertyDescriptor(rowsClass[className].prototype, 'items'));
        return rowsClass[className];
    }
}