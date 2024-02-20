import { Module } from '@nestjs/common';

import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ArticleModule } from './article/article.module';

@Module({
    imports: [
        DatabaseModule,
        AuthModule,
        UserModule,
        ArticleModule,
    ]
})
export class AppModule {}
