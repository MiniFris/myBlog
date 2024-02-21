import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { FindManyOptions, QueryFailedError, Repository } from 'typeorm';
import { QueryFailedErrorCode } from 'src/database/enum/query-failed-error-code.enum';
import { Pagination } from 'src/common/pagination/interface/pagination.interface';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

import { ARTICLE_REPOSITORY, AUTHOR_ID_NOT_EXIST } from './constant';
import { Article } from './article.entity';
import { CreateArticlePayload } from './payload/create-article.payload';
import { UpdateArticlePayload } from './payload/update-article.payload';
import { PaginationOptions } from '../common/pagination/interface/pagination-options.interface';
import { ArticleSearchOptions } from './interface/article-search-options.interface';
import { ArticleCacheKeysEnum } from './enum/article-cache-keys.enum';


@Injectable()
export class ArticleService {

    constructor(
        @Inject(ARTICLE_REPOSITORY)
        private readonly repository: Repository<Article>,
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache,
    ) {}


    //CUD
    public async create(payload: CreateArticlePayload): Promise<Article> {
        try {
            const model = await this.repository.save(payload);
            this.clearCache();
            return model;
        } catch(e) {
            if(e instanceof QueryFailedError && +e.driverError.code === QueryFailedErrorCode.FOREIGN_KEY_CONSTRAINT) {
                throw new BadRequestException(AUTHOR_ID_NOT_EXIST());
            }
            throw e;
        }
    }

    public async update(id: number, payload: UpdateArticlePayload): Promise<Article> {
        try {
            await this.repository.update(id, payload);
            this.clearCache();
            return this.findById(id);
        } catch(e) {
            if(e instanceof QueryFailedError && +e.driverError.code === QueryFailedErrorCode.FOREIGN_KEY_CONSTRAINT) {
                throw new BadRequestException(AUTHOR_ID_NOT_EXIST());
            }
            throw e;
        }
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
        const queryBuilder = this.repository.createQueryBuilder();

        query && queryBuilder.andWhere('(name ilike :query or description ilike :query)', { query: `%${query}%` });
        authorIds?.length && queryBuilder.andWhere('"authorId" in(:...authorIds)', { authorIds });
        start && queryBuilder.andWhere('"createdAt" >= :start', { start });
        end && queryBuilder.andWhere('"createdAt" <= :end', { end });

        const [ items, totalCount ] = await queryBuilder
            .skip(offset)
            .take(limit)
            .getManyAndCount();
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