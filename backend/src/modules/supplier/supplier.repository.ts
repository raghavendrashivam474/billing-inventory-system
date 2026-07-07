// Supplier Repository — Sprint 2.5
import { prisma }            from '../../config/prisma';
import { CreateSupplierDTO } from './dto/create-supplier.dto';
import { UpdateSupplierDTO } from './dto/update-supplier.dto';
import { PaginationParams }  from '../../utils/pagination';

export class SupplierRepository {

  async findAll(params: PaginationParams) {
    const { page, limit, search, sort, order, active } = params;
    const skip = (page - 1) * limit;

    const where = {
      ...(search ? {
        OR: [
          { name:          { contains: search, mode: 'insensitive' as const } },
          { contactPerson: { contains: search, mode: 'insensitive' as const } },
          { email:         { contains: search, mode: 'insensitive' as const } },
          { phone:         { contains: search, mode: 'insensitive' as const } },
        ],
      } : {}),
      ...(active !== undefined ? { isActive: active } : {}),
    };

    const [data, total] = await Promise.all([
      prisma.supplier.findMany({
        where,
        skip,
        take:    limit,
        orderBy: { [sort]: order },
      }),
      prisma.supplier.count({ where }),
    ]);

    return { data, total };
  }

  async findById(id: number) {
    return prisma.supplier.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return prisma.supplier.findUnique({ where: { email } });
  }

  async findByPhone(phone: string) {
    return prisma.supplier.findFirst({ where: { phone } });
  }

  async findByGstNumber(gstNumber: string) {
    return prisma.supplier.findUnique({ where: { gstNumber } });
  }

  async create(dto: CreateSupplierDTO) {
    return prisma.supplier.create({ data: dto });
  }

  async update(id: number, dto: UpdateSupplierDTO) {
    return prisma.supplier.update({ where: { id }, data: dto });
  }

  async softDelete(id: number) {
    return prisma.supplier.update({ where: { id }, data: { isActive: false } });
  }

  async restore(id: number) {
    return prisma.supplier.update({ where: { id }, data: { isActive: true } });
  }
}

export const supplierRepository = new SupplierRepository();