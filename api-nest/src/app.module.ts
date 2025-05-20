import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { AuthModule } from './modulos/auth/auth.module';
import { UsuarioModule } from './modulos/usuarios/usuarios.module';
import { CarritoModule } from './modulos/carrito/carrito.module';
import { PedidoModule } from './modulos/pedidos/pedidos.module';
import { PagoModule } from './modulos/pago/pago.module';
import { ProductoModule } from './modulos/productos/productos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Agregamos isGlobal: true para que las variables de entorno sean globales
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
      logging: false,
    }),
    AuthModule,
    UsuarioModule,
    CarritoModule,
    PedidoModule,
    PagoModule,
    ProductoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}