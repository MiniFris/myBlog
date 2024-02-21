import { ExecutionContext } from '@nestjs/common';
import * as md5 from 'md5';
import { CacheInterceptor } from '@nestjs/cache-manager';

import { CACHE_MANAGER_KEY } from '../constant';

export class CacheManagerInterceptor extends CacheInterceptor {
    trackBy(context: ExecutionContext) {
        const { url, body } = context.switchToHttp().getRequest();
        const hash = md5(JSON.stringify({ url, body }));
        const metadata = Reflect.getMetadata(CACHE_MANAGER_KEY, context.getHandler());
        return `${metadata.key}:${hash}`;
    }

}