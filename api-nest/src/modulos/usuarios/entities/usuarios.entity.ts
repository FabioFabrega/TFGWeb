
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { Carrito } from '../../carrito/entities/carrito.entity';
import { Pedido } from '../../pedidos/entities/pedidos.entity';
import { MinLength } from 'class-validator';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id_usuario: number;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @MinLength(6 , { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string; // Considera encriptarla

  @Column()
  direccion: string;

  @Column()
  telefono: string;

  @Column({ default: 'usuario' })
  rol: string;

  @OneToOne(() => Carrito, (carrito) => carrito.usuario)
  carrito: Carrito;

  @OneToMany(() => Pedido, (pedido) => pedido.usuario)
  pedidos: Pedido[];
}