import { DataSource } from 'typeorm';
import { DATA_SOURCE } from 'src/database/constant';

import { USER_REPOSITORY } from './constant';
import { User } from './user.entity';

export const userProviders = [
    {
        provide: USER_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
        inject: [DATA_SOURCE],
    },
];