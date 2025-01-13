// src/auth/dto/login.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
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
