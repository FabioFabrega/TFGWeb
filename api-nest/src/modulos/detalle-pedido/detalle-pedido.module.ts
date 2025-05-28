import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetallePedido } from './entities/detalle-pedido.entity';
import { DetallePedidoController } from './detalle-pedido.controller';
import { DetallePedidoService } from './detalle-pedido.service';

@Module({
  imports: [TypeOrmModule.forFeature([DetallePedido],'base1')],
  controllers: [DetallePedidoController],
  providers: [DetallePedidoService],
  exports: [DetallePedidoService],
})
export class DetallePedidoModule {}