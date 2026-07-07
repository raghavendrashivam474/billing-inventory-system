// Customer Repository — Sprint 2.5
import { prisma }            from '../../config/prisma';
import { CreateCustomerDTO } from './dto/create-customer.dto';
import { UpdateCustomerDTO } from './dto/update-customer.dto';
import { PaginationParams }  from '../../utils/pagination';

export class CustomerRepository {

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
      prisma.customer.findMany({
        where,
        skip,
        take:    limit,
        orderBy: { [sort]: order },
      }),
      prisma.customer.count({ where }),
    ]);

    return { data, total };
  }

  async findById(id: number) {
    return prisma.customer.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return prisma.customer.findUnique({ where: { email } });
  }

  async findByPhone(phone: string) {
    return prisma.customer.findFirst({ where: { phone } });
  }

  async findByGstNumber(gstNumber: string) {
    return prisma.customer.findUnique({ where: { gstNumber } });
  }

  async create(dto: CreateCustomerDTO) {
    return prisma.customer.create({ data: dto });
  }

  async update(id: number, dto: UpdateCustomerDTO) {
    return prisma.customer.update({ where: { id }, data: dto });
  }

  async softDelete(id: number) {
    return prisma.customer.update({ where: { id }, data: { isActive: false } });
  }

  async restore(id: number) {
    return prisma.customer.update({ where: { id }, data: { isActive: true } });
  }
}

export const customerRepository = new CustomerRepository();