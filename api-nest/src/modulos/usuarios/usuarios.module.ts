// src/modulos/usuarios/usuarios.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioService } from './usuarios.service';
import { UsuarioController } from './usuarios.controller';
import { Usuario } from './entities/usuarios.entity';
import { CarritoModule } from '../carrito/carrito.module'; // Importa CarritoModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    CarritoModule, // Agrega CarritoModule aquí
  ],
  controllers: [UsuarioController],
  providers: [UsuarioService],
  exports: [UsuarioService],
})
export class UsuarioModule {}