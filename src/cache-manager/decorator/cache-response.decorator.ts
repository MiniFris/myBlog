import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common';

import { CACHE_MANAGER_KEY } from '../constant';
import { CacheManagerInterceptor } from '../interceptor/cache-manager.interceptor';

export const CacheResponse = (key: string) => applyDecorators(SetMetadata(CACHE_MANAGER_KEY, { key }), UseInterceptors(CacheManagerInterceptor));