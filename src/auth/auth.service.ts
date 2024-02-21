import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';
import { scryptSync, timingSafeEqual } from 'crypto';

import { LoginPayload } from './payload/login.payload';
import { WRONG_LOGIN_OR_PASSWORD, getJWTSecret } from './constant';
import { AuthUserPayload } from './payload/auth-user.payload';
import { AuthTokens } from './interface/auth-tokens.interface';
import { RegistrationPayload } from './payload/registration.payload';


@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}


    //Methods
    public async registration(payload: RegistrationPayload) {
        await this.userService.create(payload);
    }

    public async login(payload: LoginPayload): Promise<AuthTokens> {
        const user = await this.userService.findByEmail(payload.email);
        if(!(user && this.verify(user, payload.password))) throw new BadRequestException(WRONG_LOGIN_OR_PASSWORD());

        const tokens = await this.getTokens(user);
        await this.userService.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }

    public async refreshTokens(payload: AuthUserPayload): Promise<AuthTokens> {
        if(!payload.refreshToken) throw new ForbiddenException();

        const user = await this.userService.findById(payload.id);
        if(!user) throw new ForbiddenException();

        const tokens = await this.getTokens(user);
        await this.userService.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }

    private verify(user: User, password: string): boolean {
        const [userPassword, salt] = user.password.split(':');
        const pass1 = Buffer.from(userPassword, 'hex');
        const pass2 = scryptSync(password, Buffer.from(salt, 'hex'), 64);
        return timingSafeEqual(pass1, pass2);
    };

    private async getTokens(user: User): Promise<AuthTokens> {
        const userData = {
            id: user.id,
            firstName: user.firstName,
            email: user.email,
        };
        return {
            accessToken: await this.jwtService.signAsync(userData, {
                secret: getJWTSecret('access'),
                expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME,
            }),
            refreshToken: await this.jwtService.signAsync(userData, {
                secret: getJWTSecret('refresh'),
                expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME,
            }),
        };
    }
}
