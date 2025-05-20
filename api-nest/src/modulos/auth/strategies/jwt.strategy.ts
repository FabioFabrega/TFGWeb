import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from '../constans/constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extrae el token del header 'Authorization'
      ignoreExpiration: false, // No ignora la expiración del token
      secretOrKey: jwtConstants.secret, // Usa la clave secreta definida en las constantes
    });
  }

  async validate(payload: any) {
    // Verifica si el payload contiene el rol
    console.log('Payload recibido en validate:', payload);
    if (!payload.rol) {
      throw new UnauthorizedException('El token no contiene un rol válido');
    }

    // Retorna el objeto de usuario con los campos necesarios
    return {
      userId: payload.sub, // ID del usuario
      email: payload.email, // Email del usuario
      rol: payload.rol, // Rol del usuario
    };
  }
}