import { ApiProperty } from '@nestjs/swagger';

export class UpdateTramiteFacturacionDto {
  @ApiProperty({
    description: 'Información de facturación del trámite',
  })
  billing: string;

  @ApiProperty({
    description: 'Estatus de pago del trámite',
  })
  payment_status: string;

  @ApiProperty({
    description: 'Fecha de pago del trámite',
  })
  payment_date: Date;

  @ApiProperty({
    description: 'Notas de cobro del trámite',
  })
  collection_notes: string;
}
