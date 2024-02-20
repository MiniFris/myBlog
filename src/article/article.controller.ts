import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TransformToHttpResponse } from 'src/common/http-response/decorator/transform-to-http-response.decorator';
import { PaginationResponse } from 'src/common/pagination/pagination.response';
import { AuthJWTGuard } from 'src/auth/decorator/auth-user-guard.decorator';
import { AuthUser } from 'src/auth/decorator/auth-user-param.decorator';
import { AuthUserPayload } from 'src/auth/payload/auth-user.payload';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';
import { CacheKey } from '@nestjs/cache-manager';
import { CacheResponse } from 'src/cache-manager/decorator/cache-response.decorator';

import { ArticleResponse } from './response/article.response';
import { ArticleService } from './article.service';
import { Article } from './article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleSearchDto } from './dto/article-search.dto';
import { ArticleCacheKeysEnum } from './enum/article-cache-keys.enum';

@ApiTags('Статьи')
@Controller('articles')
export class ArticleController {

    constructor(
        private readonly service: ArticleService,
    ) {}

    // Read
    @ApiOperation({ summary: 'Получить список статей с пагинацией' })
    @ApiOkResponse({ type: PaginationResponse.createResponse(ArticleResponse) })
    @TransformToHttpResponse(PaginationResponse.createResponse(ArticleResponse))
    @CacheResponse(ArticleCacheKeysEnum.FIND_ALL)
    @Get()
    async findAll(@Query() paginationParams: PaginationDto): Promise<PaginationResponse<Article>> {
        return this.service.getAllAndPagination(paginationParams);
    }

    @ApiOperation({ summary: 'Найти список статей по поисковому запросу с пагинацией' })
    @ApiOkResponse({ type: PaginationResponse.createResponse(ArticleResponse) })
    @TransformToHttpResponse(PaginationResponse.createResponse(ArticleResponse))
    @CacheKey(ArticleCacheKeysEnum.SEARCH)
    @Get('/search')
    async search(
        @Query() paginationParams: PaginationDto,
        @Query() searchParams: ArticleSearchDto,
    ): Promise<PaginationResponse<Article>> {
        return this.service.search({ ...paginationParams, ...searchParams });
    }

    @ApiOperation({ summary: 'Получить статью по ID' })
    @ApiOkResponse({ type: ArticleResponse })
    @TransformToHttpResponse(ArticleResponse)
    @CacheKey(ArticleCacheKeysEnum.FIND_ONE)
    @Get(':id(\\d+)')
    async findOne(@Param('id') id: number): Promise<Article> {
        return this.service.findById(id);
    }

    // CUD
    @ApiOperation({ summary: 'Создать статью' })
    @ApiOkResponse({ type: ArticleResponse })
    @TransformToHttpResponse(ArticleResponse)
    @AuthJWTGuard()
    @Post()
    async create(
        @AuthUser() user: AuthUserPayload,
        @Body() payload: CreateArticleDto,
    ): Promise<Article> {
        return this.service.create({ ...payload, authorId: user.id });
    }

    @ApiOperation({ summary: 'Изменить статью по ID' })
    @ApiOkResponse({ type: ArticleResponse })
    @TransformToHttpResponse(ArticleResponse)
    @AuthJWTGuard()
    @Put(':id(\\d+)')
    async update(
        @Param('id') id: number,
        @Body() payload: UpdateArticleDto,
    ): Promise<Article> {
        return this.service.update(id, payload);
    }

    @ApiOperation({ summary: 'Удалить статью по ID' })
    @ApiNoContentResponse()
    @HttpCode(HttpStatus.NO_CONTENT)
    @AuthJWTGuard()
    @Delete(':id(\\d+)')
    async remove(@Param('id') id: number) {
        await this.service.delete(id);
    }
}
