import { Controller, Post, Body, Put, Param } from '@nestjs/common';
import { CarritoProductoService } from './carrito-producto.service';
import { CreateCarritoProductoDto } from './dto/create-carrito-producto.dto';
import { UpdateCarritoProductoDto } from './dto/update-carrito-producto.dto';

@Controller('carrito-productos')
export class CarritoProductoController {
  constructor(private readonly carritoProductoService: CarritoProductoService) {}

  @Post()
  create(@Body() createCarritoProductoDto: CreateCarritoProductoDto) {
    return this.carritoProductoService.create(createCarritoProductoDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCarritoProductoDto: UpdateCarritoProductoDto) {
    return this.carritoProductoService.update(+id, updateCarritoProductoDto);
  }
}