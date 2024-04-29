import { extractToken } from '@/domain/core';
import { ValidateUserToken } from '@/domain/users';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private readonly validateUserToken: ValidateUserToken) {}

  canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const header = request.headers.authorization;

    if (!header) return Promise.resolve(false);

    const token = extractToken(header);

    return this.validateUserToken.execute(token);
  }
}
