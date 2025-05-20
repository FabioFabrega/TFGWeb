import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { CarritoService } from './carrito.service';
import { CreateCarritoDto } from './dto/create-carrito.dto';
import { UpdateCarritoDto } from './dto/update-carrito.dto';

@Controller('carritos')
export class CarritoController {
  constructor(private readonly carritoService: CarritoService) {}

  @Post()
  create(@Body() createCarritoDto: CreateCarritoDto) {
    return this.carritoService.create(createCarritoDto);
  }

  @Get()
  findAll() {
    return this.carritoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carritoService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCarritoDto: UpdateCarritoDto) {
    return this.carritoService.update(+id, updateCarritoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.carritoService.remove(+id);
  }

  @Post(':id/productos/:idProducto')
  agregarProducto(
    @Param('id') idCarrito: string,
    @Param('idProducto') idProducto: string,
    @Body('cantidad') cantidad: number,
  ) {
    return this.carritoService.agregarProducto(+idCarrito, +idProducto, cantidad);
  }

  @Delete(':id/productos/:idProducto')
  eliminarProducto(@Param('id') idCarrito: string, @Param('idProducto') idProducto: string) {
    return this.carritoService.eliminarProducto(+idCarrito, +idProducto);
  }

  @Get(':id/productos')
  listarProductos(@Param('id') idCarrito: string) {
    return this.carritoService.listarProductos(+idCarrito);
  }

  @Put(':id/productos/:idProducto')
  actualizarCantidad(
    @Param('id') idCarrito: string,
    @Param('idProducto') idProducto: string,
    @Body('cantidad') cantidad: number,
  ) {
    return this.carritoService.actualizarCantidad(+idCarrito, +idProducto, cantidad);
  }
}