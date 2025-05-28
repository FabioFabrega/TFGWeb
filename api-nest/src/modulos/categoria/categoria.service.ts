import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from './entities/categoria.entity';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Injectable()
export class CategoriaService {
  constructor(
    @InjectRepository(Categoria)
    private categoriaRepository: Repository<Categoria>,
  ) {}

  async create(createCategoriaDto: CreateCategoriaDto, userRole: string): Promise<Categoria> {
    if (userRole !== 'admin') {
      throw new ForbiddenException('No tienes permisos para crear categorías');
    }
    const categoria = this.categoriaRepository.create(createCategoriaDto);
    return this.categoriaRepository.save(categoria);
  }

  async findAll(): Promise<Categoria[]> {
    return this.categoriaRepository.find();
  }

  async findOne(id: number): Promise<Categoria> {
    const categoria = await this.categoriaRepository.findOne({
      where: { id_categoria: id },
      relations: ['productos'], // Cargar la relación de productos
    });

    if (!categoria) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }

    return categoria;
  }

  async update(id: number, updateCategoriaDto: UpdateCategoriaDto, userRole: string): Promise<Categoria> {
    if (userRole !== 'admin') {
      throw new ForbiddenException('No tienes permisos para actualizar categorías');
    }
    const categoria = await this.findOne(id);
    this.categoriaRepository.merge(categoria, updateCategoriaDto);
    return this.categoriaRepository.save(categoria);
  }

  async remove(id: number, userRole: string): Promise<void> {
    if (userRole !== 'admin') {
      throw new ForbiddenException('No tienes permisos para eliminar categorías');
    }
    const categoria = await this.findOne(id);
    await this.categoriaRepository.remove(categoria);
  }
}