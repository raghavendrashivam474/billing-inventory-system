// Storage Location Repository — Sprint 4.1
// Contract established. Full implementation in Commit 2.
import { prisma } from '../../config/prisma';

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

  // Contract only — implementation in Commit 2

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

  async exists(id: number): Promise<boolean> {
    const count = await prisma.storageLocation.count({ where: { id } });
    return count > 0;
  }
}

export const storageLocationRepository = new StorageLocationRepository();