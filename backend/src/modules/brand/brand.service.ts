// Brand Service — Sprint 2.2
import { brandRepository }    from './brand.repository';
import { CreateBrandDTO }     from './dto/create-brand.dto';
import { UpdateBrandDTO }     from './dto/update-brand.dto';
import { PaginationParams, buildPaginationMeta } from '../../utils/pagination';
import { AppError }           from '../../utils/app-error';
import { logger }             from '../../logger';

export class BrandService {

  async getAll(params: PaginationParams) {
    const { data, total } = await brandRepository.findAll(params);
    const meta = buildPaginationMeta(total, params.page, params.limit);
    return { data, meta };
  }

  async getById(id: number) {
    const brand = await brandRepository.findById(id);
    if (!brand) throw AppError.notFound(`Brand with ID ${id} not found.`);
    return brand;
  }

  async create(dto: CreateBrandDTO) {
    const existing = await brandRepository.findByName(dto.name);
    if (existing) throw AppError.conflict(`Brand "${dto.name}" already exists.`);

    const brand = await brandRepository.create(dto);
    logger.info('Brand created', { id: brand.id, name: brand.name });
    return brand;
  }

  async update(id: number, dto: UpdateBrandDTO) {
    await this.getById(id);

    if (dto.name) {
      const existing = await brandRepository.findByName(dto.name);
      if (existing && existing.id !== id) {
        throw AppError.conflict(`Brand "${dto.name}" already exists.`);
      }
    }

    const brand = await brandRepository.update(id, dto);
    logger.info('Brand updated', { id: brand.id });
    return brand;
  }

  async delete(id: number) {
    await this.getById(id);
    await brandRepository.softDelete(id);
    logger.info('Brand deleted (soft)', { id });
  }

  async restore(id: number) {
    await this.getById(id);
    const brand = await brandRepository.restore(id);
    logger.info('Brand restored', { id });
    return brand;
  }
}

export const brandService = new BrandService();