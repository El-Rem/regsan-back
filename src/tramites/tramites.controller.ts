import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpStatus,
  ConflictException,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { TramitesService } from './tramites.service';
import { CreateTramiteDto } from '../dto/create-tramite.dto';
import { UpdateTramiteDto } from '../dto/update-tramite.dto';
import { Tramite } from '../entities/tramite.entity';
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { UpdateTechnicalDataDto } from 'src/dto/update-datos-tecnicos.dto';
import { UpdateTramiteFacturacionDto } from 'src/dto/update-tramite-facturacion.dto';

@ApiTags('tramites')
@Controller('tramites')
export class TramitesController {
  constructor(private readonly tramitesService: TramitesService) {}

  @ApiOperation({ summary: 'Obtener todos los trámites' })
  @ApiResponse({ status: 200, description: 'Lista de todos los trámites.' })
  @Get()
  findAll() {
    return this.tramitesService.findAll();
  }

  @ApiOperation({ summary: 'Buscar trámites por nombre comercial del cliente' })
  @ApiResponse({
    status: 200,
    description: 'Trámites encontrados por nombre comercial.',
  })
  @Get('search')
  findByClientBusinessName(@Query('businessName') businessName: string) {
    return this.tramitesService.findByClientBusinessName(businessName);
  }

  @ApiOperation({ summary: 'Buscar trámites por estado' })
  @ApiResponse({ status: 200, description: 'Trámites encontrados por estado.' })
  @Get('status')
  findByStatus(@Query('status') status: string) {
    return this.tramitesService.findByStatus(status);
  }

  @ApiOperation({ summary: 'Obtener un trámite por ID' })
  @ApiResponse({ status: 200, description: 'Trámite encontrado por ID.' })
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.tramitesService.findById(id);
  }

  @ApiOperation({ summary: 'Crear un nuevo trámite' })
  @ApiBody({ type: CreateTramiteDto })
  @ApiResponse({ status: 201, description: 'El trámite ha sido creado.' })
  @Post()
  async create(
    @Body() createTramiteDto: CreateTramiteDto,
    @Res() res: Response,
  ) {
    try {
      const tramite = new Tramite();
      tramite.id = uuidv4();
      tramite.client_rfc = createTramiteDto.client_rfc;
      tramite.distinctive_denomination =
        createTramiteDto.distinctive_denomination;
      tramite.generic_name = createTramiteDto.generic_name;
      tramite.product_manufacturer = createTramiteDto.product_manufacturer;
      tramite.service_name = createTramiteDto.service_name;
      tramite.sub_service_name = createTramiteDto.sub_service_name;
      tramite.input_value = createTramiteDto.input_value;
      tramite.type_description = createTramiteDto.type_description;
      tramite.class_name = createTramiteDto.class_name;
      tramite.start_date = createTramiteDto.start_date;
      tramite.end_date = createTramiteDto.end_date;
      tramite.status = createTramiteDto.status;
      tramite.technical_data = createTramiteDto.technical_data;
      tramite.completion_percentage = createTramiteDto.completion_percentage;
      tramite.cofepris_entry_date = createTramiteDto.cofepris_entry_date;
      tramite.cofepris_status = createTramiteDto.cofepris_status;
      tramite.cofepris_entry_number = createTramiteDto.cofepris_entry_number;
      tramite.cofepris_link = createTramiteDto.cofepris_link;
      tramite.assigned_consultant = createTramiteDto.assigned_consultant;
      tramite.additional_information = createTramiteDto.additional_information;
      const saved = await this.tramitesService.create(tramite);
      return res.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        message: 'El trámite ha sido creado.',
        data: { id: saved.id, number: saved.number },
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

  @ApiOperation({ summary: 'Actualizar un trámite por ID' })
  @ApiBody({ type: UpdateTramiteDto })
  @ApiResponse({ status: 200, description: 'El trámite ha sido actualizado.' })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTramiteDto: UpdateTramiteDto,
    @Res() res: Response,
  ) {
    try {
      const tramite = new Tramite();
      tramite.id = id;
      tramite.client_rfc = updateTramiteDto.client_rfc;
      tramite.distinctive_denomination =
        updateTramiteDto.distinctive_denomination;
      tramite.generic_name = updateTramiteDto.generic_name;
      tramite.product_manufacturer = updateTramiteDto.product_manufacturer;
      tramite.service_name = updateTramiteDto.service_name;
      tramite.sub_service_name = updateTramiteDto.sub_service_name;
      tramite.input_value = updateTramiteDto.input_value;
      tramite.type_description = updateTramiteDto.type_description;
      tramite.class_name = updateTramiteDto.class_name;
      tramite.start_date = updateTramiteDto.start_date;
      tramite.end_date = updateTramiteDto.end_date;
      tramite.status = updateTramiteDto.status;
      tramite.technical_data = updateTramiteDto.technical_data;
      tramite.completion_percentage = updateTramiteDto.completion_percentage;
      tramite.cofepris_entry_date = updateTramiteDto.cofepris_entry_date;
      tramite.cofepris_status = updateTramiteDto.cofepris_status;
      tramite.cofepris_status_health_registration_number =
        updateTramiteDto.cofepris_status_health_registration_number;
      tramite.cofepris_status_registrer_number =
        updateTramiteDto.cofepris_status_registrer_number;
      tramite.cofepris_status_prevention_response =
        updateTramiteDto.cofepris_status_prevention_response;
      tramite.cofepris_entry_number = updateTramiteDto.cofepris_entry_number;
      tramite.cofepris_link = updateTramiteDto.cofepris_link;
      tramite.assigned_consultant = updateTramiteDto.assigned_consultant;
      tramite.additional_information = updateTramiteDto.additional_information;
      await this.tramitesService.update(id, tramite);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Los datos del tramite han sido modificados exitosamente.',
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

  @ApiOperation({ summary: 'Eliminar un trámite por ID' })
  @ApiResponse({ status: 200, description: 'El trámite ha sido eliminado.' })
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.tramitesService.remove(id);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'El trámite ha sido eliminado.',
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

  @ApiOperation({ summary: 'Actualizar solo los datos técnicos de un trámite' })
  @ApiBody({ type: UpdateTechnicalDataDto })
  @ApiResponse({
    status: 200,
    description: 'Los datos técnicos del trámite han sido actualizados.',
  })
  @Put('datos-tecnicos/:id')
  async updateTechnicalData(
    @Param('id') id: string,
    @Body() updateTechnicalDataDto: UpdateTechnicalDataDto,
    @Res() res: Response,
  ) {
    try {
      await this.tramitesService.updateTechnicalData(
        id,
        updateTechnicalDataDto.technical_data,
      );
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message:
          'Los datos técnicos del trámite han sido modificados exitosamente.',
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

  @ApiOperation({ summary: 'Obtener los datos técnicos de un trámite por ID' })
  @ApiResponse({
    status: 200,
    description: 'Datos técnicos obtenidos exitosamente.',
  })
  @Get('datos-tecnicos/:id')
  async getTechnicalData(@Param('id') id: string, @Res() res: Response) {
    try {
      const technicalData = await this.tramitesService.getTechnicalDataById(id);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        technical_data: technicalData,
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

  @ApiOperation({ summary: 'Actualizar bandera de ventas de un trámite' })
  @ApiResponse({
    status: 200,
    description: 'Se ha actualizado la bandera de ventas del trámite.',
  })
  @Put('ventas/:id')
  async updateSalesFlag(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.tramitesService.updateSalesFlag(id);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Se ha emitido la factura correspondiente al tramite',
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

  @Put('actualizar-facturacion/:id')
  async updateTramiteData(
    @Param('id') id: string,
    @Body() updateTramiteDto: UpdateTramiteFacturacionDto,
    @Res() res: Response,
  ) {
    try {
      await this.tramitesService.updateTramiteData(id, updateTramiteDto);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Los datos del trámite han sido actualizados exitosamente.',
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }

  @ApiOperation({ summary: 'Obtener un trámite por ID' })
  @ApiResponse({ status: 200, description: 'Trámite encontrado por ID.' })
  @Get('tramites-rfc/:rfc')
  findByRFC(@Param('rfc') rfc: string) {
    return this.tramitesService.findByRFC(rfc);
  }
}
