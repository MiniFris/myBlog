import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        return ctx.switchToHttp().getRequest().user;
    },
);