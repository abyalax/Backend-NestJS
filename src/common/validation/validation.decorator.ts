import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';

interface RequestWithUser extends Request {
    user: User;
  }

export const Auth = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest<RequestWithUser>();
        return request.user
    }
)