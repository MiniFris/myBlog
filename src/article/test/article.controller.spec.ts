import { Test, TestingModule } from '@nestjs/testing';
import { AuthUserPayload } from 'src/auth/payload/auth-user.payload';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

import { ArticleService } from '../article.service';
import { ArticleController } from '../article.controller';


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

const mockArticleService = {
    search: jest.fn(() => mockArticlePaginationResponse),
    create: jest.fn(() => mockArticleResponse),
    update: jest.fn(() => mockArticleResponse),
    delete: jest.fn(),
    findById: jest.fn(() => mockArticleResponse),
    getAllAndPagination: jest.fn(() => mockArticlePaginationResponse),
};


const mockCacheManager = {
    get: () => jest.fn(() => 'any value'),
    set: () => jest.fn(),
};


const mockCacheManagerFactory = jest.fn(() => mockCacheManager);
const mockArticleServiceFactory = jest.fn(() => mockArticleService);
const mockAuthUser = { id: mockArticleResponse.authorId } as AuthUserPayload;

describe('ArticleController', () => {
    let controller: ArticleController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: ArticleService,
                    useFactory: mockArticleServiceFactory,
                },
                {
                    provide: CACHE_MANAGER,
                    useValue: mockCacheManagerFactory,
                },
            ],
            controllers: [
                ArticleController,
            ]
        }).compile();

        controller = module.get<ArticleController>(ArticleController);
    });


    describe('findAll', () => {
        it('should get all articles and return with pagination', async () => {
            const data = { offset: 0, limit: 10 };
            const response = await controller.findAll(data);
            expect(mockArticleService.getAllAndPagination).toHaveBeenCalledWith(data);
            expect(response).toStrictEqual(mockArticlePaginationResponse);
        });
    });

    describe('search', () => {
        it('should find all articles by query and return with pagination', async () => {
            const paginationData = { offset: 0, limit: 10 };
            const searchData = { query: 'name', authorIds: [1] };
            const response = await controller.search(paginationData, searchData);
            expect(mockArticleService.search).toHaveBeenCalledWith({ ...paginationData, ...searchData });
            expect(response).toStrictEqual(mockArticlePaginationResponse);
        });
    });

    describe('findOne', () => {
        it('should find article by id', async () => {
            const response = await controller.findOne(mockArticleResponse.id);
            expect(mockArticleService.findById).toHaveBeenCalledWith(mockArticleResponse.id);
            expect(response).toStrictEqual(mockArticleResponse);
        });
    });

    describe('create', () => {
        it('should create article', async () => {
            const response = await controller.create(mockAuthUser, mockArticle);
            expect(mockArticleService.create).toHaveBeenCalledWith({ ...mockArticle, authorId: mockAuthUser.id });
            expect(response).toStrictEqual(mockArticleResponse);
        });
    });

    describe('update', () => {
        it('should update article', async () => {
            const response = await controller.update(mockAuthUser, mockArticleResponse.id, mockArticle);
            expect(mockArticleService.update).toHaveBeenCalledWith(mockArticleResponse.id, mockArticle, mockAuthUser);
            expect(response).toStrictEqual(mockArticleResponse);
        });
    });

    describe('delete', () => {
        it('should delete article', async () => {
            await controller.delete(mockArticleResponse.id);
            expect(mockArticleService.delete).toHaveBeenCalledWith(mockArticleResponse.id);
        });
    });
});
