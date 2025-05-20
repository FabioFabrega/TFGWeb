import { IsNumber, IsDecimal } from 'class-validator';

export class CreateDetallePedidoDto {
  @IsNumber()
  id_pedido: number;

  @IsNumber()
  id_producto: number;

  @IsNumber()
  cantidad: number;

  @IsDecimal()
  precio_unitario: number;

  @IsDecimal()
  subtotal: number;
}