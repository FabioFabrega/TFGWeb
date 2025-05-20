import { IsNumber, IsDate, IsString } from 'class-validator';

export class CreateCarritoDto {
  @IsNumber()
  id_usuario: number;

  @IsDate()
  fecha_creacion: Date;

  @IsString()
  estado: string;
}