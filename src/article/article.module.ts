import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { Article } from './article.entity';

@Module({
    providers: [
        ArticleService,
    ],
    controllers: [
        ArticleController,
    ],
    exports: [
        ArticleService,
    ],
    imports: [
        TypeOrmModule.forFeature([Article]),
    ],
})
export class ArticleModule {}