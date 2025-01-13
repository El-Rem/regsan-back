import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Cliente } from './cliente.entity';

@Entity('procedures')
export class Tramite {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  id: string;

  @Column({ type: 'char', length: 13 })
  client_rfc: string;

  @ManyToOne(() => Cliente)
  @JoinColumn({ name: 'client_rfc' })
  client: Cliente;

  @Column({ type: 'int', unique: true })
  number: number;

  @Column({ type: 'varchar', length: 100 })
  distinctive_denomination: string;

  @Column({ type: 'varchar', length: 100 })
  generic_name: string;

  @Column({ type: 'varchar', length: 100 })
  product_manufacturer: string;

  @Column({ type: 'varchar', length: 100 })
  service_name: string;

  @Column({ type: 'varchar', length: 100 })
  input_value: string;

  @Column({ type: 'varchar', length: 100 })
  type_description: string;

  @Column({ type: 'varchar', length: 100 })
  class_name: string;

  @Column({ type: 'date' })
  start_date: Date;

  @Column({ type: 'date', nullable: true })
  end_date: Date;

  @Column({ type: 'varchar', length: 50 })
  status: string;

  @Column({ type: 'text' })
  technical_data: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  completion_percentage: number;

  @Column({ type: 'date' })
  cofepris_entry_date: Date;

  @Column({ type: 'varchar', length: 50 })
  cofepris_status: string;

  @Column({ type: 'varchar', length: 100 })
  cofepris_status_health_registration_number: string;

  @Column({ type: 'varchar', length: 100 })
  cofepris_status_registrer_number: string;

  @Column({ type: 'date' })
  cofepris_status_prevention_response: Date;

  @Column({ type: 'varchar', length: 50 })
  cofepris_entry_number: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  cofepris_link: string;

  @Column({ type: 'varchar', length: 50 })
  assigned_consultant: string;

  @Column({ type: 'text', nullable: true })
  additional_information: string;

  @Column({ type: 'text' })
  billing: string;

  @Column({ type: 'text' })
  payment_status: string;

  @Column({ type: 'date' })
  payment_date: Date;

  @Column({ type: 'text' })
  collection_notes: string;

  @Column({ type: 'boolean', default: false })
  sales_flag: boolean;
}
