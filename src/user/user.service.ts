import { BadRequestException, Injectable } from '@nestjs/common';
import { FindManyOptions, QueryFailedError, Repository } from 'typeorm';
import { randomBytes, scryptSync } from 'crypto';
import { QueryFailedErrorCode } from 'src/database/enum/query-failed-error-code.enum';
import { InjectRepository } from '@nestjs/typeorm';

import { USER_WITH_EMAIL_EXISTS } from './constant';
import { User } from './user.entity';
import { CreateUserPayload } from './payload/create-user.payload';
import { UpdateUserPayload } from './payload/update-user.payload';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private readonly repository: Repository<User>,
    ) {}


    //CUD
    public async create(payload: CreateUserPayload): Promise<User> {
        try {
            return await this.repository.save({
                ...payload,
                password: this.encryptPassword(payload.password),
            });
        } catch(e) {
            if(e instanceof QueryFailedError && +e.driverError.code === QueryFailedErrorCode.UNIQUE_CONSTRAINT) {
                throw new BadRequestException(USER_WITH_EMAIL_EXISTS(payload.email));
            }
            throw e;
        }
    }

    public async update(id: number, payload: UpdateUserPayload): Promise<User> {
        try {
            await this.repository.findOneByOrFail({ id });
            return await this.repository.save({
                ...payload,
                ...(payload.password ? { password: this.encryptPassword(payload.password) } : {} ),
                id,
            });
        } catch(e) {
            if(e instanceof QueryFailedError && +e.driverError.code === QueryFailedErrorCode.UNIQUE_CONSTRAINT) {
                throw new BadRequestException(USER_WITH_EMAIL_EXISTS(payload.email));
            }
            throw e;
        }
    }

    public async updateRefreshToken(id: number, refreshToken: string): Promise<User> {
        await this.repository.findOneByOrFail({ id });
        return this.repository.save({ id, refreshToken });
    }

    public async delete(id: number) {
        await this.repository.delete(id);
    }


    //Find
    public async findAll(options?: FindManyOptions<User>): Promise<User[]> {
        return this.repository.find(options);
    }

    public async findById(id: number, options?: FindManyOptions<User>): Promise<User | null> {
        return this.repository.findOne({ ...options, where: { id } });
    }

    public async findByEmail(email: string, options?: FindManyOptions<User>): Promise<User | null> {
        return this.repository.findOne({ ...options, where: { email } });
    }


    //Methods
    private encryptPassword(password: string): string {
        const salt = randomBytes(16);
        const passwordHash = scryptSync(password, salt, 64).toString('hex');
        return `${passwordHash}:${salt.toString('hex')}`;
    }
}