import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log('Usuario en RolesGuard:', user);

    if (!user || user.rol !== "admin") {
      throw new UnauthorizedException('Rol no autorizado');
    }
    return true;
  }
}
