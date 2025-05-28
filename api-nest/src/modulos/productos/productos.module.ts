// src/modulos/productos/productos.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoService } from './productos.service';
import { ProductoController } from './productos.controller';
import { Producto } from './entities/productos.entity';
import { CategoriaModule } from '../categoria/categoria.module'; // Importa CategoriaModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Producto]),
    CategoriaModule, // Importa CategoriaModule
  ],
  controllers: [ProductoController],
  providers: [ProductoService],
  exports: [ProductoService],
})
export class ProductoModule {}