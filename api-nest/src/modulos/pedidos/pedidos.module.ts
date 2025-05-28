// src/modulos/pedidos/pedidos.module.ts
// src/modulos/pedidos/pedidos.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PedidoService } from './pedidos.service';
import { PedidoController } from './pedidos.controller';
import { Pedido } from './entities/pedidos.entity';
import { DetallePedido } from '../detalle-pedido/entities/detalle-pedido.entity'; // Importa DetallePedido
import { CarritoModule } from '../carrito/carrito.module';
import { ProductoModule } from '../productos/productos.module';
import { UsuarioModule } from '../usuarios/usuarios.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pedido, DetallePedido]), // Agrega DetallePedido aquí
    CarritoModule,
    ProductoModule,
    UsuarioModule,
  ],
  controllers: [PedidoController],
  providers: [PedidoService],
  exports: [PedidoService],
})
export class PedidoModule {}