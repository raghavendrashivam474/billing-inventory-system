// Storage Location Service — Sprint 4.1
import { prisma }                             from '../../config/prisma';
import { storageLocationRepository, StorageLocationQueryParams } from './storage-location.repository';
import { CreateStorageLocationDTO }           from './dto/create-storage-location.dto';
import { UpdateStorageLocationDTO }           from './dto/update-storage-location.dto';
import { buildPaginationMeta }                from '../../utils/pagination';
import { AppError }                           from '../../utils/app-error';
import { logger }                             from '../../logger';

export class StorageLocationService {

  async getAll(params: StorageLocationQueryParams) {
    const { data, total } = await storageLocationRepository.findAll(params);
    const meta = buildPaginationMeta(total, params.page, params.limit);
    return { data, meta };
  }

  async getById(id: number) {
    const location = await storageLocationRepository.findById(id);
    if (!location) throw AppError.notFound(`Storage location with ID ${id} not found.`);
    return location;
  }

  async create(dto: CreateStorageLocationDTO) {
    // Validate warehouse exists and is active
    const warehouse = await prisma.warehouse.findUnique({ where: { id: dto.warehouseId } });
    if (!warehouse) throw AppError.notFound(`Warehouse with ID ${dto.warehouseId} not found.`);
    if (!warehouse.isActive) {
      throw AppError.unprocessable(`Cannot create storage location for inactive warehouse.`);
    }

    // Check for duplicate code in same warehouse
    const existing = await storageLocationRepository.findByCode(dto.warehouseId, dto.code);
    if (existing) {
      throw AppError.conflict(
        `Storage location code "${dto.code}" already exists in warehouse "${warehouse.name}".`
      );
    }

    const location = await storageLocationRepository.create(dto);
    logger.info('Storage location created', {
      id:          location.id,
      code:        location.code,
      warehouseId: location.warehouseId,
    });
    return location;
  }

  async update(id: number, dto: UpdateStorageLocationDTO) {
    const existing = await this.getById(id);

    // If code is being changed, check for duplicates in the same warehouse
    if (dto.code && dto.code !== existing.code) {
      const duplicate = await storageLocationRepository.findByCode(existing.warehouseId, dto.code);
      if (duplicate) {
        throw AppError.conflict(
          `Storage location code "${dto.code}" already exists in this warehouse.`
        );
      }
    }

    const location = await storageLocationRepository.update(id, dto);
    logger.info('Storage location updated', { id: location.id });
    return location;
  }

  async delete(id: number) {
    await this.getById(id);
    const location = await storageLocationRepository.softDelete(id);
    logger.info('Storage location deactivated', { id: location.id });
    return location;
  }

  async restore(id: number) {
    await this.getById(id);
    const location = await storageLocationRepository.restore(id);
    logger.info('Storage location restored', { id: location.id });
    return location;
  }
}

export const storageLocationService = new StorageLocationService();