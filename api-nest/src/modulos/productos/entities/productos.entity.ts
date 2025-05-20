// src/modulos/productos/entities/productos.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Categoria } from '../../categoria/entities/categoria.entity';
import { DetallePedido } from '../../detalle-pedido/entities/detalle-pedido.entity';
import { CarritoProducto } from 'src/modulos/carrito-producto/entities/carrito-producto.entity';

@Entity()
export class Producto {
    @PrimaryGeneratedColumn()
    id_producto: number;

    @Column()
    nombre: string;

    @Column()
    descripcion: string;

    @Column('decimal', { precision: 10, scale: 2, default: 0.00 })
    precio: number;

    @Column()
    stock: number;

    @Column({ nullable: true })
    imagen: string;

    @ManyToOne(() => Categoria, categoria => categoria.productos)
    categoria: Categoria;

    @OneToMany(() => CarritoProducto, (carritoProducto) => carritoProducto.producto)
    carritoProductos: CarritoProducto[];

    @OneToMany(() => DetallePedido, detallePedido => detallePedido.producto)
    detallesPedido: DetallePedido[];
}