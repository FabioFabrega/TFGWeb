import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/productos.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { CategoriaService } from '../categoria/categoria.service';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
    private categoriaService: CategoriaService,
  ) {}

  async create(createProductoDto: CreateProductoDto, userRol: string): Promise<Producto> {
    if (userRol !== 'admin') {
      throw new UnauthorizedException('Solo los administradores pueden crear productos');
    }

    const categoria = await this.categoriaService.findOne(createProductoDto.id_categoria);
    if (!categoria) {
      throw new NotFoundException(`Categoría con ID ${createProductoDto.id_categoria} no encontrada`);
    }

    const producto = this.productoRepository.create(createProductoDto);
    producto.categoria = categoria;
    return this.productoRepository.save(producto);
  }

  async findAll(): Promise<Producto[]> {
    return this.productoRepository.find();
  }

  async findOne(id: number): Promise<Producto> {
    const producto = await this.productoRepository.findOneBy({ id_producto: id });
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return producto;
  }

  async update(
    id: number,
    updateProductoDto: UpdateProductoDto,
    userRole: string,
  ): Promise<Producto> {
    if (userRole !== 'admin') {
      throw new UnauthorizedException('Solo los administradores pueden actualizar productos');
    }

    const producto = await this.findOne(id);

    if (updateProductoDto.id_categoria) {
      const categoria = await this.categoriaService.findOne(updateProductoDto.id_categoria);
      if (!categoria) {
        throw new NotFoundException(`Categoría con ID ${updateProductoDto.id_categoria} no encontrada`);
      }
      producto.categoria = categoria;
    }

    this.productoRepository.merge(producto, updateProductoDto);
    return this.productoRepository.save(producto);
  }

  async remove(id: number, userRole: string): Promise<void> {
    if (userRole !== 'admin') {
      throw new UnauthorizedException('Solo los administradores pueden eliminar productos');
    }

    const producto = await this.findOne(id);
    await this.productoRepository.remove(producto);
  }
}