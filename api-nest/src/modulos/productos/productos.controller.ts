import { Controller, Get, Post, Body, Put, Param, Delete, Headers, Req , UseGuards } from '@nestjs/common';
import { ProductoService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/modulos/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/modulos/auth/guard/roles.guard';
/*import { RolesGuard } from 'src/modulos/auth/guard/roles.guard';*/

@Controller('productos') // Define el prefijo de la ruta para este controlador
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {} // Inyecta el servicio ProductoService

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
    create(@Body() createProductoDto: CreateProductoDto, @Req() req: Request) {
    const userRole = (req as any).user.rol;
   return this.productoService.create(createProductoDto, userRole);
  } 


  @Get()
  findAll() {
    return this.productoService.findAll();
  }

  @Get(':id') //
  findOne(@Param('id') id: string) { 
    return this.productoService.findOne(+id); 
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() updateProductoDto: UpdateProductoDto, @Req() req: Request) {
    const userRole = (req as any).user.rol;
    return this.productoService.update(+id, updateProductoDto, userRole);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id') id: string, @Req() req: Request) {
    const userRole = (req as any).user.rol;
    return this.productoService.remove(+id, userRole);
  }
}