import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TransformToHttpResponse } from 'src/common/http-response/decorator/transform-to-http-response.decorator';

import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthUser } from './decorator/auth-user-param.decorator';
import { AuthTokensResponse } from './response/auth-tokens.response';
import { AuthUserPayload } from './payload/auth-user.payload';
import { RefreshTokenGuard } from './guard/refresh-token.guard';
import { AuthRegistrationDto } from './dto/auth-registration.dto';
import { AuthTokens } from './interface/auth-tokens.interface';

@ApiTags('Аутентификация')
@Controller('auth')
export class AuthController {

    constructor(
        private readonly service: AuthService,
    ) {}

    @ApiOperation({ summary: 'Регистрация пользователя' })
    @ApiNoContentResponse()
    @HttpCode(HttpStatus.NO_CONTENT)
    @Post('/reg')
    async reg(@Body() data: AuthRegistrationDto) {
        await this.service.registration(data);
    }

    @ApiOperation({ summary: 'Аутентификация пользователя' })
    @ApiCreatedResponse({ type: AuthTokensResponse })
    @TransformToHttpResponse(AuthTokensResponse)
    @Post('/login')
    async login(@Body() data: AuthLoginDto): Promise<AuthTokens> {
        return this.service.login(data);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Обновить токены' })
    @ApiOkResponse({ type: AuthTokensResponse })
    @TransformToHttpResponse(AuthTokensResponse)
    @UseGuards(RefreshTokenGuard)
    @Get('/refresh')
    async refreshTokens(@AuthUser() user: AuthUserPayload): Promise<AuthTokens> {
        return this.service.refreshTokens(user);
    }
}
