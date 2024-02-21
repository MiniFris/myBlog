import { CacheModule } from '@nestjs/cache-manager';
import { DynamicModule, Module } from '@nestjs/common';

@Module({})
export class CacheManagerModule {
    public static register(): DynamicModule {
        return CacheModule.registerAsync({
            isGlobal: true,
            useFactory: async () => ({
                socket: {
                    host: process.env.REDIS_HOST,
                    port: +process.env.REDIS_PORT,
                }
            })
        });
    }
}