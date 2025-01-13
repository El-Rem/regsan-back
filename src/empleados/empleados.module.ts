// src/empleados/empleados.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpleadosService } from './empleados.service';
import { EmpleadosController } from './empleados.controller';
import { Empleado } from '../entities/empleado.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Empleado])],
  providers: [EmpleadosService],
  controllers: [EmpleadosController],
  exports: [EmpleadosService],
})
export class EmpleadosModule {}
