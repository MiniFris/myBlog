import { User } from 'src/user/user.entity';
import { DataSource } from 'typeorm';

export const databaseProviders = [
    {
        provide: 'DATA_SOURCE',
        useFactory: async () => {
            const dataSource = new DataSource({
                type: 'postgres',
                port: +process.env.DB_PORT,
                host: process.env.DB_IP,
                username: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                logging: process.env.DB_LOGGING == 'true',
                synchronize: false,
                entities: [
                    User,
                ]
            });

            return dataSource;
        },
    },
];