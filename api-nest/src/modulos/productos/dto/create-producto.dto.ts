import { IsString, IsNumber, IsDecimal,IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProductoDto {
  @IsString()
  nombre: string;

  @IsString()
  descripcion: string;

  @IsDecimal()
  @IsNotEmpty()
  precio: number;

  @IsNumber()
  stock: number;

  @IsNumber()
  id_categoria: number;

  @IsString()
  @IsOptional()
  imagen?: string;

  @IsString()
  marca: string;

  @IsString()
  modelo: string;
}