import { ApiProperty } from '@nestjs/swagger';

export class UpdateTechnicalDataDto {
  @ApiProperty({
    example: 'Datos tecnicos del tramite',
    description: 'Datos tecnicos del tramite',
  })
  technical_data: string;
}
