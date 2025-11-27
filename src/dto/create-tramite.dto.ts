import { ApiProperty } from '@nestjs/swagger';

export class CreateTramiteDto {
  @ApiProperty({ example: 'ABC1234567890', description: 'RFC del cliente' })
  client_rfc: string;

  @ApiProperty({
    example: 'QWRT-ADS-1234',
    description: 'Tramite ID',
  })
  id: string;

  @ApiProperty({
    example: 'Denominación Distintiva',
    description: 'Denominación distintiva',
  })
  distinctive_denomination: string;

  @ApiProperty({ example: 'Nombre Genérico', description: 'Nombre genérico' })
  generic_name: string;

  @ApiProperty({
    example: 'Fabricante del Producto',
    description: 'Fabricante del producto',
  })
  product_manufacturer: string;

  @ApiProperty({
    example: 'Nombre del Servicio',
    description: 'Nombre del servicio',
  })
  service_name: string;

  @ApiProperty({
    example: 'Nombre del Sub servicio',
    description: 'Na',
  })
  sub_service_name: string;

  @ApiProperty({ example: 'NA', description: 'Valor de entrada' })
  input_value: string;

  @ApiProperty({
    example: 'Descripción del Tipo',
    description: 'Descripción del tipo',
  })
  type_description: string;

  @ApiProperty({
    example: 'Nombre de la Clase',
    description: 'Nombre de la clase',
  })
  class_name: string;

  @ApiProperty({ example: '2024-01-01', description: 'Fecha de inicio' })
  start_date: Date;

  @ApiProperty({ example: '2024-12-31', description: 'Fecha de fin' })
  end_date: Date;

  @ApiProperty({ example: 'Pendiente', description: 'Estado' })
  status: string;

  @ApiProperty({
    example: 'Datos tencinos del tramite',
    description: 'Datos tecnicos',
  })
  technical_data: string;

  @ApiProperty({ example: 75.5, description: 'Porcentaje de finalización' })
  completion_percentage: number;

  @ApiProperty({
    example: '2024-02-15',
    description: 'Fecha de entrada a COFEPRIS',
  })
  cofepris_entry_date: Date;

  @ApiProperty({ example: 'En Proceso', description: 'Estado en COFEPRIS' })
  cofepris_status: string;

  @ApiProperty({
    example: 'Número de entrada COFEPRIS',
    description: 'Número de entrada a COFEPRIS',
  })
  cofepris_entry_number: string;

  @ApiProperty({
    example: 'https://cofepris.gob.mx',
    description: 'Enlace a COFEPRIS',
  })
  cofepris_link: string;

  @ApiProperty({
    example: 'Consultor Asignado',
    description: 'Consultor asignado',
  })
  assigned_consultant: string;

  @ApiProperty({
    example: 'Información adicional',
    description: 'Información adicional',
  })
  additional_information: string;
}
