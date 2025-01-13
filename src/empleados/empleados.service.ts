import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Empleado } from '../entities/empleado.entity';
import * as bcrypt from 'bcryptjs';
import transporter from 'src/config/configurationMail';

@Injectable()
export class EmpleadosService {
  constructor(
    @InjectRepository(Empleado)
    private readonly empleadoRepository: Repository<Empleado>,
  ) {}

  async findAll(): Promise<Empleado[]> {
    return this.empleadoRepository.find();
  }

  async findOne(id: string): Promise<Empleado> {
    const empleado = await this.empleadoRepository.findOne({
      where: { phone_number: id },
    });
    if (!empleado) {
      throw new NotFoundException('Empleado no encontrado');
    }
    return empleado;
  }

  async findByEmail(email: string): Promise<Empleado> {
    return this.empleadoRepository.findOne({ where: { email } });
  }

  async create(empleado: Empleado): Promise<Empleado> {
    await this.ensureEmailDoesNotExist(empleado.email);
    empleado.password = await this.hashPassword(empleado.password);
    return this.empleadoRepository.save(empleado);
  }

  async update(id: string, empleado: Empleado): Promise<void> {
    await this.findOne(id); // Verifica si el empleado existe
    if (empleado.password) {
      empleado.password = await this.hashPassword(empleado.password);
    }
    await this.empleadoRepository.update({ phone_number: id }, empleado);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id); // Verifica si el empleado existe
    await this.empleadoRepository.delete({ phone_number: id });
  }

  async recuperarPassword(email: string): Promise<void> {
    const empleado = await this.findByEmail(email);
    if (!empleado) {
      throw new NotFoundException('El email proporcionado no existe.');
    }

    const contrasenaTemporal = await this.generarContrasenaTemporal();
    empleado.password = await this.hashPassword(contrasenaTemporal);

    await this.empleadoRepository.save(empleado);
    await this.sendPasswordRecoveryEmail(empleado, contrasenaTemporal);
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  private async ensureEmailDoesNotExist(email: string): Promise<void> {
    const existingEmpleado = await this.findByEmail(email);
    if (existingEmpleado) {
      throw new ConflictException('Empleado ya existe');
    }
  }

  private async sendPasswordRecoveryEmail(
    empleado: Empleado,
    pwd: string,
  ): Promise<void> {
    const emailOptions = {
      from: 'info@deligrano.com',
      to: empleado.email,
      subject: 'Recuperación de tu contraseña',
      html: `
        <p>Hola ${empleado.first_name} ${empleado.last_name},</p>
        <p>Recientemente solicitaste la recuperación de tu contraseña en la aplicación REGSAN.</p>
        <p>Tu nueva contraseña temporal es:</p>
        <p style="font-size: 1.5em; font-weight: bold;">${pwd}</p>
        <p>Te recomendamos cambiar esta contraseña lo antes posible.</p>
        <p>Si no solicitaste esta recuperación, por favor contacta a soporte inmediatamente.</p>
        <br>
        <p>Gracias,</p>
        <p>El equipo REGSAN</p>
      `,
    };

    await transporter.sendMail(emailOptions);
  }

  private async generarContrasenaTemporal(length: number = 8): Promise<string> {
    const caracteres =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';
    return Array.from(
      { length },
      () => caracteres[Math.floor(Math.random() * caracteres.length)],
    ).join('');
  }

  private async findEmailsByRole(role: string): Promise<string[]> {
    const empleados = await this.empleadoRepository.find({ where: { role } });
    if (empleados.length === 0) {
      throw new NotFoundException(
        `No se encontraron empleados con rol de ${role}`,
      );
    }
    return empleados.map((empleado) => empleado.email);
  }

  async findFacturacionEmails(): Promise<string[]> {
    return this.findEmailsByRole('Facturacion');
  }

  async findSalesEmails(): Promise<string[]> {
    return this.findEmailsByRole('Ventas');
  }
}
