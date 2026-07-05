// Unit Service — Sprint 2.3
import { unitRepository }   from './unit.repository';
import { CreateUnitDTO }    from './dto/create-unit.dto';
import { UpdateUnitDTO }    from './dto/update-unit.dto';
import { PaginationParams, buildPaginationMeta } from '../../utils/pagination';
import { AppError }         from '../../utils/app-error';
import { logger }           from '../../logger';

export class UnitService {

  async getAll(params: PaginationParams) {
    const { data, total } = await unitRepository.findAll(params);
    const meta = buildPaginationMeta(total, params.page, params.limit);
    return { data, meta };
  }

  async getById(id: number) {
    const unit = await unitRepository.findById(id);
    if (!unit) throw AppError.notFound(`Unit with ID ${id} not found.`);
    return unit;
  }

  async create(dto: CreateUnitDTO) {
    const existingName = await unitRepository.findByName(dto.name);
    if (existingName) throw AppError.conflict(`Unit "${dto.name}" already exists.`);

    const existingAbbr = await unitRepository.findByAbbreviation(dto.abbreviation);
    if (existingAbbr) throw AppError.conflict(`Abbreviation "${dto.abbreviation}" already exists.`);

    const unit = await unitRepository.create(dto);
    logger.info('Unit created', { id: unit.id, name: unit.name, abbreviation: unit.abbreviation });
    return unit;
  }

  async update(id: number, dto: UpdateUnitDTO) {
    await this.getById(id);

    if (dto.name) {
      const existing = await unitRepository.findByName(dto.name);
      if (existing && existing.id !== id) {
        throw AppError.conflict(`Unit "${dto.name}" already exists.`);
      }
    }

    if (dto.abbreviation) {
      const existing = await unitRepository.findByAbbreviation(dto.abbreviation);
      if (existing && existing.id !== id) {
        throw AppError.conflict(`Abbreviation "${dto.abbreviation}" already exists.`);
      }
    }

    const unit = await unitRepository.update(id, dto);
    logger.info('Unit updated', { id: unit.id });
    return unit;
  }

  async delete(id: number) {
    await this.getById(id);
    await unitRepository.softDelete(id);
    logger.info('Unit deleted (soft)', { id });
  }

  async restore(id: number) {
    await this.getById(id);
    const unit = await unitRepository.restore(id);
    logger.info('Unit restored', { id });
    return unit;
  }
}

export const unitService = new UnitService();