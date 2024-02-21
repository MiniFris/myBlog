import { Test, TestingModule } from '@nestjs/testing';

import { AuthUserPayload } from '../payload/auth-user.payload';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';



const mockJwtToken = 'mockJwtToken';
const mockAuthLoginData = {
    email: 'email@mail.ru',
    password: 'password',
};

const mockUser = {
    firstName: 'FirstName',
    ...mockAuthLoginData,
};

const mockAuthTokens = {
    refreshToken: mockJwtToken,
    accessToken: mockJwtToken,
};

const mockAuthService = {
    registration: jest.fn(),
    refreshTokens: jest.fn(() => mockAuthTokens),
    login: jest.fn(() => mockAuthTokens),
};


const mockAuthServiceFactory = jest.fn(() => mockAuthService);

describe('AuthController', () => {
    let controller: AuthController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: AuthService,
                    useFactory: mockAuthServiceFactory,
                }
            ],
            controllers: [
                AuthController,
            ]
        }).compile();

        controller = module.get<AuthController>(AuthController);
    });


    describe('reg', () => {
        it('should register user', async () => {
            await controller.reg(mockUser);
            expect(mockAuthService.registration).toHaveBeenCalledWith(mockUser);
        });
    });

    describe('login', () => {
        it('should login user and return access tokens', async () => {
            const response = await controller.login(mockAuthLoginData);
            expect(mockAuthService.login).toHaveBeenCalledWith(mockAuthLoginData);
            expect(response).toStrictEqual(mockAuthTokens);
        });
    });

    describe('refreshTokens', () => {
        it('should refresh access tokens', async () => {
            const data = { id: 1, refreshToken: mockJwtToken } as AuthUserPayload;
            const response = await controller.refreshTokens(data);
            expect(mockAuthService.refreshTokens).toHaveBeenCalledWith(data);
            expect(response).toStrictEqual(mockAuthTokens);
        });
    });
});
