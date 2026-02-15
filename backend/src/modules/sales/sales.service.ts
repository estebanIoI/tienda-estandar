import { v4 as uuidv4 } from 'uuid';
import { db } from '../../config';
import { Sale, SaleItem, PaymentMethod, SaleStatus, PaginatedResponse } from '../../common/types';
import { AppError } from '../../common/middleware';
import { TAX_RATE } from '../../utils';
import { RowDataPacket, ResultSetHeader, PoolConnection } from 'mysql2/promise';

interface SaleRow extends RowDataPacket {
  id: string;
  invoice_number: string;
  customer_id: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  customer_email: string | null;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  payment_method: PaymentMethod;
  amount_paid: number;
  change_amount: number;
  seller_id: string | null;
  seller_name: string;
  status: SaleStatus;
  credit_status: 'pendiente' | 'parcial' | 'pagado' | null;
  due_date: Date | null;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
}

interface SaleItemRow extends RowDataPacket {
  id: string;
  sale_id: string;
  product_id: string;
  product_name: string;
  product_sku: string;
  quantity: number;
  unit_price: number;
  discount: number;
  subtotal: number;
}

interface CountRow extends RowDataPacket {
  total: number;
}

interface InvoiceRow extends RowDataPacket {
  current_number: number;
  prefix: string;
}

interface ProductStockRow extends RowDataPacket {
  id: string;
  stock: number;
  name: string;
}

export interface SaleFilters {
  status?: SaleStatus;
  paymentMethod?: PaymentMethod;
  startDate?: Date;
  endDate?: Date;
  search?: string;
}

export interface CreateSaleItem {
  productId: string;
  quantity: number;
  discount?: number;
}

export interface CreateSaleData {
  items: CreateSaleItem[];
  paymentMethod: PaymentMethod;
  amountPaid: number;
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  sellerId: string;
  sellerName: string;
  creditDays?: number;
  notes?: string;
}

export class SalesService {
  private mapSale(row: SaleRow, items?: SaleItem[]): Sale {
    return {
      id: row.id,
      invoiceNumber: row.invoice_number,
      customerId: row.customer_id || undefined,
      customerName: row.customer_name || undefined,
      customerPhone: row.customer_phone || undefined,
      customerEmail: row.customer_email || undefined,
      items: items || [],
      subtotal: Number(row.subtotal),
      tax: Number(row.tax),
      discount: Number(row.discount),
      total: Number(row.total),
      paymentMethod: row.payment_method,
      amountPaid: Number(row.amount_paid),
      change: Number(row.change_amount),
      sellerId: row.seller_id || undefined,
      sellerName: row.seller_name,
      status: row.status,
      creditStatus: row.credit_status || undefined,
      dueDate: row.due_date || undefined,
      notes: row.notes || undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private mapSaleItem(row: SaleItemRow): SaleItem {
    return {
      id: row.id,
      saleId: row.sale_id,
      productId: row.product_id,
      productName: row.product_name,
      productSku: row.product_sku,
      quantity: row.quantity,
      unitPrice: Number(row.unit_price),
      discount: Number(row.discount),
      subtotal: Number(row.subtotal),
    };
  }

  private async generateInvoiceNumber(connection: PoolConnection, tenantId: string): Promise<string> {
    const [rows] = await connection.execute<InvoiceRow[]>(
      'SELECT current_number, prefix FROM invoice_sequence WHERE tenant_id = ? FOR UPDATE',
      [tenantId]
    );

    const currentNumber = rows[0].current_number + 1;
    const prefix = rows[0].prefix;

    await connection.execute(
      'UPDATE invoice_sequence SET current_number = ? WHERE tenant_id = ?',
      [currentNumber, tenantId]
    );

    return `${prefix}-${currentNumber.toString().padStart(5, '0')}`;
  }

  async findAll(
    tenantId: string,
    page = 1,
    limit = 10,
    filters?: SaleFilters
  ): Promise<PaginatedResponse<Sale>> {
    const offset = (page - 1) * limit;
    const conditions: string[] = ['tenant_id = ?'];
    const values: (string | number | Date)[] = [tenantId];

    if (filters?.status) {
      conditions.push('status = ?');
      values.push(filters.status);
    }

    if (filters?.paymentMethod) {
      conditions.push('payment_method = ?');
      values.push(filters.paymentMethod);
    }

    if (filters?.startDate) {
      conditions.push('created_at >= ?');
      values.push(filters.startDate);
    }

    if (filters?.endDate) {
      conditions.push('created_at <= ?');
      values.push(filters.endDate);
    }

    if (filters?.search) {
      conditions.push('(invoice_number LIKE ? OR customer_name LIKE ?)');
      const searchTerm = `%${filters.search}%`;
      values.push(searchTerm, searchTerm);
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`;

    const [countResult] = await db.execute<CountRow[]>(
      `SELECT COUNT(*) as total FROM sales ${whereClause}`,
      values
    );
    const total = countResult[0].total;

    const [rows] = await db.execute<SaleRow[]>(
      `SELECT * FROM sales ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...values, String(limit), String(offset)]
    );

    // Cargar items para cada venta
    const salesWithItems: Sale[] = [];
    for (const row of rows) {
      const [itemRows] = await db.execute<SaleItemRow[]>(
        'SELECT * FROM sale_items WHERE sale_id = ?',
        [row.id]
      );
      salesWithItems.push(this.mapSale(row, itemRows.map(this.mapSaleItem)));
    }

    return {
      data: salesWithItems,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string): Promise<Sale> {
    const [rows] = await db.execute<SaleRow[]>(
      'SELECT * FROM sales WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      throw new AppError('Venta no encontrada', 404);
    }

    const [itemRows] = await db.execute<SaleItemRow[]>(
      'SELECT * FROM sale_items WHERE sale_id = ?',
      [id]
    );

    const items = itemRows.map(this.mapSaleItem);

    return this.mapSale(rows[0], items);
  }

  async findByInvoiceNumber(invoiceNumber: string): Promise<Sale> {
    const [rows] = await db.execute<SaleRow[]>(
      'SELECT * FROM sales WHERE invoice_number = ?',
      [invoiceNumber]
    );

    if (rows.length === 0) {
      throw new AppError('Venta no encontrada', 404);
    }

    const [itemRows] = await db.execute<SaleItemRow[]>(
      'SELECT * FROM sale_items WHERE sale_id = ?',
      [rows[0].id]
    );

    const items = itemRows.map(this.mapSaleItem);

    return this.mapSale(rows[0], items);
  }

  async create(tenantId: string, data: CreateSaleData): Promise<Sale> {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      // Validacion especial para fiado: cliente es obligatorio
      if (data.paymentMethod === 'fiado' && !data.customerId) {
        throw new AppError('El cliente es obligatorio para ventas a credito', 400);
      }

      // Generar numero de factura
      const invoiceNumber = await this.generateInvoiceNumber(connection, tenantId);

      // Validar productos y calcular totales
      let subtotal = 0;
      let totalDiscount = 0;
      const itemsToInsert: Array<{
        id: string;
        productId: string;
        productName: string;
        productSku: string;
        quantity: number;
        unitPrice: number;
        discount: number;
        subtotal: number;
      }> = [];

      for (const item of data.items) {
        const [productRows] = await connection.execute<ProductStockRow[]>(
          'SELECT id, stock, name FROM products WHERE id = ? FOR UPDATE',
          [item.productId]
        );

        if (productRows.length === 0) {
          throw new AppError(`Producto ${item.productId} no encontrado`, 404);
        }

        const product = productRows[0];

        if (product.stock < item.quantity) {
          throw new AppError(`Stock insuficiente para ${product.name}`, 400);
        }

        // Obtener precio del producto
        const [priceRows] = await connection.execute<RowDataPacket[]>(
          'SELECT sale_price, sku FROM products WHERE id = ?',
          [item.productId]
        );

        const unitPrice = Number(priceRows[0].sale_price);
        const itemTotal = unitPrice * item.quantity;
        const itemDiscount = itemTotal * ((item.discount || 0) / 100);
        const itemSubtotal = itemTotal - itemDiscount;

        subtotal += itemSubtotal;
        totalDiscount += itemDiscount;

        itemsToInsert.push({
          id: uuidv4(),
          productId: item.productId,
          productName: product.name,
          productSku: priceRows[0].sku,
          quantity: item.quantity,
          unitPrice,
          discount: item.discount || 0,
          subtotal: itemSubtotal,
        });

        // Actualizar stock
        await connection.execute(
          'UPDATE products SET stock = stock - ? WHERE id = ?',
          [item.quantity, item.productId]
        );

        // Registrar movimiento de stock
        await connection.execute(
          `INSERT INTO stock_movements (id, tenant_id, product_id, type, quantity, previous_stock, new_stock, reason, reference_id, user_id)
           VALUES (?, ?, ?, 'venta', ?, ?, ?, ?, ?, ?)`,
          [
            uuidv4(),
            tenantId,
            item.productId,
            item.quantity,
            product.stock,
            product.stock - item.quantity,
            `Venta ${invoiceNumber}`,
            null,
            data.sellerId,
          ]
        );
      }

      const tax = subtotal * TAX_RATE;
      const total = subtotal + tax;

      // Para fiado: amountPaid = 0, change = 0
      let amountPaid = data.amountPaid;
      let change = 0;
      let creditStatus: string | null = null;

      let dueDate: string | null = null;

      if (data.paymentMethod === 'fiado') {
        amountPaid = 0;
        change = 0;
        creditStatus = 'pendiente';
        // Calcular fecha de vencimiento desde la fecha de creación del fiado
        const days = data.creditDays || 30;
        const due = new Date();
        due.setDate(due.getDate() + days);
        dueDate = due.toISOString().split('T')[0];
      } else {
        change = amountPaid - total;
        if (change < 0) {
          throw new AppError('El monto pagado es insuficiente', 400);
        }
      }

      const saleId = uuidv4();

      // Check for active cash session to link the sale
      const [activeSessionRows] = await connection.execute<RowDataPacket[]>(
        'SELECT id FROM cash_sessions WHERE status = ? AND tenant_id = ? LIMIT 1',
        ['abierta', tenantId]
      );
      const cashSessionId = activeSessionRows.length > 0 ? activeSessionRows[0].id : null;

      // Insertar venta
      await connection.execute<ResultSetHeader>(
        `INSERT INTO sales (id, tenant_id, invoice_number, customer_id, customer_name, customer_phone, customer_email,
          subtotal, tax, discount, total, payment_method, amount_paid, change_amount, seller_id, seller_name, cash_session_id, credit_status, due_date, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          saleId,
          tenantId,
          invoiceNumber,
          data.customerId || null,
          data.customerName || null,
          data.customerPhone || null,
          data.customerEmail || null,
          subtotal,
          tax,
          totalDiscount,
          total,
          data.paymentMethod,
          amountPaid,
          change,
          data.sellerId,
          data.sellerName,
          cashSessionId,
          creditStatus,
          dueDate,
          data.notes || null,
        ]
      );

      // Insertar items
      for (const item of itemsToInsert) {
        await connection.execute(
          `INSERT INTO sale_items (id, tenant_id, sale_id, product_id, product_name, product_sku, quantity, unit_price, discount, subtotal)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [item.id, tenantId, saleId, item.productId, item.productName, item.productSku, item.quantity, item.unitPrice, item.discount, item.subtotal]
        );
      }

      await connection.commit();

      return this.findById(saleId);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async cancel(id: string, userId: string, tenantId?: string): Promise<Sale> {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      const [saleRows] = await connection.execute<SaleRow[]>(
        'SELECT * FROM sales WHERE id = ? FOR UPDATE',
        [id]
      );

      if (saleRows.length === 0) {
        throw new AppError('Venta no encontrada', 404);
      }

      const sale = saleRows[0];

      if (sale.status === 'anulada') {
        throw new AppError('La venta ya esta anulada', 400);
      }

      // Obtener items de la venta
      const [itemRows] = await connection.execute<SaleItemRow[]>(
        'SELECT * FROM sale_items WHERE sale_id = ?',
        [id]
      );

      // Restaurar stock
      for (const item of itemRows) {
        const [productRows] = await connection.execute<ProductStockRow[]>(
          'SELECT stock FROM products WHERE id = ? FOR UPDATE',
          [item.product_id]
        );

        const currentStock = productRows[0].stock;

        await connection.execute(
          'UPDATE products SET stock = stock + ? WHERE id = ?',
          [item.quantity, item.product_id]
        );

        // Registrar movimiento de stock
        await connection.execute(
          `INSERT INTO stock_movements (id, tenant_id, product_id, type, quantity, previous_stock, new_stock, reason, reference_id, user_id)
           VALUES (?, ?, ?, 'devolucion', ?, ?, ?, ?, ?, ?)`,
          [
            uuidv4(),
            tenantId || null,
            item.product_id,
            item.quantity,
            currentStock,
            currentStock + item.quantity,
            `Anulacion ${sale.invoice_number}`,
            id,
            userId,
          ]
        );
      }

      // Actualizar estado de la venta
      await connection.execute(
        'UPDATE sales SET status = ? WHERE id = ?',
        ['anulada', id]
      );

      await connection.commit();

      return this.findById(id);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async getRecentSales(tenantId: string, limit = 5): Promise<Sale[]> {
    const [rows] = await db.execute<SaleRow[]>(
      'SELECT * FROM sales WHERE status = ? AND tenant_id = ? ORDER BY created_at DESC LIMIT ?',
      ['completada', tenantId, String(limit)]
    );

    return rows.map((row) => this.mapSale(row));
  }
}

export const salesService = new SalesService();
