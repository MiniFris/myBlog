import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, ForbiddenException } from '@nestjs/common';

import { AuthService } from '../auth.service';
import { WRONG_LOGIN_OR_PASSWORD } from '../constant';
import { AuthUserPayload } from '../payload/auth-user.payload';


const invalidUserEmail = 'invalid@mail.ru';
const invalidUserPassword = 'invalidUserPassword';
const hashPasswordForUser = '2f9b6ee5e4ef43c434fc4db05a30a1a9226754684ae0273221dbc9f200969f04da7eb398f0139c27296e57e66b86219f5c80de47d9d666682f76f580a9ac9103:7c43d7892e2e56fb357c0bea65e28514';
const mockUser = {
    firstName: 'FirstName',
    email: 'email@mail.ru',
    password: 'temppass',
};

const mockUserResponse = {
    id: 1,
    refreshToken: null,
    createdAt: new Date,
    updatedAt: new Date,
    ...mockUser,
    password: hashPasswordForUser,
};

const mockUserService = {
    create: jest.fn(payload => ({ ...mockUserResponse, ...payload })),
    findByEmail: jest.fn(email => email === mockUserResponse.email ? mockUserResponse : null),
    findById: jest.fn(id => id === mockUserResponse.id ? mockUserResponse : null),
    updateRefreshToken: jest.fn(() => mockUserResponse),
};


const mockJwtToken = 'mockJwtToken';
const mockJwtService = {
    signAsync: jest.fn(() => mockJwtToken),
};


const mockJwtServiceFactory = jest.fn(() => mockJwtService);
const mockUserServiceFactory = jest.fn(() => mockUserService);

describe('AuthService', () => {
    let service: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UserService,
                    useFactory: mockUserServiceFactory,
                },
                {
                    provide: JwtService,
                    useFactory: mockJwtServiceFactory,
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });


    describe('registration', () => {
        it('should register user', async () => {
            await service.registration(mockUser);
            expect(mockUserService.create).toHaveBeenCalledWith(mockUser);
        });
    });

    describe('login', () => {
        it('should login user and return access tokens', async () => {
            const response = await service.login({ email: mockUser.email, password: mockUser.password });
            expect(mockJwtService.signAsync).toHaveBeenCalled();
            expect(mockUserService.updateRefreshToken).toHaveBeenCalled();
            expect(response).toStrictEqual({ accessToken: mockJwtToken, refreshToken: mockJwtToken, });
        });

        it('should throw bad request exception: Wrong login or password. When invalid email', async () => {
            let error: BadRequestException;
            try {
                await service.login({ email: invalidUserEmail, password: mockUser.password });
            } catch(e) { error = e }
            expect(error).toBeInstanceOf(BadRequestException);
            expect(error.message).toBe(WRONG_LOGIN_OR_PASSWORD());
        });

        it('should throw bad request exception: Wrong login or password. When invalid password', async () => {
            let error: BadRequestException;
            try {
                await service.login({ email: mockUser.email, password: invalidUserPassword });
            } catch(e) { error = e }
            expect(error).toBeInstanceOf(BadRequestException);
            expect(error.message).toBe(WRONG_LOGIN_OR_PASSWORD());
        });
    });

    describe('refreshTokens', () => {
        it('should refresh access tokens', async () => {
            const response = await service.refreshTokens({ id: mockUserResponse.id, refreshToken: mockJwtToken } as AuthUserPayload);
            expect(mockJwtService.signAsync).toHaveBeenCalled();
            expect(mockUserService.updateRefreshToken).toHaveBeenCalled();
            expect(response).toStrictEqual({ accessToken: mockJwtToken, refreshToken: mockJwtToken, });
        });

        it('should throw forbidden exception. When refreshToken is empty', async () => {
            let error: BadRequestException;
            try {
                await service.refreshTokens({ id: mockUserResponse.id, refreshToken: null } as AuthUserPayload);
            } catch(e) { error = e }
            expect(error).toBeInstanceOf(ForbiddenException);
        });

        it('should throw forbidden exception. When invalid user id', async () => {
            let error: BadRequestException;
            try {
                await service.refreshTokens({ id: 20, refreshToken: mockJwtToken } as AuthUserPayload);
            } catch(e) { error = e }
            expect(error).toBeInstanceOf(ForbiddenException);
        });
    });
});
