// Product Service — Sprint 2.4
import { productRepository, ProductQueryParams } from './product.repository';
import { CreateProductDTO }   from './dto/create-product.dto';
import { UpdateProductDTO }   from './dto/update-product.dto';
import { buildPaginationMeta } from '../../utils/pagination';
import { AppError }           from '../../utils/app-error';
import { logger }             from '../../logger';
import { prisma }             from '../../config/prisma';

export class ProductService {

  private async validateCategory(categoryId: number): Promise<void> {
    const exists = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!exists) throw AppError.notFound(`Category with ID ${categoryId} not found.`);
    if (!exists.isActive) throw AppError.unprocessable(`Category with ID ${categoryId} is inactive.`);
  }

  private async validateBrand(brandId: number): Promise<void> {
    const exists = await prisma.brand.findUnique({ where: { id: brandId } });
    if (!exists) throw AppError.notFound(`Brand with ID ${brandId} not found.`);
    if (!exists.isActive) throw AppError.unprocessable(`Brand with ID ${brandId} is inactive.`);
  }

  private async validateUnit(unitId: number): Promise<void> {
    const exists = await prisma.unit.findUnique({ where: { id: unitId } });
    if (!exists) throw AppError.notFound(`Unit with ID ${unitId} not found.`);
    if (!exists.isActive) throw AppError.unprocessable(`Unit with ID ${unitId} is inactive.`);
  }

  private async validateTaxRate(taxRateId: number): Promise<void> {
    const exists = await prisma.taxRate.findUnique({ where: { id: taxRateId } });
    if (!exists) throw AppError.notFound(`Tax Rate with ID ${taxRateId} not found.`);
    if (!exists.isActive) throw AppError.unprocessable(`Tax Rate with ID ${taxRateId} is inactive.`);
  }

  private validatePricing(costPrice: number, sellingPrice: number): void {
    if (sellingPrice < costPrice) {
      throw AppError.unprocessable(
        `Selling price (${sellingPrice}) cannot be less than cost price (${costPrice}).`
      );
    }
  }

  async getAll(params: ProductQueryParams) {
    const { data, total } = await productRepository.findAll(params);
    const meta = buildPaginationMeta(total, params.page, params.limit);
    return { data, meta };
  }

  async getById(id: number) {
    const product = await productRepository.findById(id);
    if (!product) throw AppError.notFound(`Product with ID ${id} not found.`);
    return product;
  }

  async create(dto: CreateProductDTO) {
    await this.validateCategory(dto.categoryId);
    if (dto.brandId)   await this.validateBrand(dto.brandId);
    await this.validateUnit(dto.unitId);
    if (dto.taxRateId) await this.validateTaxRate(dto.taxRateId);

    const existingSKU = await productRepository.findBySKU(dto.sku);
    if (existingSKU) throw AppError.conflict(`Product with SKU "${dto.sku}" already exists.`);

    if (dto.barcode) {
      const existingBarcode = await productRepository.findByBarcode(dto.barcode);
      if (existingBarcode) throw AppError.conflict(`Product with barcode "${dto.barcode}" already exists.`);
    }

    this.validatePricing(dto.costPrice, dto.sellingPrice);

    const product = await productRepository.create(dto);
    logger.info('Product created', { id: product.id, name: product.name, sku: product.sku });
    return product;
  }

  async update(id: number, dto: UpdateProductDTO) {
    if (dto.categoryId) await this.validateCategory(dto.categoryId);
    if (dto.brandId)    await this.validateBrand(dto.brandId);
    if (dto.unitId)     await this.validateUnit(dto.unitId);
    if (dto.taxRateId)  await this.validateTaxRate(dto.taxRateId);

    if (dto.barcode) {
      const existing = await productRepository.findByBarcode(dto.barcode);
      if (existing && existing.id !== id) {
        throw AppError.conflict(`Product with barcode "${dto.barcode}" already exists.`);
      }
    }

    // Fetch raw product for price comparison
    const current = await prisma.product.findUnique({ where: { id } });
    if (!current) throw AppError.notFound(`Product with ID ${id} not found.`);

    if (dto.costPrice !== undefined || dto.sellingPrice !== undefined) {
      const costPrice = dto.costPrice    ?? Number(current.costPrice);
      const sellPrice = dto.sellingPrice ?? Number(current.sellingPrice);
      this.validatePricing(costPrice, sellPrice);
    }

    const product = await productRepository.update(id, dto);
    logger.info('Product updated', { id: product.id });
    return product;
  }

  async delete(id: number) {
    await this.getById(id);
    await productRepository.softDelete(id);
    logger.info('Product deleted (soft)', { id });
  }

  async restore(id: number) {
    await this.getById(id);
    const product = await productRepository.restore(id);
    logger.info('Product restored', { id });
    return product;
  }
}

export const productService = new ProductService();