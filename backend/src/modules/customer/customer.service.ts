// Customer Service — Sprint 2.5
import { customerRepository }  from './customer.repository';
import { CreateCustomerDTO }   from './dto/create-customer.dto';
import { UpdateCustomerDTO }   from './dto/update-customer.dto';
import { PaginationParams, buildPaginationMeta } from '../../utils/pagination';
import { AppError }            from '../../utils/app-error';
import { logger }              from '../../logger';

export class CustomerService {

  async getAll(params: PaginationParams) {
    const { data, total } = await customerRepository.findAll(params);
    const meta = buildPaginationMeta(total, params.page, params.limit);
    return { data, meta };
  }

  async getById(id: number) {
    const customer = await customerRepository.findById(id);
    if (!customer) throw AppError.notFound(`Customer with ID ${id} not found.`);
    return customer;
  }

  async create(dto: CreateCustomerDTO) {
    if (dto.email) {
      const existing = await customerRepository.findByEmail(dto.email);
      if (existing) throw AppError.conflict(`Customer with email "${dto.email}" already exists.`);
    }

    if (dto.phone) {
      const existing = await customerRepository.findByPhone(dto.phone);
      if (existing) throw AppError.conflict(`Customer with phone "${dto.phone}" already exists.`);
    }

    if (dto.gstNumber) {
      const existing = await customerRepository.findByGstNumber(dto.gstNumber);
      if (existing) throw AppError.conflict(`Customer with GST number "${dto.gstNumber}" already exists.`);
    }

    const customer = await customerRepository.create(dto);
    logger.info('Customer created', { id: customer.id, name: customer.name });
    return customer;
  }

  async update(id: number, dto: UpdateCustomerDTO) {
    await this.getById(id);

    if (dto.email) {
      const existing = await customerRepository.findByEmail(dto.email);
      if (existing && existing.id !== id) {
        throw AppError.conflict(`Customer with email "${dto.email}" already exists.`);
      }
    }

    if (dto.phone) {
      const existing = await customerRepository.findByPhone(dto.phone);
      if (existing && existing.id !== id) {
        throw AppError.conflict(`Customer with phone "${dto.phone}" already exists.`);
      }
    }

    if (dto.gstNumber) {
      const existing = await customerRepository.findByGstNumber(dto.gstNumber);
      if (existing && existing.id !== id) {
        throw AppError.conflict(`Customer with GST number "${dto.gstNumber}" already exists.`);
      }
    }

    const customer = await customerRepository.update(id, dto);
    logger.info('Customer updated', { id: customer.id });
    return customer;
  }

  async delete(id: number) {
    await this.getById(id);
    await customerRepository.softDelete(id);
    logger.info('Customer deleted (soft)', { id });
  }

  async restore(id: number) {
    await this.getById(id);
    const customer = await customerRepository.restore(id);
    logger.info('Customer restored', { id });
    return customer;
  }
}

export const customerService = new CustomerService();