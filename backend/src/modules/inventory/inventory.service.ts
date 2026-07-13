// Inventory Service — Sprint 3.2
import { inventoryRepository, InventoryQueryParams } from './inventory.repository';
import { buildPaginationMeta }  from '../../utils/pagination';
import { AppError }             from '../../utils/app-error';

export class InventoryService {

  async getAll(params: InventoryQueryParams) {
    const { data, total } = await inventoryRepository.findAll(params);
    const meta = buildPaginationMeta(total, params.page, params.limit);
    return { data, meta };
  }

  async getById(id: number) {
    const inventory = await inventoryRepository.findById(id);
    if (!inventory) throw AppError.notFound(`Inventory record with ID ${id} not found.`);
    return inventory;
  }

  async getByProduct(productId: number) {
    const result = await inventoryRepository.findByProduct(productId);
    if (!result) throw AppError.notFound(`Product with ID ${productId} not found.`);
    return result;
  }
}

export const inventoryService = new InventoryService();