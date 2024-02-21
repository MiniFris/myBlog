import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({})
export class DatabaseModule {
    static register(): DynamicModule {
        return TypeOrmModule.forRoot({
            type: 'postgres',
            port: +process.env.DB_PORT,
            host: process.env.DB_IP,
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            logging: process.env.DB_LOGGING == 'true',
            autoLoadEntities: true,
            synchronize: false,
        });
    }
}
