import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateClienteDto } from './create-cliente.dto';

export class UpdateClienteDto extends PartialType(CreateClienteDto) {
  @ApiProperty({ example: 'ABC1234567890', description: 'RFC del cliente' })
  rfc: string;

  @ApiProperty({
    example: 'Empresa XYZ',
    description: 'Nombre comercial del cliente',
  })
  business_name: string;

  @ApiProperty({
    example: 'cliente@example.com',
    description: 'Correo electrónico del cliente',
  })
  email: string;

  @ApiProperty({
    example: '1234567890',
    description: 'Número de teléfono del cliente',
  })
  phone_number: string;

  @ApiProperty({ example: 'Juan', description: 'Nombre del contacto' })
  contact_first_name: string;

  @ApiProperty({ example: 'Perez', description: 'Apellido del contacto' })
  contact_last_name: string;
}
