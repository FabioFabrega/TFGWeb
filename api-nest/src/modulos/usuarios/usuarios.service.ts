import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuarios.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import * as bcrypt from 'bcrypt';
import { CarritoService } from '../carrito/carrito.service';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    private carritoService: CarritoService,
  ) {}
  
  async obtenerUsuario(idUsuario: number): Promise<Usuario> {
    return this.findOne(idUsuario);
  }

  async obtenerTodosLosUsuarios(): Promise<Usuario[]> {
    return this.usuarioRepository.find();
  }
  async registrarUsuario(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const usuarioExistente = await this.usuarioRepository.findOneBy({ email: createUsuarioDto.email });
    if (usuarioExistente) {
      throw new BadRequestException('El correo electrónico ya está en uso');
    }
  
    const hashedPassword = await bcrypt.hash(createUsuarioDto.password, 10);
    const usuario = this.usuarioRepository.create({
      ...createUsuarioDto,
      password: hashedPassword,
    });
  
    const usuarioGuardado = await this.usuarioRepository.save(usuario);
  
    // Crear un carrito asociado al usuario
    const carrito = await this.carritoService.create({
      id_usuario: usuarioGuardado.id_usuario,
      fecha_creacion: new Date(),
      estado: 'activo',
    });
  
    // Asociar el carrito al usuario y guardar nuevamente
    usuarioGuardado.carrito = carrito;
    return this.usuarioRepository.save(usuarioGuardado);
  }
  

  async actualizarUsuario(idUsuario: number, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario> {
    const usuario = await this.findOne(idUsuario);
    if (updateUsuarioDto.email && updateUsuarioDto.email !== usuario.email) {
      const usuarioExistente = await this.usuarioRepository.findOneBy({ email: updateUsuarioDto.email });
      if (usuarioExistente) {
        throw new BadRequestException('El correo electrónico ya está en uso');
      }
    }

    if (updateUsuarioDto.password) {
      updateUsuarioDto.password = await bcrypt.hash(updateUsuarioDto.password, 10);
    }

    this.usuarioRepository.merge(usuario, updateUsuarioDto);
    return this.usuarioRepository.save(usuario);
  }

  async asignarRol(idUsuario: number, rol: string, userRole: string): Promise<Usuario> {
    if (userRole !== 'admin') {
      throw new UnauthorizedException('Solo los administradores pueden asignar roles');
    }
    const usuario = await this.findOne(idUsuario);
    usuario.rol = rol;
    return this.usuarioRepository.save(usuario);
  }

  async findOne(idUsuario: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario: idUsuario },
      relations: ['carrito','pedidos'], // Cargar la relación con Carrito
    });
  
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${idUsuario} no encontrado`);
    }
  
    return usuario;
  }

  async findByEmail(email: string): Promise<Usuario> {
    return this.usuarioRepository.findOneBy({ email });
  }
}