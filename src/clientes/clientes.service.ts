import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from '../entities/cliente.entity';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
  ) {}

  async findAll(): Promise<Cliente[]> {
    return this.clienteRepository.find();
  }

  async findByName(nombre: string): Promise<Cliente[]> {
    const cliente = await this.clienteRepository.find({
      where: { business_name: nombre },
    });
    if (cliente.length === 0) {
      throw new NotFoundException('Cliente no encontrado');
    }
    return cliente;
  }

  async findRFCAndBusinessName(): Promise<Partial<Cliente[]>> {
    return this.clienteRepository.find({
      select: ['rfc', 'business_name'],
    });
  }

  async findOne(rfc: string): Promise<Cliente> {
    const cliente = await this.clienteRepository.findOne({ where: { rfc } });
    if (!cliente) {
      throw new NotFoundException('Cliente no encontrado');
    }
    return cliente;
  }

  async create(cliente: Cliente): Promise<Cliente> {
    const rfc = cliente.rfc;
    const existingCliente = await this.clienteRepository.findOne({
      where: { rfc },
    });
    if (existingCliente) {
      throw new ConflictException('Cliente ya existente');
    }

    return this.clienteRepository.save(cliente);
  }

  async update(rfc: string, cliente: Cliente): Promise<void> {
    const existingCliente = await this.findOne(rfc);
    if (!existingCliente) {
      throw new ConflictException('Cliente no existente');
    }
    await this.clienteRepository.update({ rfc }, cliente);
  }

  async remove(rfc: string): Promise<void> {
    const existingCliente = await this.findOne(rfc);
    if (!existingCliente) {
      throw new ConflictException('Cliente no existente');
    }
    await this.clienteRepository.delete({ rfc });
  }
}
