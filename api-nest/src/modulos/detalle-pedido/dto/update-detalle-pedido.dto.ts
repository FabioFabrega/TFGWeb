import { IsNumber, IsDecimal, IsOptional } from 'class-validator';

export class UpdateDetallePedidoDto {
  @IsOptional()
  @IsNumber()
  id_pedido?: number;

  @IsOptional()
  @IsNumber()
  id_producto?: number;

  @IsOptional()
  @IsNumber()
  cantidad?: number;

  @IsOptional()
  @IsDecimal()
  precio_unitario?: number;

  @IsOptional()
  @IsDecimal()
  subtotal?: number;
}