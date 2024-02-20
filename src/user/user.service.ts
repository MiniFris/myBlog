import { Inject, Injectable } from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
import { randomBytes, scryptSync } from 'crypto';

import { USER_REPOSITORY } from './constant';
import { User } from './user.entity';
import { CreateUserPayload } from './payload/create-user.payload';
import { UpdateUserPayload } from './payload/update-user.payload';

@Injectable()
export class UserService {

    constructor(
        @Inject(USER_REPOSITORY)
        private readonly repository: Repository<User>,
    ) {}


    //CUD
    public async create(payload: CreateUserPayload): Promise<User> {
        return this.repository.create({
            ...payload,
            password: this.encryptPassword(payload.password),
        });
    }

    public async update(id: number, payload: UpdateUserPayload): Promise<User> {
        await this.repository.update(id, {
            ...payload,
            ...(payload.password ? { password: this.encryptPassword(payload.password) } : {} ),
        });
        return this.findById(id);
    }

    public async delete(id: number) {
        await this.repository.delete(id);
    }


    //Find
    public async findAll(options?: FindManyOptions<User>): Promise<User[]> {
        return this.repository.find(options);
    }

    public async findById(id: number, options?: FindManyOptions<User>): Promise<User> {
        return this.repository.findOne({ ...options, where: { id } });
    }


    //Methods
    private encryptPassword(password: string): string {
        const salt = randomBytes(16);
        const passwordHash = scryptSync(password, salt, 64).toString('hex');
        return `${passwordHash}:${salt.toString('hex')}`;
    }
}