import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Pedido } from '../../pedidos/entities/pedidos.entity';

export enum MetodoPago {
  PAYPAL = 'paypal',
  VISA = 'visa',
  MASTERCARD = 'mastercard',
}

@Entity()
export class Pago {
  @PrimaryGeneratedColumn()
  id_pago: number;

  @OneToOne(() => Pedido, (pedido) => pedido.pago)
  @JoinColumn({ name: 'id_pedido' })
  pedido: Pedido;

  @Column({ type: 'enum', enum: MetodoPago }) // 👈 Nuevo campo con valores restringidos
  metodo_pago: MetodoPago;

  @Column()
  estado: string;

  @Column()
  fecha_pago: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  monto: number;
}