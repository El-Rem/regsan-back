import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TramitesService } from './tramites.service';
import { TramitesController } from './tramites.controller';
import { Tramite } from '../entities/tramite.entity';
import { Cliente } from '../entities/cliente.entity';
import { EmpleadosService } from '../empleados/empleados.service';
import { Empleado } from '../entities/empleado.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tramite, Cliente, Empleado])],
  providers: [TramitesService, EmpleadosService],
  controllers: [TramitesController],
})
export class TramitesModule {}
