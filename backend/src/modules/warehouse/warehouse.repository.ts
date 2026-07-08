// Warehouse Repository — Sprint 2.6
import { prisma }             from '../../config/prisma';
import { CreateWarehouseDTO } from './dto/create-warehouse.dto';
import { UpdateWarehouseDTO } from './dto/update-warehouse.dto';
import { PaginationParams }   from '../../utils/pagination';

export class WarehouseRepository {

  async findAll(params: PaginationParams) {
    const { page, limit, search, sort, order, active } = params;
    const skip = (page - 1) * limit;

    const where = {
      ...(search ? {
        OR: [
          { name:        { contains: search, mode: 'insensitive' as const } },
          { code:        { contains: search, mode: 'insensitive' as const } },
          { location:    { contains: search, mode: 'insensitive' as const } },
          { city:        { contains: search, mode: 'insensitive' as const } },
          { managerName: { contains: search, mode: 'insensitive' as const } },
        ],
      } : {}),
      ...(active !== undefined ? { isActive: active } : {}),
    };

    const [data, total] = await Promise.all([
      prisma.warehouse.findMany({
        where,
        skip,
        take:    limit,
        orderBy: { [sort]: order },
      }),
      prisma.warehouse.count({ where }),
    ]);

    return { data, total };
  }

  async findById(id: number) {
    return prisma.warehouse.findUnique({ where: { id } });
  }

  async findByName(name: string) {
    return prisma.warehouse.findUnique({ where: { name } });
  }

  async findByCode(code: string) {
    return prisma.warehouse.findUnique({ where: { code } });
  }

  async findByManagerPhone(managerPhone: string) {
    return prisma.warehouse.findUnique({ where: { managerPhone } });
  }

  async create(dto: CreateWarehouseDTO) {
    return prisma.warehouse.create({ data: dto });
  }

  async update(id: number, dto: UpdateWarehouseDTO) {
    return prisma.warehouse.update({ where: { id }, data: dto });
  }

  async softDelete(id: number) {
    return prisma.warehouse.update({ where: { id }, data: { isActive: false } });
  }

  async restore(id: number) {
    return prisma.warehouse.update({ where: { id }, data: { isActive: true } });
  }
}

export const warehouseRepository = new WarehouseRepository();