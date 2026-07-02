// Category Repository — Sprint 2.2
import { prisma }             from '../../config/prisma';
import { CreateCategoryDTO }  from './dto/create-category.dto';
import { UpdateCategoryDTO }  from './dto/update-category.dto';
import { PaginationParams }   from '../../utils/pagination';

export class CategoryRepository {

  async findAll(params: PaginationParams) {
    const { page, limit, search, sort, order, active } = params;
    const skip  = (page - 1) * limit;

    const where = {
      ...(search ? { name: { contains: search, mode: 'insensitive' as const } } : {}),
      ...(active !== undefined ? { isActive: active } : {}),
    };

    const [data, total] = await Promise.all([
      prisma.category.findMany({
        where,
        skip,
        take:    limit,
        orderBy: { [sort]: order },
      }),
      prisma.category.count({ where }),
    ]);

    return { data, total };
  }

  async findById(id: number) {
    return prisma.category.findUnique({ where: { id } });
  }

  async findByName(name: string) {
    return prisma.category.findUnique({ where: { name } });
  }

  async create(dto: CreateCategoryDTO) {
    return prisma.category.create({ data: dto });
  }

  async update(id: number, dto: UpdateCategoryDTO) {
    return prisma.category.update({ where: { id }, data: dto });
  }

  async softDelete(id: number) {
    return prisma.category.update({ where: { id }, data: { isActive: false } });
  }

  async restore(id: number) {
    return prisma.category.update({ where: { id }, data: { isActive: true } });
  }
}

export const categoryRepository = new CategoryRepository();