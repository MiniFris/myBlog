import { ExceptionFilter, Catch, ArgumentsHost, HttpException, NotFoundException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { EntityNotFoundError } from 'typeorm';

@Catch(EntityNotFoundError)
export class EntityNotFoundExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        response
            .status(HttpStatus.NOT_FOUND)
            .json(new NotFoundException().getResponse());
    }
}