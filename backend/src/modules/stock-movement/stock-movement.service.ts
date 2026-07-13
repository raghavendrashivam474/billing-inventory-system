// Stock Movement Service — Sprint 3.2
// Read-only service — no create, update, or delete
import { stockMovementRepository, SMQueryParams } from './stock-movement.repository';
import { buildPaginationMeta }   from '../../utils/pagination';
import { AppError }              from '../../utils/app-error';

export class StockMovementService {

  async getAll(params: SMQueryParams) {
    const { data, total } = await stockMovementRepository.findAll(params);
    const meta = buildPaginationMeta(total, params.page, params.limit);
    return { data, meta };
  }

  async getById(id: number) {
    const movement = await stockMovementRepository.findById(id);
    if (!movement) throw AppError.notFound(`Stock Movement with ID ${id} not found.`);
    return movement;
  }
}

export const stockMovementService = new StockMovementService();