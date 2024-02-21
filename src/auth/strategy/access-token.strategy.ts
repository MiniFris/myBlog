import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import { getJWTSecret } from '../constant';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                ExtractJwt.fromAuthHeaderAsBearerToken(),
                ExtractJwt.fromUrlQueryParameter('access_token'),
            ]),
            secretOrKey: getJWTSecret('access'),
            passReqToCallback: true,
        });
    }

    validate(req: Request, payload: any) {
        const accessToken = req.get('Authorization')?.replace('Bearer', '').trim();
        return { ...payload, accessToken };
    }
}