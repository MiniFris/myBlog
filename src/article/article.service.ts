import { BadRequestException, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { FindManyOptions, ILike, In, LessThanOrEqual, MoreThanOrEqual, QueryFailedError, Repository } from 'typeorm';
import { QueryFailedErrorCode } from 'src/database/enum/query-failed-error-code.enum';
import { Pagination } from 'src/common/pagination/interface/pagination.interface';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthUserPayload } from 'src/auth/payload/auth-user.payload';

import { AUTHOR_ID_NOT_EXIST } from './constant';
import { Article } from './article.entity';
import { CreateArticlePayload } from './payload/create-article.payload';
import { UpdateArticlePayload } from './payload/update-article.payload';
import { PaginationOptions } from '../common/pagination/interface/pagination-options.interface';
import { ArticleSearchOptions } from './interface/article-search-options.interface';
import { ArticleCacheKeysEnum } from './enum/article-cache-keys.enum';


@Injectable()
export class ArticleService {

    constructor(
        @InjectRepository(Article)
        private readonly repository: Repository<Article>,
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache,
    ) {}


    //CUD
    public async create(payload: CreateArticlePayload): Promise<Article> {
        try {
            this.clearCache();
            return await this.repository.save(payload);
        } catch(e) {
            if(e instanceof QueryFailedError && +e.driverError.code === QueryFailedErrorCode.FOREIGN_KEY_CONSTRAINT) {
                throw new BadRequestException(AUTHOR_ID_NOT_EXIST());
            }
            throw e;
        }
    }

    public async update(id: number, payload: UpdateArticlePayload, user: AuthUserPayload): Promise<Article> {
        const entity = await this.repository.findOneByOrFail({ id });
        if(entity.authorId !== user.id) throw new ForbiddenException();

        this.clearCache();
        return this.repository.save({ ...payload, id });
    }

    public async delete(id: number) {
        await this.repository.delete(id);
        this.clearCache();
    }


    //Find
    public async findAll(options?: FindManyOptions<Article>): Promise<Article[]> {
        return this.repository.find(options);
    }

    public async findAndCount(options?: FindManyOptions<Article>): Promise<[Article[], number]> {
        return this.repository.findAndCount(options);
    }

    public async findById(id: number, options?: FindManyOptions<Article>): Promise<Article | null> {
        return this.repository.findOne({ ...options, where: { id } });
    }


    //Read
    public async getAllAndPagination({ offset, limit }: PaginationOptions = {}): Promise<Pagination<Article>> {
        const [ items, totalCount ] = await this.findAndCount({ skip: offset, take: limit });
        return {
            totalCount,
            items,
        };
    }

    public async search({ query, authorIds, start, end, offset, limit }: ArticleSearchOptions & PaginationOptions = {}): Promise<Pagination<Article>> {
        const [ items, totalCount ] = await this.findAndCount({ where: {
            ...(query ? { name: ILike(query), description: ILike(query) } : {}),
            ...(authorIds?.length ? { authorId: In(authorIds) } : {}),
            ...(start ? { createdAt: MoreThanOrEqual(start) } : {}),
            ...(end ? { createdAt: LessThanOrEqual(end) } : {}),
        }, skip: offset, take: limit });
        return {
            totalCount,
            items,
        };
    }


    //Methods
    private async clearCache() {
        const keys = Object.values(ArticleCacheKeysEnum);
        await Promise.all(keys.map(k => this.cacheManager.del(`${k}:*`)));
    }
}