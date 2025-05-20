import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarritoProducto } from './entities/carrito-producto.entity';
import { CreateCarritoProductoDto } from './dto/create-carrito-producto.dto';
import { UpdateCarritoProductoDto } from './dto/update-carrito-producto.dto';

@Injectable()
export class CarritoProductoService {
  constructor(
    @InjectRepository(CarritoProducto)
    private carritoProductoRepository: Repository<CarritoProducto>,
  ) {}

  async create(createCarritoProductoDto: CreateCarritoProductoDto): Promise<CarritoProducto> {
    const carritoProducto = this.carritoProductoRepository.create(createCarritoProductoDto);
    return this.carritoProductoRepository.save(carritoProducto);
  }

  async findByCarritoId(idCarrito: number): Promise<CarritoProducto[]> {
    return this.carritoProductoRepository.findBy({ carrito: { id_carrito: idCarrito } });
  }

  async findByCarritoIdAndProductoId(idCarrito: number, idProducto: number): Promise<CarritoProducto> {
    return this.carritoProductoRepository.findOneBy({
      carrito: { id_carrito: idCarrito },
      producto: { id_producto: idProducto },
    });
  }

  async update(id: number, updateCarritoProductoDto: UpdateCarritoProductoDto): Promise<CarritoProducto> {
    const carritoProducto = await this.carritoProductoRepository.findOneBy({ id: id });
    if (!carritoProducto) {
      throw new NotFoundException(`Relación CarritoProducto con ID ${id} no encontrada`);
    }
    this.carritoProductoRepository.merge(carritoProducto, updateCarritoProductoDto);
    return this.carritoProductoRepository.save(carritoProducto);
  }

  async remove(id: number): Promise<void> {
    const carritoProducto = await this.carritoProductoRepository.findOneBy({ id: id });
    if (!carritoProducto) {
      throw new NotFoundException(`Relación CarritoProducto con ID ${id} no encontrada`);
    }
    await this.carritoProductoRepository.remove(carritoProducto);
  }
}