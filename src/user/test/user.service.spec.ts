import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QueryFailedError } from 'typeorm';
import { QueryFailedErrorCode } from 'src/database/enum/query-failed-error-code.enum';
import { BadRequestException } from '@nestjs/common';

import { UserService } from '../user.service';
import { User } from '../user.entity';
import { USER_WITH_EMAIL_EXISTS } from '../constant';


const uniqueUserEmail = 'unique@mail.ru';
const mockUser = {
    firstName: 'FirstName',
    email: 'email@mail.ru',
    password: 'password',
};

const mockUserResponse = {
    id: 1,
    refreshToken: null,
    createdAt: new Date,
    updatedAt: new Date,
    ...mockUser,
};

const mockUserRepository = {
    save: jest.fn(payload => {
        if(payload.email === uniqueUserEmail) throw new QueryFailedError('moke query', [], { code: QueryFailedErrorCode.UNIQUE_CONSTRAINT, message: '', name: '' });
        return { ...mockUserResponse, ...payload };
    }),
    findOneByOrFail: jest.fn(() => mockUserResponse),
    delete: jest.fn(),
    find: jest.fn(() => [mockUserResponse]),
    findOne: jest.fn(() => mockUserResponse),
};


const mockUserRepositoryFactory = jest.fn(() => mockUserRepository);


describe('UserService', () => {
    let service: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(User),
                    useFactory: mockUserRepositoryFactory,
                },
            ],
        }).compile();

        service = module.get<UserService>(UserService);
    });


    describe('create', () => {
        it('should create user', async () => {
            const response = await service.create(mockUser);
            expect(mockUserRepository.save).toHaveBeenCalledWith({ ...mockUser, password: response.password });
            expect(typeof response.password).toBe('string');
            expect(response).toStrictEqual({ ...mockUserResponse, password: response.password });
        });

        it('should throw bad request exception: User with email already exists', async () => {
            let error: BadRequestException;
            try {
                await service.create({ ...mockUser, email: uniqueUserEmail });
            } catch(e) { error = e }
            expect(mockUserRepository.save).toHaveBeenCalled();
            expect(error).toBeInstanceOf(BadRequestException);
            expect(error.message).toBe(USER_WITH_EMAIL_EXISTS(uniqueUserEmail));
        });
    });

    describe('update', () => {
        it('should update user', async () => {
            const response = await service.update(mockUserResponse.id, mockUser);
            expect(mockUserRepository.findOneByOrFail).toHaveBeenCalledWith({ id: mockUserResponse.id });
            expect(mockUserRepository.save).toHaveBeenCalledWith({ ...mockUser, password: response.password, id: mockUserResponse.id });
            expect(typeof response.password).toBe('string');
            expect(response).toStrictEqual({ ...mockUserResponse, password: response.password });
        });

        it('should throw bad request exception: User with email already exists', async () => {
            let error: BadRequestException;
            try {
                await service.update(mockUserResponse.id, { ...mockUser, email: uniqueUserEmail });
            } catch(e) { error = e }
            expect(mockUserRepository.save).toHaveBeenCalled();
            expect(error).toBeInstanceOf(BadRequestException);
            expect(error.message).toBe(USER_WITH_EMAIL_EXISTS(uniqueUserEmail));
        });
    });

    describe('updateRefreshToken', () => {
        it('should update user refresh token', async () => {
            const refreshToken = 'refreshToken';
            const response = await service.updateRefreshToken(mockUserResponse.id, refreshToken);
            expect(mockUserRepository.findOneByOrFail).toHaveBeenCalledWith({ id: mockUserResponse.id });
            expect(mockUserRepository.save).toHaveBeenCalledWith({ refreshToken, id: mockUserResponse.id });
            expect(response.refreshToken).toBe(refreshToken);
        });
    });

    describe('delete', () => {
        it('should delete user', async () => {
            await service.delete(mockUserResponse.id);
            expect(mockUserRepository.delete).toHaveBeenCalledWith(mockUserResponse.id);
        });
    });

    describe('findAll', () => {
        it('should find all users', async () => {
            const response = await service.findAll();
            expect(mockUserRepository.find).toHaveBeenCalled();
            expect(response).toStrictEqual([mockUserResponse]);
        });
    });

    describe('findById', () => {
        it('should find user by id', async () => {
            const response = await service.findById(mockUserResponse.id);
            expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: mockUserResponse.id } });
            expect(response).toStrictEqual(mockUserResponse);
        });
    });

    describe('findByEmail', () => {
        it('should find user by email', async () => {
            const response = await service.findByEmail(mockUserResponse.email);
            expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { email: mockUserResponse.email } });
            expect(response).toStrictEqual(mockUserResponse);
        });
    });
});
