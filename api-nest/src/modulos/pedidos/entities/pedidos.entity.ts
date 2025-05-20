import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne, OneToMany } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuarios.entity';
import { Pago } from '../../pago/entities/pago.entity'; // Import the Pago entity
import { DetallePedido } from '../../detalle-pedido/entities/detalle-pedido.entity'; // Import the DetallePedido entity

@Entity()
export class Pedido {
  @PrimaryGeneratedColumn()
  id_pedido: number;

  @ManyToOne(() => Usuario, usuario => usuario.pedidos, { onDelete: 'CASCADE' }) // Relación con usuario
  @JoinColumn({ name: 'id_usuario' }) // Clave foránea
  usuario: Usuario;

  @Column()
  fecha_pedido: Date;

  @Column()
  estado: string;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @OneToOne(() => Pago, (pago) => pago.pedido)
  pago: Pago;

  @OneToMany(() => DetallePedido, (detallePedido) => detallePedido.pedido)
  detallesPedido: DetallePedido[];
}