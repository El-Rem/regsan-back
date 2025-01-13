import { PartialType } from '@nestjs/swagger';
import { CreateTramiteDto } from './create-tramite.dto';

export class UpdateTramiteDto extends PartialType(CreateTramiteDto) {
  cofepris_status_health_registration_number: string;
  cofepris_status_registrer_number: string;
  cofepris_status_prevention_response: Date;
}
