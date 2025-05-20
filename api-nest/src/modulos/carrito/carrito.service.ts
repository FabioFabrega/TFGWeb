import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Carrito } from './entities/carrito.entity';
import { CarritoProducto } from '../carrito-producto/entities/carrito-producto.entity';
import { ProductoService } from '../productos/productos.service';
import { CreateCarritoDto } from './dto/create-carrito.dto';
import { UpdateCarritoDto } from './dto/update-carrito.dto';
import { Usuario } from '../usuarios/entities/usuarios.entity';

@Injectable()
export class CarritoService {
  constructor(
    @InjectRepository(Carrito)
    private carritoRepository: Repository<Carrito>,

    @InjectRepository(CarritoProducto)
    private carritoProductoRepository: Repository<CarritoProducto>,

    private productoService: ProductoService,
  ) {}

  async create(createCarritoDto: CreateCarritoDto): Promise<Carrito> {
    const carrito = this.carritoRepository.create(createCarritoDto);
    return this.carritoRepository.save(carrito);
  }

  async findAll(): Promise<Carrito[]> {
    return this.carritoRepository.find();
  }

  async findOne(id: number): Promise<any> {
    const carrito = await this.carritoRepository.findOne({
      where: { id_carrito: id },
      relations: ['carritoProductos', 'carritoProductos.producto', 'usuario'], // Cargar relaciones
    });

    if (!carrito) {
      throw new NotFoundException(`Carrito con ID ${id} no encontrado`);
    }

    // Calcular el subtotal para cada producto en el carrito
    const carritoConSubtotal = {
      ...carrito,
      carritoProductos: carrito.carritoProductos.map((cp) => ({
        ...cp,
        subtotal: cp.producto.precio * cp.cantidad, // Calcular el subtotal
      })),
    };

    return carritoConSubtotal;
  }

  async update(id: number, updateCarritoDto: UpdateCarritoDto): Promise<Carrito> {
    const carrito = await this.findOne(id);
    this.carritoRepository.merge(carrito, updateCarritoDto);
    return this.carritoRepository.save(carrito);
  }

  async remove(id: number): Promise<void> {
    const carrito = await this.findOne(id);
    await this.carritoRepository.remove(carrito);
  }

  async agregarProducto(idCarrito: number, idProducto: number, cantidad: number): Promise<{
    id_carrito: number;
    fecha_creacion: Date;
    estado: string;
    usuario: Usuario; // Incluir el usuario en la respuesta
    carritoProductos: {
      id: number;
      cantidad: number;
      producto: {
        id_producto: number;
        nombre: string;
        descripcion: string;
        precio: number;
        stock: number;
      };
      subtotal: number;
    }[];
  }> {
    const carrito = await this.findOne(idCarrito);
    const producto = await this.productoService.findOne(idProducto);

    if (!producto) {
      throw new NotFoundException(`Producto con ID ${idProducto} no encontrado`);
    }

    if (producto.stock < cantidad) {
      throw new BadRequestException(`Stock insuficiente para el producto con ID ${idProducto}`);
    }

    // Crear la relación CarritoProducto
    const carritoProducto = new CarritoProducto();
    carritoProducto.carrito = carrito;
    carritoProducto.producto = producto;
    carritoProducto.cantidad = cantidad;

    // Guardar la relación CarritoProducto
    await this.carritoProductoRepository.save(carritoProducto);

    // Obtener el carrito actualizado con los productos
    const carritoActualizado = await this.findOne(idCarrito);

    // Formatear la respuesta para incluir el subtotal
    return {
      id_carrito: carritoActualizado.id_carrito,
      fecha_creacion: carritoActualizado.fecha_creacion,
      estado: carritoActualizado.estado,
      usuario: carritoActualizado.usuario, // Incluir el usuario en la respuesta
      carritoProductos: carritoActualizado.carritoProductos.map((cp) => ({
        id: cp.id,
        cantidad: cp.cantidad,
        producto: {
          id_producto: cp.producto.id_producto,
          nombre: cp.producto.nombre,
          descripcion: cp.producto.descripcion,
          precio: cp.producto.precio,
          stock: cp.producto.stock,
        },
        subtotal: cp.producto.precio * cp.cantidad,
      })),
    };
  }

  async eliminarProducto(idCarrito: number, idProducto: number): Promise<Carrito> {
    const carrito = await this.findOne(idCarrito);

    if (!carrito.carritoProductos) {
      return carrito;
    }

    // Buscar la relación CarritoProducto y eliminarla
    const carritoProducto = carrito.carritoProductos.find(
      (cp) => cp.producto.id_producto === idProducto,
    );

    if (carritoProducto) {
      await this.carritoProductoRepository.remove(carritoProducto);
    }

    return this.findOne(idCarrito);
  }

  async listarProductos(idCarrito: number): Promise<{ producto: any; cantidad: number; precio: number; subtotal: number }[]> {
    const carrito = await this.findOne(idCarrito);

    if (!carrito.carritoProductos) {
      return [];
    }

    return carrito.carritoProductos.map((cp) => {
      const producto = cp.producto;
      const cantidad = cp.cantidad;
      const precio = producto.precio;
      const subtotal = precio * cantidad;

      return {
        producto: {
          id_producto: producto.id_producto,
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          precio: producto.precio,
        },
        cantidad,
        precio,
        subtotal,
      };
    });
  }

  async actualizarCantidad(idCarrito: number, idProducto: number, cantidad: number): Promise<Carrito> {
    const carrito = await this.findOne(idCarrito);

    if (!carrito.carritoProductos) {
      return carrito;
    }

    // Buscar la relación CarritoProducto y actualizar la cantidad
    const carritoProducto = carrito.carritoProductos.find(
      (cp) => cp.producto.id_producto === idProducto,
    );

    if (carritoProducto) {
      carritoProducto.cantidad = cantidad;
      await this.carritoProductoRepository.save(carritoProducto);
    }

    return this.findOne(idCarrito);
  }
}