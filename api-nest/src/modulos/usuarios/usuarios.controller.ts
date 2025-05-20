import { Controller, Post, Body, Put, Param, Headers, UnauthorizedException,Get } from '@nestjs/common';
import { UsuarioService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Get(':id')
    obtenerUsuario(@Param('id') idUsuario: string) {
        return this.usuarioService.obtenerUsuario(+idUsuario);
  }

  @Get()
    obtenerUsuarios(){
        return this.usuarioService.obtenerTodosLosUsuarios();
  }

  @Post('registro')
  registrarUsuario(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuarioService.registrarUsuario(createUsuarioDto);
  }

  @Put(':id')
  actualizarUsuario(@Param('id') idUsuario: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuarioService.actualizarUsuario(+idUsuario, updateUsuarioDto);
  }

  @Put(':id/rol')
  asignarRol(
    @Param('id') idUsuario: string,
    @Body('rol') rol: string,
    @Headers('user-role') userRole: string,
  ) {
    return this.usuarioService.asignarRol(+idUsuario, rol, userRole);
  }

    @Post('admin')
    crearAdmin(@Body() createUsuarioDto: CreateUsuarioDto, @Headers('user-role') userRole: string) {
        if(userRole !== 'admin'){
            throw new UnauthorizedException('Solo los administradores pueden crear nuevos administradores');
        }
        return this.usuarioService.registrarUsuario({...createUsuarioDto, rol: 'admin'});
    }
}