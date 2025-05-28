import { Controller, Get, Post, Body, Put, Param, Delete, NotFoundException, Req, UseGuards } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';

@Controller('categorias')
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() createCategoriaDto: CreateCategoriaDto, @Req() req: Request) {
    const userRole = (req as any).user.rol; // Accede al rol correctamente
    return this.categoriaService.create(createCategoriaDto, userRole);
  }

  @Get()
  findAll() {
    return this.categoriaService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const categoria = await this.categoriaService.findOne(+id);
    if (!categoria) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }
    return categoria;
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() updateCategoriaDto: UpdateCategoriaDto, @Req() req: Request) {
    const userRole = (req as any).user.rol; // Accede al rol correctamente
    return this.categoriaService.update(+id, updateCategoriaDto, userRole);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id') id: string, @Req() req: Request) {
    const userRole = (req as any).user.rol; // Accede al rol correctamente
    return this.categoriaService.remove(+id, userRole);
  }
}