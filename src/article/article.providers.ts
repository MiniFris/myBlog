import { DataSource } from 'typeorm';
import { DATA_SOURCE } from 'src/database/constant';

import { ARTICLE_REPOSITORY } from './constant';
import { Article } from './article.entity';

export const articleProviders = [
    {
        provide: ARTICLE_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Article),
        inject: [DATA_SOURCE],
    },
];