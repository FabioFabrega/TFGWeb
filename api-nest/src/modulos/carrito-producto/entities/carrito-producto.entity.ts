// src/modulos/carrito/entities/carrito-producto.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Carrito } from '../../carrito/entities/carrito.entity';
import { Producto } from '../../productos/entities/productos.entity';

@Entity()
export class CarritoProducto {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Carrito, carrito => carrito.carritoProductos)
    @JoinColumn({ name: 'id_carrito' })
    carrito: Carrito;

    @ManyToOne(() => Producto)
    @JoinColumn({ name: 'id_producto' })
    producto: Producto;

    @Column()
    cantidad: number;
}