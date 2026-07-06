// Product Repository — Sprint 2.4
import { prisma }            from '../../config/prisma';
import { CreateProductDTO }  from './dto/create-product.dto';
import { UpdateProductDTO }  from './dto/update-product.dto';

// ================================
// Prisma include — nested relations
// ================================
const productInclude = {
  category: { select: { id: true, name: true } },
  brand:    { select: { id: true, name: true } },
  unit:     { select: { id: true, name: true, abbreviation: true } },
  taxRate:  { select: { id: true, name: true, rate: true } },
} as const;

export interface ProductQueryParams {
  page:       number;
  limit:      number;
  search:     string;
  sort:       string;
  order:      'asc' | 'desc';
  active:     boolean | undefined;
  categoryId: number | undefined;
  brandId:    number | undefined;
  unitId:     number | undefined;
  taxRateId:  number | undefined;
}

export class ProductRepository {

  async findAll(params: ProductQueryParams) {
    const { page, limit, search, sort, order, active, categoryId, brandId, unitId, taxRateId } = params;
    const skip = (page - 1) * limit;

    const where = {
      ...(search ? {
        OR: [
          { name:    { contains: search, mode: 'insensitive' as const } },
          { sku:     { contains: search, mode: 'insensitive' as const } },
          { barcode: { contains: search, mode: 'insensitive' as const } },
        ],
      } : {}),
      ...(active     !== undefined ? { isActive:   active     } : {}),
      ...(categoryId !== undefined ? { categoryId             } : {}),
      ...(brandId    !== undefined ? { brandId                } : {}),
      ...(unitId     !== undefined ? { unitId                 } : {}),
      ...(taxRateId  !== undefined ? { taxRateId              } : {}),
    };

    const [data, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take:    limit,
        orderBy: { [sort]: order },
        include: productInclude,
      }),
      prisma.product.count({ where }),
    ]);

    return { data, total };
  }

  async findById(id: number) {
    return prisma.product.findUnique({
      where: { id },
      include: productInclude,
    });
  }

  async findBySKU(sku: string) {
    return prisma.product.findUnique({ where: { sku } });
  }

  async findByBarcode(barcode: string) {
    return prisma.product.findUnique({ where: { barcode } });
  }

  async create(dto: CreateProductDTO) {
    return prisma.product.create({
      data:    dto,
      include: productInclude,
    });
  }

  async update(id: number, dto: UpdateProductDTO) {
    return prisma.product.update({
      where:   { id },
      data:    dto,
      include: productInclude,
    });
  }

  async softDelete(id: number) {
    return prisma.product.update({
      where: { id },
      data:  { isActive: false },
    });
  }

  async restore(id: number) {
    return prisma.product.update({
      where:   { id },
      data:    { isActive: true },
      include: productInclude,
    });
  }
}

export const productRepository = new ProductRepository();