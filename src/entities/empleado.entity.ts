import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('employees')
export class Empleado {
  @PrimaryColumn({ type: 'varchar', length: 15 })
  phone_number: string;

  @Column({ type: 'varchar', length: 50 })
  first_name: string;

  @Column({ type: 'varchar', length: 50 })
  last_name: string;

  @Column({ type: 'varchar', length: 50 })
  role: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;
}
