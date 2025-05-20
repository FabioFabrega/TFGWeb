import { Controller, Post, Body, Put, Param, Headers, UnauthorizedException } from '@nestjs/common';
import { PagoService } from './pago.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';

@Controller('pagos')
export class PagoController {
  constructor(private readonly pagoService: PagoService) {}

  @Post()
  create(@Body() createPagoDto: CreatePagoDto) {
    return this.pagoService.crearPago(
      createPagoDto.id_pedido,
      createPagoDto.monto,
      createPagoDto.metodo_pago,
    );
  }

  @Put(':id')
  update(
    @Param('id') idPago: string,
    @Body() updatePagoDto: UpdatePagoDto,
    @Headers('user-role') userRole: string,
  ) {
    if (userRole !== 'admin') {
      throw new UnauthorizedException('Solo los administradores pueden actualizar el estado del pago');
    }
    return this.pagoService.actualizarEstadoPago(+idPago, updatePagoDto.estado);
  }
}