import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('clients')
export class Cliente {
  @PrimaryColumn({ type: 'char', length: 13 })
  rfc: string;

  @Column({ type: 'varchar', length: 100 })
  business_name: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 15 })
  phone_number: string;

  @Column({ type: 'varchar', length: 50 })
  contact_first_name: string;

  @Column({ type: 'varchar', length: 50 })
  contact_last_name: string;
}
