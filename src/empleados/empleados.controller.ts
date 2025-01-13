import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
  Res,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { EmpleadosService } from './empleados.service';
import { CreateEmpleadoDto } from '../dto/create-empleado.dto';
import { UpdateEmpleadoDto } from '../dto/update-empleado.dto';
import { Response } from 'express';

@ApiTags('empleados')
@Controller('empleados')
export class EmpleadosController {
  constructor(private readonly empleadosService: EmpleadosService) {}

  @ApiOperation({ summary: 'Obtener todos los empleados' })
  @ApiResponse({ status: 200, description: 'Lista de todos los empleados.' })
  @Get()
  findAll() {
    return this.empleadosService.findAll();
  }

  @ApiOperation({ summary: 'Obtener un empleado por ID' })
  @ApiResponse({ status: 200, description: 'Empleado encontrado por ID.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.empleadosService.findOne(id);
  }

  @ApiOperation({ summary: 'Crear un nuevo empleado' })
  @ApiBody({ type: CreateEmpleadoDto })
  @ApiResponse({ status: 201, description: 'El empleado ha sido creado.' })
  @Post()
  async create(
    @Body() createEmpleadoDto: CreateEmpleadoDto,
    @Res() res: Response,
  ) {
    try {
      await this.empleadosService.create(createEmpleadoDto);
      return res.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        message: 'El empleado ha sido creado.',
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        return res.status(HttpStatus.CONFLICT).json({
          statusCode: HttpStatus.CONFLICT,
          message: error.message,
        });
      }
      throw error;
    }
  }

  @ApiOperation({ summary: 'Actualizar un empleado por ID' })
  @ApiBody({ type: UpdateEmpleadoDto })
  @ApiResponse({
    status: 200,
    description: 'Los datos del empleado han sido modificados exitosamente.',
  })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEmpleadoDto: UpdateEmpleadoDto,
    @Res() res: Response,
  ) {
    try {
      await this.empleadosService.update(id, updateEmpleadoDto);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Los datos del empleado han sido modificados exitosamente.',
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: error.message,
        });
      }
      throw error;
    }
  }

  @ApiOperation({ summary: 'Eliminar un empleado por ID' })
  @ApiResponse({ status: 200, description: 'El empleado ha sido eliminado.' })
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.empleadosService.remove(id);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'El empleado ha sido eliminado.',
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: error.message,
        });
      }
      throw error;
    }
  }

  @ApiOperation({ summary: 'Enviar un correo para recuperar la contraseña' })
  @ApiBody({ schema: { example: { email: 'empleado@example.com' } } })
  @ApiResponse({
    status: 200,
    description: 'Correo de recuperación de contraseña enviado.',
  })
  @ApiResponse({
    status: 400,
    description: 'El email proporcionado no es válido o no existe.',
  })
  @Post('recuperar-password')
  async recuperarPassword(@Body('email') email: string, @Res() res: Response) {
    try {
      await this.empleadosService.recuperarPassword(email);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Correo de recuperación de contraseña enviado.',
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: error.message,
        });
      }
      throw error;
    }
  }
}
