import { Router, Request, Response, NextFunction } from 'express';
import { body, query, param } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import { validateRequest } from '../../utils/validators';
import pool from '../../config/database';
import { authenticate } from '../../common/middleware';

const router: ReturnType<typeof Router> = Router();

// =============================================
// PUBLIC: Crear pedido desde el storefront (sin auth)
// =============================================
router.post(
  '/public',
  [
    body('customerName').notEmpty().withMessage('Nombre del cliente es requerido'),
    body('customerPhone').notEmpty().withMessage('Teléfono es requerido'),
    body('customerEmail').optional().isEmail().withMessage('Email inválido'),
    body('customerCedula').optional().notEmpty(),
    body('department').optional().notEmpty(),
    body('municipality').optional().notEmpty(),
    body('address').optional().notEmpty(),
    body('neighborhood').optional().notEmpty(),
    body('notes').optional(),
    body('items').isArray({ min: 1 }).withMessage('Debe incluir al menos un producto'),
    body('items.*.productId').notEmpty().withMessage('ID de producto requerido'),
    body('items.*.productName').notEmpty().withMessage('Nombre de producto requerido'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Cantidad debe ser al menos 1'),
    body('items.*.unitPrice').isFloat({ min: 0 }).withMessage('Precio unitario inválido'),
    body('tenantId').optional().notEmpty(),
    validateRequest,
  ],
  async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const {
        customerName, customerPhone, customerEmail, customerCedula,
        department, municipality, address, neighborhood, notes,
        items, tenantId: requestedTenantId, paymentMethod, shippingCost = 0, discount = 0
      } = req.body;

      // Find tenant
      let tenantId = requestedTenantId;
      if (!tenantId) {
        const [tenants] = await pool.query(
          'SELECT id FROM tenants WHERE status = ? ORDER BY id ASC LIMIT 1',
          ['activo']
        ) as any;
        if (!tenants || tenants.length === 0) {
          res.status(400).json({ success: false, error: 'No hay tienda disponible' });
          return;
        }
        tenantId = tenants[0].id;
      }

      // Generate order number
      const orderNumber = `PED-${Date.now().toString(36).toUpperCase()}`;
      const orderId = uuidv4();

      // Calculate totals
      const subtotal = items.reduce((sum: number, item: any) => sum + (item.unitPrice * item.quantity), 0);
      const total = Math.max(0, subtotal + shippingCost - discount);

      // Append coupon to notes if code provided
      const couponNote = req.body.couponCode
        ? ` [Cupón: ${req.body.couponCode} - Descuento: $${discount}]`
        : '';
      const finalNotes = (notes || '') + couponNote;

      // Insert order
      await pool.query(
        `INSERT INTO storefront_orders 
          (id, tenant_id, order_number, customer_name, customer_phone, customer_email, customer_cedula,
           department, municipality, address, neighborhood, notes, subtotal, shipping_cost, discount, total, payment_method, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pendiente')`,
        [orderId, tenantId, orderNumber, customerName, customerPhone, customerEmail || null, customerCedula || null,
          department || null, municipality || null, address || null, neighborhood || null, finalNotes,
          subtotal, shippingCost, discount, total, paymentMethod || null]
      );

      // Insert order items
      for (const item of items) {
        await pool.query(
          `INSERT INTO storefront_order_items 
            (order_id, product_id, product_name, product_image, quantity, unit_price, total_price, size, color)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [orderId, item.productId, item.productName, item.productImage || null,
            item.quantity, item.unitPrice, item.unitPrice * item.quantity,
            item.size || null, item.color || null]
        );
      }

      res.status(201).json({
        success: true,
        data: {
          orderId,
          orderNumber,
          total,
          status: 'pendiente',
          message: 'Pedido creado exitosamente'
        }
      });
    } catch (error) {
      console.error('Create order error:', error);
      res.status(500).json({ success: false, error: 'Error al crear el pedido' });
    }
  }
);

// =============================================
// AUTHENTICATED: Endpoints para comerciantes
// =============================================
router.use(authenticate);

// GET /api/orders — Listar pedidos del tenant
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('status').optional().notEmpty(),
    query('search').optional().notEmpty(),
    validateRequest,
  ],
  async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const tenantId = (req as any).user.tenantId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = (page - 1) * limit;
      const status = req.query.status as string | undefined;
      const search = req.query.search as string | undefined;

      let whereClause = 'WHERE o.tenant_id = ?';
      const params: any[] = [tenantId];

      if (status) {
        whereClause += ' AND o.status = ?';
        params.push(status);
      }

      if (search) {
        whereClause += ' AND (o.customer_name LIKE ? OR o.order_number LIKE ? OR o.customer_phone LIKE ?)';
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
      }

      // Count
      const [countResult] = await pool.query(
        `SELECT COUNT(*) as total FROM storefront_orders o ${whereClause}`,
        params
      ) as any;
      const total = countResult[0].total;

      // Get orders
      const [orders] = await pool.query(
        `SELECT o.id, o.order_number as orderNumber, o.customer_name as customerName,
                o.customer_phone as customerPhone, o.customer_email as customerEmail,
                o.customer_cedula as customerCedula, o.department, o.municipality,
                o.address, o.neighborhood, o.notes, o.subtotal, o.shipping_cost as shippingCost,
                o.discount, o.total, o.status, o.payment_method as paymentMethod,
                o.created_at as createdAt, o.updated_at as updatedAt
         FROM storefront_orders o
         ${whereClause}
         ORDER BY o.created_at DESC
         LIMIT ? OFFSET ?`,
        [...params, limit, offset]
      ) as any;

      // Get items for each order
      for (const order of orders) {
        const [items] = await pool.query(
          `SELECT oi.id, oi.product_id as productId, oi.product_name as productName,
                  oi.product_image as productImage, oi.quantity, oi.unit_price as unitPrice,
                  oi.total_price as totalPrice, oi.size, oi.color
           FROM storefront_order_items oi
           WHERE oi.order_id = ?`,
          [order.id]
        ) as any;
        order.items = items;
      }

      res.json({
        success: true,
        data: {
          orders,
          pagination: { total, page, limit, pages: Math.ceil(total / limit) }
        }
      });
    } catch (error) {
      console.error('Get orders error:', error);
      res.status(500).json({ success: false, error: 'Error al obtener pedidos' });
    }
  }
);

// GET /api/orders/stats — Estadísticas de pedidos
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const tenantId = (req as any).user.tenantId;

    const [stats] = await pool.query(
      `SELECT 
        COUNT(*) as totalOrders,
        SUM(CASE WHEN status = 'pendiente' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'confirmado' THEN 1 ELSE 0 END) as confirmed,
        SUM(CASE WHEN status = 'preparando' THEN 1 ELSE 0 END) as preparing,
        SUM(CASE WHEN status = 'enviado' THEN 1 ELSE 0 END) as shipped,
        SUM(CASE WHEN status = 'entregado' THEN 1 ELSE 0 END) as delivered,
        SUM(CASE WHEN status = 'cancelado' THEN 1 ELSE 0 END) as cancelled,
        SUM(CASE WHEN status != 'cancelado' THEN total ELSE 0 END) as totalRevenue
       FROM storefront_orders
       WHERE tenant_id = ?`,
      [tenantId]
    ) as any;

    res.json({ success: true, data: stats[0] });
  } catch (error) {
    console.error('Order stats error:', error);
    res.status(500).json({ success: false, error: 'Error al obtener estadísticas' });
  }
});

// GET /api/orders/:id — Detalle de un pedido
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const tenantId = (req as any).user.tenantId;
    const orderId = req.params.id;

    const [orders] = await pool.query(
      `SELECT o.id, o.order_number as orderNumber, o.customer_name as customerName,
              o.customer_phone as customerPhone, o.customer_email as customerEmail,
              o.customer_cedula as customerCedula, o.department, o.municipality,
              o.address, o.neighborhood, o.notes, o.subtotal, o.shipping_cost as shippingCost,
              o.discount, o.total, o.status, o.payment_method as paymentMethod,
              o.created_at as createdAt, o.updated_at as updatedAt
       FROM storefront_orders o
       WHERE o.id = ? AND o.tenant_id = ?`,
      [orderId, tenantId]
    ) as any;

    if (orders.length === 0) {
      res.status(404).json({ success: false, error: 'Pedido no encontrado' });
      return;
    }

    const [items] = await pool.query(
      `SELECT oi.id, oi.product_id as productId, oi.product_name as productName,
              oi.product_image as productImage, oi.quantity, oi.unit_price as unitPrice,
              oi.total_price as totalPrice, oi.size, oi.color
       FROM storefront_order_items oi
       WHERE oi.order_id = ?`,
      [orderId]
    ) as any;

    res.json({ success: true, data: { ...orders[0], items } });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ success: false, error: 'Error al obtener pedido' });
  }
});

// PUT /api/orders/:id/status — Actualizar estado del pedido
router.put(
  '/:id/status',
  [
    param('id').notEmpty(),
    body('status').isIn(['pendiente', 'confirmado', 'preparando', 'enviado', 'entregado', 'cancelado'])
      .withMessage('Estado inválido'),
    validateRequest,
  ],
  async (req: Request, res: Response, _next: NextFunction) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const tenantId = (req as any).user.tenantId;
      const userId = (req as any).user.id;
      const userName = (req as any).user.name || 'Sistema';
      const orderId = req.params.id;
      const { status } = req.body;

      // Get current order
      const [orderRows] = await connection.query(
        `SELECT o.*, o.order_number as orderNumber, o.customer_name as customerName,
                o.customer_phone as customerPhone, o.customer_email as customerEmail,
                o.customer_cedula as customerCedula
         FROM storefront_orders o
         WHERE o.id = ? AND o.tenant_id = ? FOR UPDATE`,
        [orderId, tenantId]
      ) as any;

      if (orderRows.length === 0) {
        await connection.rollback();
        res.status(404).json({ success: false, error: 'Pedido no encontrado' });
        return;
      }

      const order = orderRows[0];

      // Prevent re-delivering or re-cancelling
      if (order.status === 'entregado') {
        await connection.rollback();
        res.status(400).json({ success: false, error: 'El pedido ya fue entregado y facturado' });
        return;
      }
      if (order.status === 'cancelado') {
        await connection.rollback();
        res.status(400).json({ success: false, error: 'El pedido ya fue cancelado' });
        return;
      }

      // Update order status
      await connection.query(
        'UPDATE storefront_orders SET status = ? WHERE id = ?',
        [status, orderId]
      );

      let invoiceNumber: string | null = null;

      // ================================================================
      // When marked as "entregado" → Generate sale + deduct stock
      // ================================================================
      if (status === 'entregado') {
        // Get order items
        const [orderItems] = await connection.query(
          `SELECT oi.product_id as productId, oi.product_name as productName,
                  oi.quantity, oi.unit_price as unitPrice, oi.total_price as totalPrice
           FROM storefront_order_items oi
           WHERE oi.order_id = ?`,
          [orderId]
        ) as any;

        // Generate invoice number
        const [seqRows] = await connection.query(
          'SELECT current_number, prefix FROM invoice_sequence WHERE tenant_id = ? FOR UPDATE',
          [tenantId]
        ) as any;

        let currentNumber = 0;
        let prefix = 'FAC';

        if (!seqRows || seqRows.length === 0) {
          // Initialize sequence if it doesn't exist
          await connection.query(
            "INSERT INTO invoice_sequence (tenant_id, prefix, current_number) VALUES (?, 'FAC', 0)",
            [tenantId]
          );
        } else {
          currentNumber = seqRows[0].current_number;
          prefix = seqRows[0].prefix || 'FAC';
        }

        currentNumber += 1;
        invoiceNumber = `${prefix}-${currentNumber.toString().padStart(5, '0')}`;

        await connection.query(
          'UPDATE invoice_sequence SET current_number = ? WHERE tenant_id = ?',
          [currentNumber, tenantId]
        );

        // Calculate totals
        const subtotal = orderItems.reduce((sum: number, item: any) => sum + Number(item.totalPrice), 0);
        const taxRate = 0.19;
        const tax = subtotal * taxRate;
        const total = subtotal + tax;

        // Check for active cash session
        const [activeSessionRows] = await connection.query(
          'SELECT id FROM cash_sessions WHERE status = ? AND tenant_id = ? LIMIT 1',
          ['abierta', tenantId]
        ) as any;
        const cashSessionId = activeSessionRows.length > 0 ? activeSessionRows[0].id : null;

        const saleId = uuidv4();

        // Insert sale
        await connection.query(
          `INSERT INTO sales (id, tenant_id, invoice_number, customer_id, customer_name, customer_phone, customer_email,
            subtotal, tax, discount, total, payment_method, amount_paid, change_amount, seller_id, seller_name, cash_session_id, notes, status)
           VALUES (?, ?, ?, NULL, ?, ?, ?, ?, ?, ?, ?, 'transferencia', ?, 0, ?, ?, ?, ?, 'completada')`,
          [
            saleId, tenantId, invoiceNumber,
            order.customer_name, order.customer_phone, order.customer_email,
            subtotal, tax, Number(order.discount) || 0, total,
            total, // amount_paid = total (paid in full)
            userId, userName, cashSessionId,
            `Pedido online ${order.order_number}`
          ]
        );

        // Insert sale items + deduct stock + register stock movements
        for (const item of orderItems) {
          const itemId = uuidv4();

          // Get product SKU and current stock
          let productSku = 'ONLINE';
          let previousStock = 0;
          if (item.productId) {
            const [prodRows] = await connection.query(
              'SELECT sku, stock FROM products WHERE id = ? FOR UPDATE',
              [item.productId]
            ) as any;
            if (prodRows.length > 0) {
              productSku = prodRows[0].sku;
              previousStock = prodRows[0].stock;

              // Deduct stock
              await connection.query(
                'UPDATE products SET stock = stock - ? WHERE id = ? AND tenant_id = ?',
                [item.quantity, item.productId, tenantId]
              );

              // Register stock movement
              await connection.query(
                `INSERT INTO stock_movements (id, tenant_id, product_id, type, quantity, previous_stock, new_stock, reason, reference_id, user_id)
                 VALUES (?, ?, ?, 'venta', ?, ?, ?, ?, ?, ?)`,
                [
                  uuidv4(), tenantId, item.productId,
                  item.quantity, previousStock, previousStock - item.quantity,
                  `Venta online ${invoiceNumber}`, saleId, userId
                ]
              );
            }
          }

          // Insert sale item
          await connection.query(
            `INSERT INTO sale_items (id, tenant_id, sale_id, product_id, product_name, product_sku, quantity, unit_price, discount, subtotal)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?)`,
            [itemId, tenantId, saleId, item.productId, item.productName, productSku, item.quantity, item.unitPrice, Number(item.totalPrice)]
          );
        }

        // Link order to the generated sale
        await connection.query(
          'UPDATE storefront_orders SET payment_method = ? WHERE id = ?',
          [`Factura: ${invoiceNumber}`, orderId]
        );
      }

      // ================================================================
      // When cancelled → restore stock if it was already deducted (entregado can't be cancelled above, so this handles other states)
      // ================================================================
      if (status === 'cancelado') {
        // No stock was deducted yet since stock only deducts on "entregado"
        // Just mark as cancelled — no stock changes needed
      }

      await connection.commit();

      res.json({
        success: true,
        data: {
          id: orderId,
          status,
          ...(invoiceNumber ? { invoiceNumber, message: `Factura ${invoiceNumber} generada y stock descontado` } : {})
        }
      });
    } catch (error) {
      await connection.rollback();
      console.error('Update order status error:', error);
      res.status(500).json({ success: false, error: 'Error al actualizar estado' });
    } finally {
      connection.release();
    }
  }
);

export const ordersRoutes = router;
