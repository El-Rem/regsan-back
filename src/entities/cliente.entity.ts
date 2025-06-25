import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('clients')
export class Cliente {
  @PrimaryColumn({ type: 'char', length: 13 })
  rfc: string;

  @Column({ type: 'varchar', length: 100 })
  business_name: string;

  @Column({ type: 'varchar', length: 100 })
  email: string;

  @Column({ type: 'varchar', length: 15 })
  phone_number: string;

  @Column({ type: 'varchar', length: 50 })
  contact_first_name: string;

  @Column({ type: 'varchar', length: 50 })
  contact_last_name: string;

  @Column({ type: 'varchar', length: 100 })
  email_2: string;

  @Column({ type: 'varchar', length: 15 })
  phone_number_2: string;

  @Column({ type: 'varchar', length: 50 })
  contact_first_name_2: string;

  @Column({ type: 'varchar', length: 50 })
  contact_last_name_2: string;
}
