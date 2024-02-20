import { JwtModule } from '@nestjs/jwt';
import { Global, Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AccessTokenStrategy } from './strategy/access-token.strategy';
import { RefreshTokenStrategy } from './strategy/refresh-token.strategy';

@Global()
@Module({
    providers: [
        AuthService,
        AccessTokenStrategy,
        RefreshTokenStrategy,
    ],
    controllers: [
        AuthController,
    ],
    imports: [
        JwtModule.register({}),
        UserModule,
    ],
})
export class AuthModule {}
