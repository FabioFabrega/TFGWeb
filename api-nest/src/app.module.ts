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
  imports: [ConfigModule.forRoot({isGlobal:true,}), 
    TypeOrmModule.forRoot({
      name:'base1',
      type:'mysql',
      host:process.env.URL,
      port:3306,
      username:process.env.USUARIO,
      password:process.env.PASSWORD,
      database: process.env.DBNAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize:true
    }),
    TypeOrmModule.forRoot({
      name:'base2',
      type:'mysql',
      host:process.env.URL,
      port:3306,
      username:process.env.USUARIO,
      password:process.env.PASSWORD,
      database: process.env.DBNAME2,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize:true
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