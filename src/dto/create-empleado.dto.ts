import { ApiProperty } from '@nestjs/swagger';

export class CreateEmpleadoDto {
  @ApiProperty({
    example: '1234567890',
    description: 'Número de teléfono del empleado',
  })
  phone_number: string;

  @ApiProperty({ example: 'Juan', description: 'Nombre del empleado' })
  first_name: string;

  @ApiProperty({ example: 'Perez', description: 'Apellido del empleado' })
  last_name: string;

  @ApiProperty({ example: 'admin', description: 'Rol del empleado' })
  role: string;

  @ApiProperty({
    example: 'empleado@example.com',
    description: 'Correo electrónico del empleado',
  })
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Contraseña del empleado',
  })
  password: string;
}
