import { USER_REPOSITORY } from './constant';
import { User } from './user.entity';

export const userProviders = [
    {
        provide: USER_REPOSITORY,
        useValue: User
    },
];