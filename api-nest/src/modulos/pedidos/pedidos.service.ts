import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pedido } from './entities/pedidos.entity';
import { DetallePedido } from '../detalle-pedido/entities/detalle-pedido.entity';
import { CarritoService } from '../carrito/carrito.service';
import { ProductoService } from '../productos/productos.service';
import { UsuarioService } from '../usuarios/usuarios.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { CarritoProducto } from '../carrito-producto/entities/carrito-producto.entity';

@Injectable()
export class PedidoService {
  constructor(
    @InjectRepository(Pedido)
    private pedidoRepository: Repository<Pedido>,
    @InjectRepository(DetallePedido)
    private detallePedidoRepository: Repository<DetallePedido>,
    private carritoService: CarritoService,
    private productoService: ProductoService,
    private usuarioService: UsuarioService,
  ) {}

  async create(createPedidoDto: CreatePedidoDto): Promise<Pedido> {
    const pedido = this.pedidoRepository.create(createPedidoDto);
    return this.pedidoRepository.save(pedido);
  }

  async findAll(): Promise<Pedido[]> {
    return this.pedidoRepository.find();
  }

  async findOne(id: number): Promise<Pedido> {
    const pedido = await this.pedidoRepository.findOneBy({ id_pedido: id });
    if (!pedido) {
      throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
    }
    return pedido;
  }

  async update(id: number, updatePedidoDto: UpdatePedidoDto): Promise<Pedido> {
    const pedido = await this.findOne(id);
    this.pedidoRepository.merge(pedido, updatePedidoDto);
    return this.pedidoRepository.save(pedido);
  }

  async remove(id: number): Promise<void> {
    const pedido = await this.findOne(id);
    await this.pedidoRepository.remove(pedido);
  }

  async crearPedido(idUsuario: number, idCarrito: number): Promise<Pedido> {
    const usuario = await this.usuarioService.findOne(idUsuario);
    const carrito = await this.carritoService.findOne(idCarrito);

    if (!carrito.carritoProductos || carrito.carritoProductos.length === 0) {
      throw new BadRequestException('El carrito está vacío');
    }

    let totalPedido = 0;
    const detallesPedido: DetallePedido[] = [];

    for (const cp of carrito.carritoProductos) {
      const producto = await this.productoService.findOne(cp.producto.id_producto);
      const subtotal = producto.precio * cp.cantidad;
      totalPedido += subtotal;

      const detallePedido = this.detallePedidoRepository.create({
        pedido: null,
        producto: producto,
        cantidad: cp.cantidad,
        precio_unitario: producto.precio,
        subtotal: subtotal,
      });

      detallesPedido.push(detallePedido);
    }

    const pedido = this.pedidoRepository.create({
      usuario: usuario,
      fecha_pedido: new Date(),
      estado: 'pendiente',
      total: totalPedido,
    });

    const pedidoGuardado = await this.pedidoRepository.save(pedido);

    for (const dp of detallesPedido) {
      dp.pedido = pedidoGuardado;
      await this.detallePedidoRepository.save(dp);
    }

    // Vaciar el carrito
    carrito.carritoProductos = [];
    await this.carritoService.update(idCarrito, carrito);

    return pedidoGuardado;
  }

  async listarPedidosUsuario(idUsuario: number): Promise<Pedido[]> {
    return this.pedidoRepository.find({ where: { usuario: { id_usuario: idUsuario } } });
  }

  async obtenerPedido(idPedido: number): Promise<Pedido> {
    return this.pedidoRepository.findOne({
      where: { id_pedido: idPedido },
      relations: ['detallesPedido'],
    });
  }

  async actualizarEstadoPedido(idPedido: number, estado: string): Promise<Pedido> {
    const pedido = await this.obtenerPedido(idPedido);
    if (!pedido) {
      throw new NotFoundException(`Pedido con ID ${idPedido} no encontrado`);
    }
    pedido.estado = estado;
    return this.pedidoRepository.save(pedido);
  }
}