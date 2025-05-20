import { IsNumber, IsString, IsDate, IsDecimal, IsOptional, IsEnum, IsNotEmpty } from 'class-validator';
import { MetodoPago } from './../entities/pago.entity';

export class UpdatePagoDto {
  @IsOptional()
  @IsNumber()
  id_pedido?: number;

  @IsOptional()
  @IsEnum(MetodoPago, { message: 'El método de pago debe ser PayPal, Visa o Mastercard' })
  @IsNotEmpty()
  metodo_pago?: MetodoPago;

  @IsOptional()
  @IsString()
  estado?: string;

  @IsOptional()
  @IsDate()
  fecha_pago?: Date;

  @IsOptional()
  @IsDecimal()
  monto?: number;
}