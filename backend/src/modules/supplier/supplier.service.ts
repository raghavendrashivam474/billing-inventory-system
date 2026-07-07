// Supplier Service — Sprint 2.5
import { supplierRepository }  from './supplier.repository';
import { CreateSupplierDTO }   from './dto/create-supplier.dto';
import { UpdateSupplierDTO }   from './dto/update-supplier.dto';
import { PaginationParams, buildPaginationMeta } from '../../utils/pagination';
import { AppError }            from '../../utils/app-error';
import { logger }              from '../../logger';

export class SupplierService {

  async getAll(params: PaginationParams) {
    const { data, total } = await supplierRepository.findAll(params);
    const meta = buildPaginationMeta(total, params.page, params.limit);
    return { data, meta };
  }

  async getById(id: number) {
    const supplier = await supplierRepository.findById(id);
    if (!supplier) throw AppError.notFound(`Supplier with ID ${id} not found.`);
    return supplier;
  }

  async create(dto: CreateSupplierDTO) {
    if (dto.email) {
      const existing = await supplierRepository.findByEmail(dto.email);
      if (existing) throw AppError.conflict(`Supplier with email "${dto.email}" already exists.`);
    }

    if (dto.phone) {
      const existing = await supplierRepository.findByPhone(dto.phone);
      if (existing) throw AppError.conflict(`Supplier with phone "${dto.phone}" already exists.`);
    }

    if (dto.gstNumber) {
      const existing = await supplierRepository.findByGstNumber(dto.gstNumber);
      if (existing) throw AppError.conflict(`Supplier with GST number "${dto.gstNumber}" already exists.`);
    }

    const supplier = await supplierRepository.create(dto);
    logger.info('Supplier created', { id: supplier.id, name: supplier.name });
    return supplier;
  }

  async update(id: number, dto: UpdateSupplierDTO) {
    await this.getById(id);

    if (dto.email) {
      const existing = await supplierRepository.findByEmail(dto.email);
      if (existing && existing.id !== id) {
        throw AppError.conflict(`Supplier with email "${dto.email}" already exists.`);
      }
    }

    if (dto.phone) {
      const existing = await supplierRepository.findByPhone(dto.phone);
      if (existing && existing.id !== id) {
        throw AppError.conflict(`Supplier with phone "${dto.phone}" already exists.`);
      }
    }

    if (dto.gstNumber) {
      const existing = await supplierRepository.findByGstNumber(dto.gstNumber);
      if (existing && existing.id !== id) {
        throw AppError.conflict(`Supplier with GST number "${dto.gstNumber}" already exists.`);
      }
    }

    const supplier = await supplierRepository.update(id, dto);
    logger.info('Supplier updated', { id: supplier.id });
    return supplier;
  }

  async delete(id: number) {
    await this.getById(id);
    await supplierRepository.softDelete(id);
    logger.info('Supplier deleted (soft)', { id });
  }

  async restore(id: number) {
    await this.getById(id);
    const supplier = await supplierRepository.restore(id);
    logger.info('Supplier restored', { id });
    return supplier;
  }
}

export const supplierService = new SupplierService();