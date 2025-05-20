import { Controller, Get, Post, Body, Put, Param, Delete, Headers, UnauthorizedException } from '@nestjs/common';
import { PedidoService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';

@Controller('pedidos')
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) {}

  @Post()
  create(@Body() createPedidoDto: CreatePedidoDto) {
    return this.pedidoService.create(createPedidoDto);
  }

  @Get()
  findAll() {
    return this.pedidoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pedidoService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePedidoDto: UpdatePedidoDto) {
    return this.pedidoService.update(+id, updatePedidoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pedidoService.remove(+id);
  }

  @Post(':idUsuario/carritos/:idCarrito')
  crearPedido(
    @Param('idUsuario') idUsuario: string,
    @Param('idCarrito') idCarrito: string,
  ) {
    return this.pedidoService.crearPedido(+idUsuario, +idCarrito);
  }

  @Get('usuarios/:idUsuario')
  listarPedidosUsuario(@Param('idUsuario') idUsuario: string) {
    return this.pedidoService.listarPedidosUsuario(+idUsuario);
  }

  @Get(':id/detalles')
  obtenerPedido(@Param('id') idPedido: string) {
    return this.pedidoService.obtenerPedido(+idPedido);
  }

  @Put(':id/estado')
  actualizarEstadoPedido(
    @Param('id') idPedido: string,
    @Body('estado') estado: string,
    @Headers('user-role') userRole: string, // Obtener el rol del usuario
  ) {
    if (userRole !== 'admin') {
      throw new UnauthorizedException('Solo los administradores pueden actualizar el estado del pedido');
    }
    return this.pedidoService.actualizarEstadoPedido(+idPedido, estado);
  }
}