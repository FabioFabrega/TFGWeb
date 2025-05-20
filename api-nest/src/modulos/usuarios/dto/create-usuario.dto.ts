import { IsString, IsEmail , MinLength } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  nombre: string;

  @IsString()
  apellido: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string; // Considera encriptarla

  @IsString()
  direccion: string;

  @IsString()
  telefono: string;

  @IsString()
  rol: string;
}