import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tramite } from '../entities/tramite.entity';
import { Cliente } from '../entities/cliente.entity';
import { EmpleadosService } from 'src/empleados/empleados.service';
import { UpdateTramiteFacturacionDto } from 'src/dto/update-tramite-facturacion.dto';
import transporter from 'src/config/configurationMail';

@Injectable()
export class TramitesService {
  constructor(
    @InjectRepository(Tramite)
    private readonly tramiteRepository: Repository<Tramite>,
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    private readonly empleadosService: EmpleadosService,
  ) {}

  async findAll(): Promise<Tramite[]> {
    return this.tramiteRepository.find({ relations: ['client'] });
  }

  async findByRFC(client_rfc: string): Promise<Tramite[]> {
    const tramites = await this.tramiteRepository.find({
      where: { client_rfc },
      relations: ['client'],
    });

    if (tramites.length === 0) {
      throw new NotFoundException('No se encontraron trámites para este RFC');
    }

    return tramites;
  }

  async findByClientBusinessName(businessName: string): Promise<Tramite[]> {
    const client = await this.clienteRepository.findOne({
      where: { business_name: businessName },
    });
    if (!client) {
      throw new NotFoundException('Cliente no encontrado');
    }
    return this.tramiteRepository.find({
      where: { client_rfc: client.rfc },
      relations: ['client'],
    });
  }

  async findByStatus(status: string): Promise<Tramite[]> {
    const tramite = await this.tramiteRepository.find({
      where: { status },
      relations: ['client'],
    });
    if (tramite.length === 0) {
      throw new NotFoundException('Estatus no encontrado');
    }
    return tramite;
  }

  async findById(id: string): Promise<Tramite> {
    const tramite = await this.tramiteRepository.findOne({
      where: { id },
      relations: ['client'],
    });
    if (!tramite) {
      throw new NotFoundException('Trámite no encontrado');
    }
    return tramite;
  }

  async create(tramite: Tramite): Promise<Tramite> {
    if (!tramite.id?.trim()) {
      tramite.id = uuidv4();
    }

    const existingTramite = await this.tramiteRepository.findOne({
      where: { id: tramite.id },
    });

    if (existingTramite) {
      throw new ConflictException('Trámite con ese ID ya existe');
    }

    const newTramite = await this.tramiteRepository.save(tramite);
    await this.sendEmails(newTramite);
    return newTramite;
  }

  async update(id: string, tramite: Tramite): Promise<void> {
    await this.findById(id);
    await this.tramiteRepository.update(id, tramite);
  }

  async remove(id: string): Promise<void> {
    await this.tramiteRepository.delete(id);
  }

  async updateTechnicalData(id: string, technicalData: string): Promise<void> {
    const existingTramite = await this.findById(id);
    existingTramite.technical_data = technicalData;
    await this.tramiteRepository.save(existingTramite);

    await this.sendTechnicalDataUpdateEmail(existingTramite);
  }

  async updateSalesFlag(id: string): Promise<void> {
    const existingTramite = await this.findById(id);
    const empleadosFacturacion =
      await this.empleadosService.findFacturacionEmails();

    existingTramite.sales_flag = true;
    await this.tramiteRepository.save(existingTramite);

    await this.sendInvoiceNotification(empleadosFacturacion, existingTramite);
  }

  async updateTramiteData(
    id: string,
    updateTramiteDto: UpdateTramiteFacturacionDto,
  ): Promise<void> {
    const existingTramite = await this.findById(id);

    Object.assign(existingTramite, updateTramiteDto);

    await this.tramiteRepository.save(existingTramite);

    if (!existingTramite.client?.email) {
      throw new NotFoundException('Cliente asociado no tiene un email válido');
    }

    await this.sendBillingUpdateEmail(existingTramite, existingTramite.client);
  }

  private async sendEmails(tramite: Tramite) {
    const client = await this.clienteRepository.findOne({
      where: { rfc: tramite.client_rfc },
    });
    if (!client) return;

    const empleadosSales = await this.empleadosService.findSalesEmails();

    const [clientMailOptions, danielMailOptions] = this.generateEmailOptions(
      client,
      tramite,
      empleadosSales,
    );

    await Promise.all([
      transporter.sendMail(clientMailOptions),
      transporter.sendMail(danielMailOptions),
    ]);
  }

  async getTechnicalDataById(id: string): Promise<string> {
    const tramite = await this.findById(id);
    return tramite.technical_data;
  }

  private generateEmailOptions(
    client: Cliente,
    tramite: Tramite,
    emails: string[],
  ) {
    const recipientEmails = [client.email];
    if (client.email_2 && client.email_2.trim()) {
      recipientEmails.push(client.email_2);
    }
    const clientMailOptions = {
      from: 'info@deligrano.com',
      to: recipientEmails.join(', '),
      subject: 'Nuevo Trámite Registrado',
      html: `<p>Hola ${client.contact_first_name} ${client.contact_last_name},</p>
        <p>Se ha registrado un nuevo trámite con ID ${tramite.id}.</p>
        <p>Información del trámite:</p>
        <table border="1" cellpadding="5" cellspacing="0">
          <tr>
            <td><strong>RFC</strong></td>
            <td>${tramite.client_rfc}</td>
          </tr>
          <tr>
            <td><strong>Denominación distintiva</strong></td>
            <td>${tramite.distinctive_denomination}</td>
          </tr>
          <tr>
            <td><strong>Nombre Genérico</strong></td>
            <td>${tramite.generic_name}</td>
          </tr>
          <tr>
            <td><strong>Fabricante</strong></td>
            <td>${tramite.product_manufacturer}</td>
          </tr>
          <tr>
            <td><strong>Nombre del Servicio</strong></td>
            <td>${tramite.service_name}</td>
          </tr>
          <tr>
            <td><strong>Insumo</strong></td>
            <td>${tramite.input_value}</td>
          </tr>
          <tr>
            <td><strong>Tipo</strong></td>
            <td>${tramite.type_description}</td>
          </tr>
          <tr>
            <td><strong>Clase</strong></td>
            <td>${tramite.class_name}</td>
          </tr>
          <tr>
            <td><strong>Fecha de Inicio</strong></td>
            <td>${tramite.start_date}</td>
          </tr>
          <tr>
            <td><strong>Estatus</strong></td>
            <td>${tramite.status}</td>
          </tr>
          <tr>
            <td><strong>Consultor Asignado</strong></td>
            <td>${tramite.assigned_consultant}</td>
          </tr>
        </table>`,
    };

    const salesMailOptions = {
      from: 'info@deligrano.com',
      to: emails,
      subject: 'Nuevo Trámite Registrado',
      text: `Se ha registrado un nuevo trámite para el cliente ${client.business_name} con ID de tramite ${tramite.id}.`,
    };

    return [clientMailOptions, salesMailOptions];
  }

  private async sendTechnicalDataUpdateEmail(tramite: Tramite) {
    const client = await this.clienteRepository.findOne({
      where: { rfc: tramite.client_rfc },
    });
    if (!client) return;

    const recipientEmails = [client.email];
    if (client.email_2 && client.email_2.trim()) {
      recipientEmails.push(client.email_2);
    }

    const mailOptions = {
      from: 'info@deligrano.com',
      to: recipientEmails.join(', '),
      subject: 'Actualización de datos técnicos',
      html: `
        <p>Hola <strong>${client.contact_first_name} ${client.contact_last_name}</strong>,</p>
        <p>Se han actualizado los datos técnicos del trámite con ID ${tramite.id}.</p>
        <p>Datos técnicos nuevos: ${tramite.technical_data}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  }

  async sendInvoiceNotification(
    emails: string[],
    tramite: Tramite,
  ): Promise<void> {
    const mailOptions = {
      from: 'info@deligrano.com',
      to: emails,
      subject: 'Notificación de emisión de factura',
      html: `
        <p>Estimado equipo de Facturación,</p>
        <p>Se ha emitido una nueva factura correspondiente al trámite con ID: <strong>${tramite.id}</strong>, asociado al cliente <strong>${tramite.client.business_name}</strong>.</p>
        <p>Les solicitamos amablemente dar seguimiento a este trámite lo antes posible.</p>
        <p>Información del trámite:</p>
        <ul>
          <li><strong>ID del Trámite:</strong> ${tramite.id}</li>
          <li><strong>Cliente:</strong> ${tramite.client.business_name}</li>
          <li><strong>RFC del Cliente:</strong> ${tramite.client_rfc}</li>
          <li><strong>Fecha de Inicio:</strong> ${tramite.start_date}</li>
          <li><strong>Fecha de Término:</strong> ${tramite.end_date}</li>
          <li><strong>Estatus del Trámite:</strong> ${tramite.status}</li>
        </ul>
        <p>Gracias por su atención.</p>
        <br>
        <p>Atentamente,</p>
        <p>El equipo de REGSAN</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  }

  private async sendBillingUpdateEmail(
    tramite: Tramite,
    client: Cliente,
  ): Promise<void> {
    const recipientEmails = [client.email];
    if (client.email_2 && client.email_2.trim()) {
      recipientEmails.push(client.email_2);
    }
    const mailOptions = {
      from: 'info@deligrano.com',
      to: recipientEmails.join(', '),
      subject: `Actualización de facturación - Trámite ${tramite.id}`,
      html: `
        <p>Estimado ${client.business_name},</p>
        <p>Le informamos que la información de facturación de su trámite con ID <strong>${tramite.id}</strong> ha sido actualizada.</p>
        <p><strong>Estatus de pago:</strong> ${tramite.payment_status}</p>
        <p>Por favor, revise la información actualizada en su cuenta y no dude en contactarnos si tiene alguna pregunta.</p>
        <br>
        <p>Atentamente,</p>
        <p>El equipo de REGSAN</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  }
}
