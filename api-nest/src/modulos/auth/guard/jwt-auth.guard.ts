import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    console.log('Request en JwtAuthGuard:', request.headers.authorization);
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      console.error('Error o usuario no autenticado:', err, user);
      throw err || new UnauthorizedException('Error o usuario no autenticado');
    }

    console.log('Usuario autenticado:', user); // Depuración

    if (user.rol !== 'admin') {
      console.error('Solo los administradores pueden crear productos:', user.rol); // Depuración
      throw new UnauthorizedException('Solo los administradores pueden realizar esta operación');
    }

    return user;
  }
}