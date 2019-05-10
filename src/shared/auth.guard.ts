import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus, Catch} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.headers.authorization) {
        return false;
    }
    this.validateToken(request.headers.authorization);
    return true;
  }
  async validateToken(auth: string) {
    if (auth.split('')[0] !== 'Bearer') {// bearer token
        throw new HttpException('Invalid token', HttpStatus.FORBIDDEN);
    }
  }
}
