import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuarios.entity';
import { CarritoProducto } from '../../carrito-producto/entities/carrito-producto.entity';

@Entity()
export class Carrito {
  @PrimaryGeneratedColumn()
  id_carrito: number;

  @OneToOne(() => Usuario, usuario => usuario.carrito)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @Column()
  fecha_creacion: Date;

  @Column()
  estado: string;

  @OneToMany(() => CarritoProducto, carritoProducto => carritoProducto.carrito)
  carritoProductos: CarritoProducto[];
}