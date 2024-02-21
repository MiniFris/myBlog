import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ILike, In, QueryFailedError } from 'typeorm';
import { QueryFailedErrorCode } from 'src/database/enum/query-failed-error-code.enum';
import { AuthUserPayload } from 'src/auth/payload/auth-user.payload';

import { Article } from '../article.entity';
import { ArticleService } from '../article.service';
import { AUTHOR_ID_NOT_EXIST } from '../constant';


const mockArticle = {
    name: 'name',
    description: 'description',
};

const mockArticleResponse = {
    id: 1,
    authorId: 1,
    createdAt: new Date,
    updatedAt: new Date,
    ...mockArticle,
};

const mockArticlePaginationResponse = {
    totalCount: 1,
    items: [mockArticleResponse],
};

const mockArticleRepository = {
    save: jest.fn(payload => {
        if(payload.authorId && payload.authorId !== mockArticleResponse.authorId) throw new QueryFailedError('moke query', [], { code: QueryFailedErrorCode.FOREIGN_KEY_CONSTRAINT, message: '', name: '' });
        return mockArticleResponse;
    }),
    find: jest.fn(() => [mockArticleResponse]),
    delete: jest.fn(),
    findOne: jest.fn(() => mockArticleResponse),
    findAndCount: jest.fn(() => [[mockArticleResponse], 1]),
    findOneByOrFail: jest.fn(() => mockArticleResponse),
};


const mockCacheManager = {
    del: jest.fn(),
};


const mockCacheManagerFactory = jest.fn(() => mockCacheManager);
const mockArticleRepositoryFactory = jest.fn(() => mockArticleRepository);


describe('ArticleService', () => {
    let service: ArticleService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ArticleService,
                {
                    provide: getRepositoryToken(Article),
                    useFactory: mockArticleRepositoryFactory,
                },
                {
                    provide: CACHE_MANAGER,
                    useFactory: mockCacheManagerFactory,
                },
            ],
        }).compile();

        service = module.get<ArticleService>(ArticleService);
    });


    describe('create', () => {
        it('should create article', async () => {
            const data = { ...mockArticle, authorId: mockArticleResponse.authorId };
            const response = await service.create(data);
            expect(mockArticleRepository.save).toHaveBeenCalledWith(data);
            expect(mockCacheManager.del).toHaveBeenCalled();
            expect(response).toStrictEqual(mockArticleResponse);
        });

        it('should throw bad request exception: Author id does not exist', async () => {
            let error: BadRequestException;
            try {
                await service.create({ ...mockArticle, authorId: 2 });
            } catch(e) { error = e }
            expect(mockCacheManager.del).toHaveBeenCalled();
            expect(mockArticleRepository.save).toHaveBeenCalled();
            expect(error).toBeInstanceOf(BadRequestException);
            expect(error.message).toBe(AUTHOR_ID_NOT_EXIST());
        });
    });

    describe('update', () => {
        it('should update article', async () => {
            const response = await service.update(mockArticleResponse.id, mockArticle, { id: mockArticleResponse.authorId } as AuthUserPayload);
            expect(mockCacheManager.del).toHaveBeenCalled();
            expect(mockArticleRepository.findOneByOrFail).toHaveBeenCalledWith({ id: mockArticleResponse.id });
            expect(mockArticleRepository.save).toHaveBeenCalledWith({ ...mockArticle, id: mockArticleResponse.id });
            expect(response).toStrictEqual(mockArticleResponse);
        });

        it('should throw forbidden exception. When try update not your article', async () => {
            let error: BadRequestException;
            try {
                await service.update(mockArticleResponse.id, mockArticle, { id: 2 } as AuthUserPayload);
            } catch(e) { error = e }
            expect(mockArticleRepository.findOneByOrFail).toHaveBeenCalled();
            expect(error).toBeInstanceOf(ForbiddenException);
        });
    });

    describe('delete', () => {
        it('should delete article', async () => {
            await service.delete(mockArticleResponse.id);
            expect(mockCacheManager.del).toHaveBeenCalled();
            expect(mockArticleRepository.delete).toHaveBeenCalledWith(mockArticleResponse.id);
        });
    });

    describe('findAll', () => {
        it('should find all articles', async () => {
            const response = await service.findAll();
            expect(mockArticleRepository.find).toHaveBeenCalled();
            expect(response).toStrictEqual([mockArticleResponse]);
        });
    });

    describe('findById', () => {
        it('should find article by id', async () => {
            const response = await service.findById(mockArticleResponse.id);
            expect(mockArticleRepository.findOne).toHaveBeenCalledWith({ where: { id: mockArticleResponse.id } });
            expect(response).toStrictEqual(mockArticleResponse);
        });
    });

    describe('getAllAndPagination', () => {
        it('should get all articles and return with pagination', async () => {
            const data = { offset: 0, limit: 10 };
            const response = await service.getAllAndPagination(data);
            expect(mockArticleRepository.findAndCount).toHaveBeenCalledWith({ skip: data.offset, take: data.limit });
            expect(response).toStrictEqual(mockArticlePaginationResponse);
        });
    });

    describe('search', () => {
        it('should find all articles by query and return with pagination', async () => {
            const data = { offset: 0, limit: 10, query: 'name', authorIds: [1] };
            const response = await service.search(data);
            expect(mockArticleRepository.findAndCount).toHaveBeenCalledWith({ where: {
                name: ILike(data.query),
                description: ILike(data.query),
                authorId: In(data.authorIds),
            }, skip: data.offset, take: data.limit });
            expect(response).toStrictEqual(mockArticlePaginationResponse);
        });
    });
});
