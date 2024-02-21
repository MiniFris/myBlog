import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, map } from 'rxjs';

import { TRANSFORM_TO_RESPONSE } from '../constant';
import { HttpResponse } from '../http-response';

@Injectable()
export class TransformToHttpResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const response = Reflect.getMetadata(TRANSFORM_TO_RESPONSE, context.getHandler()) as typeof HttpResponse;
        return next
            .handle()
            .pipe(
                map(v => (Array.isArray(v) ? response.createFromArray : response.create).apply(response, [v])),
            );
    }
}