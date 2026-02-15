import { Response, NextFunction } from 'express';
import { salesService, SaleFilters } from './sales.service';
import { AuthRequest } from '../../common/middleware';
import { PaymentMethod, SaleStatus } from '../../common/types';

export class SalesController {
  async findAll(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const filters: SaleFilters = {};

      if (req.query.status) {
        filters.status = req.query.status as SaleStatus;
      }

      if (req.query.paymentMethod) {
        filters.paymentMethod = req.query.paymentMethod as PaymentMethod;
      }

      if (req.query.startDate) {
        filters.startDate = new Date(req.query.startDate as string);
      }

      if (req.query.endDate) {
        filters.endDate = new Date(req.query.endDate as string);
      }

      if (req.query.search) {
        filters.search = req.query.search as string;
      }

      const result = await salesService.findAll(req.user!.tenantId!, page, limit, filters);

      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  async findById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const sale = await salesService.findById(req.params.id);

      res.json({
        success: true,
        data: sale,
      });
    } catch (error) {
      next(error);
    }
  }

  async findByInvoiceNumber(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const sale = await salesService.findByInvoiceNumber(req.params.invoiceNumber);

      res.json({
        success: true,
        data: sale,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const saleData = {
        ...req.body,
        sellerId: req.user!.userId,
        sellerName: req.body.sellerName || 'Usuario',
      };

      const sale = await salesService.create(req.user!.tenantId!, saleData);

      res.status(201).json({
        success: true,
        data: sale,
        message: 'Venta registrada exitosamente',
      });
    } catch (error) {
      next(error);
    }
  }

  async cancel(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const sale = await salesService.cancel(req.params.id, req.user!.userId, req.user!.tenantId!);

      res.json({
        success: true,
        data: sale,
        message: 'Venta anulada exitosamente',
      });
    } catch (error) {
      next(error);
    }
  }

  async getRecentSales(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      const sales = await salesService.getRecentSales(req.user!.tenantId!, limit);

      res.json({
        success: true,
        data: sales,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const salesController = new SalesController();
