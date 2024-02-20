import { Module } from '@nestjs/common';

import { ArticleService } from './article.service';
import { articleProviders } from './article.providers';
import { ArticleController } from './article.controller';

@Module({
    providers: [
        ArticleService,
        ...articleProviders,
    ],
    controllers: [
        ArticleController,
    ],
    exports: [
        ArticleService,
    ]
})
export class ArticleModule {}