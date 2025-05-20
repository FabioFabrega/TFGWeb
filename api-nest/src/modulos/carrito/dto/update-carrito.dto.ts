import { IsNumber, IsDate, IsString, IsOptional } from 'class-validator';

export class UpdateCarritoDto {
  @IsOptional()
  @IsNumber()
  id_usuario?: number;

  @IsOptional()
  @IsDate()
  fecha_creacion?: Date;

  @IsOptional()
  @IsString()
  estado?: string;
}