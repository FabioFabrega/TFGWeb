import { IsNumber } from 'class-validator';

export class CreateCarritoProductoDto {
  @IsNumber()
  id_carrito: number;

  @IsNumber()
  id_producto: number;

  @IsNumber()
  cantidad: number;
}