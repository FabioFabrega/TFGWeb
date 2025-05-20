import { IsNumber, IsString, IsDate, IsDecimal, IsEnum, IsNotEmpty } from 'class-validator';
import { MetodoPago } from '../entities/pago.entity';

export class CreatePagoDto {
  @IsNumber()
  id_pedido: number;

  @IsString()
  estado: string;

  @IsDate()
  fecha_pago: Date;

  @IsEnum(MetodoPago, { message: 'El método de pago debe ser PayPal, Visa o Mastercard' })
  @IsNotEmpty()
  metodo_pago: MetodoPago;

  @IsDecimal()
  monto: number;
}