// Warehouse Service — Sprint 2.6
import { warehouseRepository }  from './warehouse.repository';
import { CreateWarehouseDTO }   from './dto/create-warehouse.dto';
import { UpdateWarehouseDTO }   from './dto/update-warehouse.dto';
import { PaginationParams, buildPaginationMeta } from '../../utils/pagination';
import { AppError }             from '../../utils/app-error';
import { logger }               from '../../logger';

export class WarehouseService {

  async getAll(params: PaginationParams) {
    const { data, total } = await warehouseRepository.findAll(params);
    const meta = buildPaginationMeta(total, params.page, params.limit);
    return { data, meta };
  }

  async getById(id: number) {
    const warehouse = await warehouseRepository.findById(id);
    if (!warehouse) throw AppError.notFound(`Warehouse with ID ${id} not found.`);
    return warehouse;
  }

  async create(dto: CreateWarehouseDTO) {
    const existingName = await warehouseRepository.findByName(dto.name);
    if (existingName) throw AppError.conflict(`Warehouse "${dto.name}" already exists.`);

    const existingCode = await warehouseRepository.findByCode(dto.code);
    if (existingCode) throw AppError.conflict(`Warehouse code "${dto.code}" already exists.`);

    if (dto.managerPhone) {
      const existingPhone = await warehouseRepository.findByManagerPhone(dto.managerPhone);
      if (existingPhone) throw AppError.conflict(`Manager phone "${dto.managerPhone}" already exists.`);
    }

    const warehouse = await warehouseRepository.create(dto);
    logger.info('Warehouse created', { id: warehouse.id, name: warehouse.name, code: warehouse.code });
    return warehouse;
  }

  async update(id: number, dto: UpdateWarehouseDTO) {
    await this.getById(id);

    if (dto.name) {
      const existing = await warehouseRepository.findByName(dto.name);
      if (existing && existing.id !== id) {
        throw AppError.conflict(`Warehouse "${dto.name}" already exists.`);
      }
    }

    if (dto.code) {
      const existing = await warehouseRepository.findByCode(dto.code);
      if (existing && existing.id !== id) {
        throw AppError.conflict(`Warehouse code "${dto.code}" already exists.`);
      }
    }

    if (dto.managerPhone) {
      const existing = await warehouseRepository.findByManagerPhone(dto.managerPhone);
      if (existing && existing.id !== id) {
        throw AppError.conflict(`Manager phone "${dto.managerPhone}" already exists.`);
      }
    }

    const warehouse = await warehouseRepository.update(id, dto);
    logger.info('Warehouse updated', { id: warehouse.id });
    return warehouse;
  }

  async delete(id: number) {
    await this.getById(id);
    await warehouseRepository.softDelete(id);
    logger.info('Warehouse deleted (soft)', { id });
  }

  async restore(id: number) {
    await this.getById(id);
    const warehouse = await warehouseRepository.restore(id);
    logger.info('Warehouse restored', { id });
    return warehouse;
  }
}

export const warehouseService = new WarehouseService();