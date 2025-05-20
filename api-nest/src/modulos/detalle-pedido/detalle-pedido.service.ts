import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DetallePedido } from './entities/detalle-pedido.entity';
import { CreateDetallePedidoDto } from './dto/create-detalle-pedido.dto';
import { UpdateDetallePedidoDto } from './dto/update-detalle-pedido.dto';

@Injectable()
export class DetallePedidoService {
  constructor(
    @InjectRepository(DetallePedido)
    private detallePedidoRepository: Repository<DetallePedido>,
  ) {}

  async create(createDetallePedidoDto: CreateDetallePedidoDto): Promise<DetallePedido> {
    const detallePedido = this.detallePedidoRepository.create(createDetallePedidoDto);
    return this.detallePedidoRepository.save(detallePedido);
  }

  async findAll(): Promise<DetallePedido[]> {
    return this.detallePedidoRepository.find();
  }

  async findOne(id: number): Promise<DetallePedido> {
    const detallePedido = await this.detallePedidoRepository.findOneBy({ id_detalle: id });
    if (!detallePedido) {
      throw new NotFoundException(`Detalle de Pedido con ID ${id} no encontrado`);
    }
    return detallePedido;
  }

  async update(id: number, updateDetallePedidoDto: UpdateDetallePedidoDto): Promise<DetallePedido> {
    const detallePedido = await this.findOne(id);
    this.detallePedidoRepository.merge(detallePedido, updateDetallePedidoDto);
    return this.detallePedidoRepository.save(detallePedido);
  }

  async remove(id: number): Promise<void> {
    const detallePedido = await this.findOne(id);
    await this.detallePedidoRepository.remove(detallePedido);
  }
}