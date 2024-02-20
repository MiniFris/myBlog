import { SetMetadata, UseInterceptors, applyDecorators } from '@nestjs/common';

import { HttpResponse } from '../http-response';
import { TRANSFORM_TO_RESPONSE } from '../constant';
import { TransformToHttpResponseInterceptor } from '../interceptor/transform-to-http-response.interceptor';

export const TransformToHttpResponse = (response: typeof HttpResponse) => applyDecorators(SetMetadata(TRANSFORM_TO_RESPONSE, response), UseInterceptors(TransformToHttpResponseInterceptor));