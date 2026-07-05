// Tax Rate Repository — Sprint 2.3
import { prisma }            from '../../config/prisma';
import { CreateTaxRateDTO } from './dto/create-tax-rate.dto';
import { UpdateTaxRateDTO } from './dto/update-tax-rate.dto';
import { PaginationParams } from '../../utils/pagination';

export class TaxRateRepository {

  async findAll(params: PaginationParams) {
    const { page, limit, search, sort, order, active } = params;
    const skip = (page - 1) * limit;

    const where = {
      ...(search ? { name: { contains: search, mode: 'insensitive' as const } } : {}),
      ...(active !== undefined ? { isActive: active } : {}),
    };

    const [data, total] = await Promise.all([
      prisma.taxRate.findMany({
        where,
        skip,
        take:    limit,
        orderBy: { [sort]: order },
      }),
      prisma.taxRate.count({ where }),
    ]);

    return { data, total };
  }

  async findById(id: number) {
    return prisma.taxRate.findUnique({ where: { id } });
  }

  async findByName(name: string) {
    return prisma.taxRate.findUnique({ where: { name } });
  }

  async create(dto: CreateTaxRateDTO) {
    return prisma.taxRate.create({ data: dto });
  }

  async update(id: number, dto: UpdateTaxRateDTO) {
    return prisma.taxRate.update({ where: { id }, data: dto });
  }

  async softDelete(id: number) {
    return prisma.taxRate.update({ where: { id }, data: { isActive: false } });
  }

  async restore(id: number) {
    return prisma.taxRate.update({ where: { id }, data: { isActive: true } });
  }
}

export const taxRateRepository = new TaxRateRepository();