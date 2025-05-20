import { IsNumber, IsDate, IsString, IsDecimal, IsOptional } from 'class-validator';

export class UpdatePedidoDto {
  @IsOptional()
  @IsNumber()
  id_usuario?: number;

  @IsOptional()
  @IsDate()
  fecha_pedido?: Date;

  @IsOptional()
  @IsString()
  estado?: string;

  @IsOptional()
  @IsDecimal()
  total?: number;
}