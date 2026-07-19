// Storage Location Repository — Sprint 4.1 Commit 2
import { prisma }                     from '../../config/prisma';
import { CreateStorageLocationDTO }   from './dto/create-storage-location.dto';
import { UpdateStorageLocationDTO }   from './dto/update-storage-location.dto';

const storageLocationInclude = {
  warehouse: { select: { id: true, name: true, code: true, location: true } },
} as const;

export interface StorageLocationQueryParams {
  page:        number;
  limit:       number;
  search:      string;
  sort:        string;
  order:       'asc' | 'desc';
  warehouseId: number | undefined;
  active:      boolean | undefined;
}

export class StorageLocationRepository {

  async findAll(params: StorageLocationQueryParams) {
    const { page, limit, search, sort, order, warehouseId, active } = params;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { code:        { contains: search, mode: 'insensitive' } },
        { name:        { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (warehouseId)     where.warehouseId = warehouseId;
    if (active !== undefined) where.isActive = active;

    const [data, total] = await Promise.all([
      prisma.storageLocation.findMany({
        where,
        skip,
        take:    limit,
        orderBy: { [sort]: order },
        include: storageLocationInclude,
      }),
      prisma.storageLocation.count({ where }),
    ]);

    return { data, total };
  }

  async findById(id: number) {
    return prisma.storageLocation.findUnique({
      where:   { id },
      include: storageLocationInclude,
    });
  }

  async findByCode(warehouseId: number, code: string) {
    return prisma.storageLocation.findUnique({
      where: { warehouseId_code: { warehouseId, code } },
    });
  }

  async create(dto: CreateStorageLocationDTO) {
    return prisma.storageLocation.create({
      data:    dto,
      include: storageLocationInclude,
    });
  }

  async update(id: number, dto: UpdateStorageLocationDTO) {
    return prisma.storageLocation.update({
      where:   { id },
      data:    dto,
      include: storageLocationInclude,
    });
  }

  async softDelete(id: number) {
    return prisma.storageLocation.update({
      where:   { id },
      data:    { isActive: false },
      include: storageLocationInclude,
    });
  }

  async restore(id: number) {
    return prisma.storageLocation.update({
      where:   { id },
      data:    { isActive: true },
      include: storageLocationInclude,
    });
  }

  async exists(id: number): Promise<boolean> {
    const count = await prisma.storageLocation.count({ where: { id } });
    return count > 0;
  }
}

export const storageLocationRepository = new StorageLocationRepository();