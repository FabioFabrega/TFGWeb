import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Pedido } from '../../pedidos/entities/pedidos.entity';
import { Producto } from '../../productos/entities/productos.entity';

@Entity()
export class DetallePedido {
  @PrimaryGeneratedColumn()
  id_detalle: number;

  @ManyToOne(() => Pedido, (pedido) => pedido.detallesPedido)
  @JoinColumn({ name: 'id_pedido' })
  pedido: Pedido;

  @ManyToOne(() => Producto, (producto) => producto.detallesPedido)
  @JoinColumn({ name: 'id_producto' })
  producto: Producto;

  @Column()
  cantidad: number;

  @Column('decimal', { precision: 10, scale: 2 })
  precio_unitario: number;

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number;
}