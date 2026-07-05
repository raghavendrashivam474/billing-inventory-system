// Unit Repository — Sprint 2.3
import { prisma }         from '../../config/prisma';
import { CreateUnitDTO }  from './dto/create-unit.dto';
import { UpdateUnitDTO }  from './dto/update-unit.dto';
import { PaginationParams } from '../../utils/pagination';

export class UnitRepository {

  async findAll(params: PaginationParams) {
    const { page, limit, search, sort, order, active } = params;
    const skip = (page - 1) * limit;

    const where = {
      ...(search ? {
        OR: [
          { name:         { contains: search, mode: 'insensitive' as const } },
          { abbreviation: { contains: search, mode: 'insensitive' as const } },
        ],
      } : {}),
      ...(active !== undefined ? { isActive: active } : {}),
    };

    const [data, total] = await Promise.all([
      prisma.unit.findMany({
        where,
        skip,
        take:    limit,
        orderBy: { [sort]: order },
      }),
      prisma.unit.count({ where }),
    ]);

    return { data, total };
  }

  async findById(id: number) {
    return prisma.unit.findUnique({ where: { id } });
  }

  async findByName(name: string) {
    return prisma.unit.findUnique({ where: { name } });
  }

  async findByAbbreviation(abbreviation: string) {
    return prisma.unit.findUnique({ where: { abbreviation } });
  }

  async create(dto: CreateUnitDTO) {
    return prisma.unit.create({ data: dto });
  }

  async update(id: number, dto: UpdateUnitDTO) {
    return prisma.unit.update({ where: { id }, data: dto });
  }

  async softDelete(id: number) {
    return prisma.unit.update({ where: { id }, data: { isActive: false } });
  }

  async restore(id: number) {
    return prisma.unit.update({ where: { id }, data: { isActive: true } });
  }
}

export const unitRepository = new UnitRepository();