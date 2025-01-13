import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Res,
  HttpStatus,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from '../dto/create-cliente.dto';
import { UpdateClienteDto } from '../dto/update-cliente.dto';
import { Response } from 'express';

@ApiTags('clientes')
@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @ApiOperation({ summary: 'Obtener todos los clientes' })
  @ApiResponse({ status: 200, description: 'Lista de todos los clientes.' })
  @Get()
  findAll() {
    return this.clientesService.findAll();
  }

  @ApiOperation({ summary: 'Buscar clientes por nombre' })
  @ApiResponse({ status: 200, description: 'Clientes encontrados por nombre.' })
  @Get('search')
  findByName(@Query('nombre') nombre: string) {
    return this.clientesService.findByName(nombre);
  }

  @ApiOperation({
    summary: 'Obtener RFC y nombre comercial de todos los clientes',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de RFC y nombre comercial de todos los clientes.',
  })
  @Get('combo')
  findRFCAndBusinessName() {
    return this.clientesService.findRFCAndBusinessName();
  }

  @ApiOperation({ summary: 'Obtener un cliente por RFC' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado por RFC.' })
  @Get(':rfc')
  findOne(@Param('rfc') rfc: string) {
    return this.clientesService.findOne(rfc);
  }

  @ApiOperation({ summary: 'Crear un nuevo cliente' })
  @ApiBody({ type: CreateClienteDto })
  @ApiResponse({ status: 201, description: 'El cliente ha sido creado.' })
  @Post()
  async create(
    @Body() createClienteDto: CreateClienteDto,
    @Res() res: Response,
  ) {
    try {
      await this.clientesService.create(createClienteDto);
      return res.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        message: 'El cliente ha sido creado.',
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

  @ApiOperation({ summary: 'Actualizar un cliente por RFC' })
  @ApiBody({ type: UpdateClienteDto })
  @ApiResponse({ status: 200, description: 'El cliente ha sido actualizado.' })
  @Put(':rfc')
  async update(
    @Param('rfc') rfc: string,
    @Body() updateClienteDto: UpdateClienteDto,
    @Res() res: Response,
  ) {
    try {
      await this.clientesService.update(rfc, updateClienteDto);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Los datos del cliente han sido modificados exitosamente.',
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

  @ApiOperation({ summary: 'Eliminar un cliente por RFC' })
  @ApiResponse({ status: 200, description: 'El cliente ha sido eliminado.' })
  @Delete(':rfc')
  async remove(@Param('rfc') rfc: string, @Res() res: Response) {
    try {
      await this.clientesService.remove(rfc);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'El cliente ha sido eliminado.',
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
