// Tax Rate Service — Sprint 2.3
import { taxRateRepository }  from './tax-rate.repository';
import { CreateTaxRateDTO }   from './dto/create-tax-rate.dto';
import { UpdateTaxRateDTO }   from './dto/update-tax-rate.dto';
import { PaginationParams, buildPaginationMeta } from '../../utils/pagination';
import { AppError }           from '../../utils/app-error';
import { logger }             from '../../logger';

export class TaxRateService {

  async getAll(params: PaginationParams) {
    const { data, total } = await taxRateRepository.findAll(params);
    const meta = buildPaginationMeta(total, params.page, params.limit);
    return { data, meta };
  }

  async getById(id: number) {
    const taxRate = await taxRateRepository.findById(id);
    if (!taxRate) throw AppError.notFound(`Tax Rate with ID ${id} not found.`);
    return taxRate;
  }

  async create(dto: CreateTaxRateDTO) {
    const existing = await taxRateRepository.findByName(dto.name);
    if (existing) throw AppError.conflict(`Tax Rate "${dto.name}" already exists.`);

    const taxRate = await taxRateRepository.create(dto);
    logger.info('Tax Rate created', { id: taxRate.id, name: taxRate.name, rate: taxRate.rate });
    return taxRate;
  }

  async update(id: number, dto: UpdateTaxRateDTO) {
    await this.getById(id);

    if (dto.name) {
      const existing = await taxRateRepository.findByName(dto.name);
      if (existing && existing.id !== id) {
        throw AppError.conflict(`Tax Rate "${dto.name}" already exists.`);
      }
    }

    const taxRate = await taxRateRepository.update(id, dto);
    logger.info('Tax Rate updated', { id: taxRate.id });
    return taxRate;
  }

  async delete(id: number) {
    await this.getById(id);
    await taxRateRepository.softDelete(id);
    logger.info('Tax Rate deleted (soft)', { id });
  }

  async restore(id: number) {
    await this.getById(id);
    const taxRate = await taxRateRepository.restore(id);
    logger.info('Tax Rate restored', { id });
    return taxRate;
  }
}

export const taxRateService = new TaxRateService();