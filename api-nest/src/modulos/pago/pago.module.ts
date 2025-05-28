// src/modulos/pago/pago.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagoService } from './pago.service';
import { PagoController } from './pago.controller';
import { Pago } from './entities/pago.entity';
import { PedidoModule } from '../pedidos/pedidos.module'; // Importa PedidoModule
import { DetallePedidoModule } from '../detalle-pedido/detalle-pedido.module';
import { CarritoModule } from '../carrito/carrito.module';
import { ProductoModule } from '../productos/productos.module';
import { UsuarioModule } from '../usuarios/usuarios.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pago]),
    PedidoModule, // Agrega PedidoModule aquí
    DetallePedidoModule,
    CarritoModule,
    ProductoModule,
    UsuarioModule
  ],
  controllers: [PagoController],
  providers: [PagoService],
  exports: [PagoService],
})
export class PagoModule {}