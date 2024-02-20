import { ApiProperty } from '@nestjs/swagger';
import { HttpResponse } from 'src/common/http-response/http-response';
import { Expose } from 'class-transformer';

import { AuthTokens } from '../interface/auth-tokens.interface';

export class AuthTokensResponse extends HttpResponse implements AuthTokens {
    @ApiProperty({ description: 'Временный токен' })
    @Expose()
    accessToken: string;

    @ApiProperty({ description: 'Долгосрочный токен' })
    @Expose()
    refreshToken: string;
}