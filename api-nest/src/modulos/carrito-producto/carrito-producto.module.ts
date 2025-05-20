import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarritoProducto } from './entities/carrito-producto.entity';
import { CarritoProductoController } from './carrito-producto.controller';
import { CarritoProductoService } from './carrito-producto.service';

@Module({
  imports: [TypeOrmModule.forFeature([CarritoProducto])], // Importar la entidad CarritoProducto
  controllers: [CarritoProductoController],
  providers: [CarritoProductoService],
  exports: [TypeOrmModule.forFeature([CarritoProducto])], // Exportar el repositorio de CarritoProducto
})
export class CarritoProductoModule {}