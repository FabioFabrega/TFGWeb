import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pago } from './entities/pago.entity';
import { PedidoService } from '../pedidos/pedidos.service';
import { MetodoPago } from './entities/pago.entity';

@Injectable()
export class PagoService {
  constructor(
    @InjectRepository(Pago)
    private pagoRepository: Repository<Pago>,
    private pedidoService: PedidoService,
  ) {}

  async crearPago(idPedido: number, monto: number, metodoPago: MetodoPago): Promise<Pago> {
    const pedido = await this.pedidoService.obtenerPedido(idPedido);

    if (!pedido) {
      throw new NotFoundException(`Pedido con ID ${idPedido} no encontrado`);
    }

    if (monto !== pedido.total) {
      throw new BadRequestException('El monto del pago no coincide con el total del pedido');
    }

    const pago = this.pagoRepository.create({
      pedido: pedido,
      fecha_pago: new Date(),
      monto: monto,
      estado: 'aprobado',
      metodo_pago: metodoPago,
    });

    await this.pedidoService.actualizarEstadoPedido(idPedido, 'pagado');

    return this.pagoRepository.save(pago);
  }

  async actualizarEstadoPago(idPago: number, estado: string): Promise<Pago> {
    const pago = await this.pagoRepository.findOneBy({ id_pago: idPago });
    if (!pago) {
      throw new NotFoundException(`Pago con ID ${idPago} no encontrado`);
    }
    pago.estado = estado;
    return this.pagoRepository.save(pago);
  }
}