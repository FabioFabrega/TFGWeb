import { IsDateString, IsString, IsNumber } from 'class-validator';

export class CreatePedidoDto {
  @IsNumber()
  id_usuario: number;

  @IsDateString()
  fecha_creacion: Date;

  @IsString()
  estado: string;

  @IsNumber()
  total: number;
  
}