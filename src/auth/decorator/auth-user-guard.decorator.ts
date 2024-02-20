import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { AccessTokenGuard } from '../guard/access-token.guard';

export const AuthJWTGuard = () => {
    return applyDecorators( UseGuards(AccessTokenGuard), ApiBearerAuth() );
};
