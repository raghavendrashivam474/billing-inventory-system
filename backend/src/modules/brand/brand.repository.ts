// Brand Repository — Sprint 2.2
import { prisma }          from '../../config/prisma';
import { CreateBrandDTO }  from './dto/create-brand.dto';
import { UpdateBrandDTO }  from './dto/update-brand.dto';
import { PaginationParams } from '../../utils/pagination';

export class BrandRepository {

  async findAll(params: PaginationParams) {
    const { page, limit, search, sort, order, active } = params;
    const skip = (page - 1) * limit;

    const where = {
      ...(search ? { name: { contains: search, mode: 'insensitive' as const } } : {}),
      ...(active !== undefined ? { isActive: active } : {}),
    };

    const [data, total] = await Promise.all([
      prisma.brand.findMany({
        where,
        skip,
        take:    limit,
        orderBy: { [sort]: order },
      }),
      prisma.brand.count({ where }),
    ]);

    return { data, total };
  }

  async findById(id: number) {
    return prisma.brand.findUnique({ where: { id } });
  }

  async findByName(name: string) {
    return prisma.brand.findUnique({ where: { name } });
  }

  async create(dto: CreateBrandDTO) {
    return prisma.brand.create({ data: dto });
  }

  async update(id: number, dto: UpdateBrandDTO) {
    return prisma.brand.update({ where: { id }, data: dto });
  }

  async softDelete(id: number) {
    return prisma.brand.update({ where: { id }, data: { isActive: false } });
  }

  async restore(id: number) {
    return prisma.brand.update({ where: { id }, data: { isActive: true } });
  }
}

export const brandRepository = new BrandRepository();