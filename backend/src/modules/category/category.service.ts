// Category Service — Sprint 2.2
import { categoryRepository }  from './category.repository';
import { CreateCategoryDTO }   from './dto/create-category.dto';
import { UpdateCategoryDTO }   from './dto/update-category.dto';
import { PaginationParams, buildPaginationMeta } from '../../utils/pagination';
import { AppError }            from '../../utils/app-error';
import { logger }              from '../../logger';

export class CategoryService {

  async getAll(params: PaginationParams) {
    const { data, total } = await categoryRepository.findAll(params);
    const meta = buildPaginationMeta(total, params.page, params.limit);
    return { data, meta };
  }

  async getById(id: number) {
    const category = await categoryRepository.findById(id);
    if (!category) throw AppError.notFound(`Category with ID ${id} not found.`);
    return category;
  }

  async create(dto: CreateCategoryDTO) {
    const existing = await categoryRepository.findByName(dto.name);
    if (existing) throw AppError.conflict(`Category "${dto.name}" already exists.`);

    const category = await categoryRepository.create(dto);
    logger.info('Category created', { id: category.id, name: category.name });
    return category;
  }

  async update(id: number, dto: UpdateCategoryDTO) {
    await this.getById(id);

    if (dto.name) {
      const existing = await categoryRepository.findByName(dto.name);
      if (existing && existing.id !== id) {
        throw AppError.conflict(`Category "${dto.name}" already exists.`);
      }
    }

    const category = await categoryRepository.update(id, dto);
    logger.info('Category updated', { id: category.id });
    return category;
  }

  async delete(id: number) {
    await this.getById(id);
    await categoryRepository.softDelete(id);
    logger.info('Category deleted (soft)', { id });
  }

  async restore(id: number) {
    await this.getById(id);
    const category = await categoryRepository.restore(id);
    logger.info('Category restored', { id });
    return category;
  }
}

export const categoryService = new CategoryService();