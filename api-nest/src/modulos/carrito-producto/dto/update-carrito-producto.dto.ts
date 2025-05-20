import { IsNumber, IsOptional } from 'class-validator';

export class UpdateCarritoProductoDto {
  @IsOptional()
  @IsNumber()
  cantidad: number;
}