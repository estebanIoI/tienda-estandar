import { Router, Request, Response, NextFunction } from 'express';
import { query, param, body } from 'express-validator';
import { validateRequest } from '../../utils/validators';
import pool from '../../config/database';
import { authenticate } from '../../common/middleware';

const router: ReturnType<typeof Router> = Router();

// GET /api/storefront/products — Public endpoint, no auth required
router.get(
  '/products',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Pagina invalida'),
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limite invalido'),
    query('category').optional().notEmpty().withMessage('Categoria invalida'),
    query('search').optional().notEmpty(),
    query('store').optional().notEmpty(),
    validateRequest,
  ],
  async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = (page - 1) * limit;
      const category = req.query.category as string | undefined;
      const search = req.query.search as string | undefined;
      const store = req.query.store as string | undefined;

      // Get tenants — optionally filter by store slug
      let tenantId: string | null = null;
      if (store) {
        const [tenants] = await pool.query(
          'SELECT id FROM tenants WHERE status = ? AND slug = ? LIMIT 1',
          ['activo', store]
        ) as any;
        if (tenants && tenants.length > 0) tenantId = tenants[0].id;
      }

      // If no store filter or not found, get first active tenant
      if (!tenantId) {
        const [tenants] = await pool.query(
          'SELECT id FROM tenants WHERE status = ? ORDER BY id ASC LIMIT 1',
          ['activo']
        ) as any;
        if (!tenants || tenants.length === 0) {
          res.json({ success: true, data: { products: [], pagination: { total: 0, page, limit, pages: 0 } } });
          return;
        }
        tenantId = tenants[0].id;
      }

      let whereClause = 'WHERE p.tenant_id = ? AND p.stock > 0 AND p.published_in_store = 1';
      const params: any[] = [tenantId];

      if (category) {
        whereClause += ' AND p.category = ?';
        params.push(category);
      }

      if (search) {
        whereClause += ' AND (p.name LIKE ? OR p.brand LIKE ? OR p.description LIKE ?)';
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
      }

      // Count total
      const [countResult] = await pool.query(
        `SELECT COUNT(*) as total FROM products p ${whereClause}`,
        params
      ) as any;
      const total = countResult[0].total;

      // Get products (only public-safe fields)
      const [rows] = await pool.query(
        `SELECT 
          p.id, p.name, p.category, p.brand, p.description,
          p.sale_price as salePrice, p.image_url as imageUrl,
          p.stock, p.color, p.size, p.gender
        FROM products p 
        ${whereClause}
        ORDER BY p.name ASC
        LIMIT ? OFFSET ?`,
        [...params, limit, offset]
      ) as any;

      res.json({
        success: true,
        data: {
          products: rows,
          pagination: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      console.error('Storefront products error:', error);
      res.status(500).json({ success: false, error: 'Error al obtener productos' });
    }
  }
);

// GET /api/storefront/categories — Public endpoint
router.get('/categories', async (_req: Request, res: Response) => {
  try {
    const [tenants] = await pool.query(
      'SELECT id FROM tenants WHERE status = ? ORDER BY id ASC LIMIT 1',
      ['activo']
    ) as any;

    if (!tenants || tenants.length === 0) {
      res.json({ success: true, data: [] });
      return;
    }

    const tenantId = tenants[0].id;

    const [rows] = await pool.query(
      'SELECT DISTINCT category FROM products WHERE tenant_id = ? AND stock > 0 AND published_in_store = 1 ORDER BY category',
      [tenantId]
    ) as any;

    res.json({
      success: true,
      data: rows.map((r: any) => r.category),
    });
  } catch (error) {
    console.error('Storefront categories error:', error);
    res.status(500).json({ success: false, error: 'Error al obtener categorías' });
  }
});

// GET /api/storefront/stores — Lista de tiendas activas (público)
router.get('/stores', async (_req: Request, res: Response) => {
  try {
    const [stores] = await pool.query(
      `SELECT t.id, t.name, t.slug, t.business_type as businessType
       FROM tenants t
       WHERE t.status = 'activo'
       ORDER BY t.name ASC`
    ) as any;

    res.json({ success: true, data: stores });
  } catch (error) {
    console.error('Storefront stores error:', error);
    res.status(500).json({ success: false, error: 'Error al obtener tiendas' });
  }
});

// =============================================
// AUTHENTICATED: Endpoints para gestionar publicación
// =============================================

// PUT /api/storefront/publish/:productId — Publicar/despublicar producto
router.put(
  '/publish/:productId',
  authenticate,
  async (req: Request, res: Response) => {
    try {
      const tenantId = (req as any).user.tenantId;
      const { productId } = req.params;
      const { published } = req.body;

      // Validate published parameter
      if (typeof published !== 'boolean') {
        res.status(400).json({ success: false, error: 'El campo "published" debe ser verdadero o falso' });
        return;
      }

      const publishedValue = published ? 1 : 0;
      const [result] = await pool.query(
        'UPDATE products SET published_in_store = ? WHERE id = ? AND tenant_id = ?',
        [publishedValue, productId, tenantId]
      ) as any;

      if (result.affectedRows === 0) {
        res.status(404).json({ success: false, error: 'Producto no encontrado' });
        return;
      }

      res.json({ success: true, data: { id: productId, publishedInStore: published } });
    } catch (error) {
      console.error('Publish product error:', error);
      res.status(500).json({ success: false, error: 'Error al actualizar publicación' });
    }
  }
);

// PUT /api/storefront/publish-bulk — Publicar/despublicar múltiples productos
router.put(
  '/publish-bulk',
  authenticate,
  [
    body('productIds').isArray({ min: 1 }).withMessage('Se requiere al menos un producto'),
    body('published').isBoolean().withMessage('Estado de publicación requerido'),
    validateRequest,
  ],
  async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const tenantId = (req as any).user.tenantId;
      const { productIds, published } = req.body;

      const placeholders = productIds.map(() => '?').join(',');
      const [result] = await pool.query(
        `UPDATE products SET published_in_store = ? WHERE id IN (${placeholders}) AND tenant_id = ?`,
        [published ? 1 : 0, ...productIds, tenantId]
      ) as any;

      res.json({
        success: true,
        data: { updatedCount: result.affectedRows, published: !!published }
      });
    } catch (error) {
      console.error('Bulk publish error:', error);
      res.status(500).json({ success: false, error: 'Error al actualizar publicación masiva' });
    }
  }
);

// GET /api/storefront/my-published — Productos publicados del tenant actual
router.get(
  '/my-published',
  authenticate,
  async (req: Request, res: Response) => {
    try {
      const tenantId = (req as any).user.tenantId;

      const [rows] = await pool.query(
        `SELECT id, name, category, brand, sale_price as salePrice, image_url as imageUrl,
                stock, IF(published_in_store, 1, 0) as publishedInStore
         FROM products
         WHERE tenant_id = ?
         ORDER BY name ASC`,
        [tenantId]
      ) as any;

      // Ensure publishedInStore is a proper boolean (mysql2 may return Buffer for TINYINT/BIT)
      const data = (rows as any[]).map((r: any) => ({
        ...r,
        publishedInStore: Number(r.publishedInStore) === 1,
      }));

      res.json({ success: true, data });
    } catch (error) {
      console.error('My published error:', error);
      res.status(500).json({ success: false, error: 'Error al obtener productos' });
    }
  }
);

export const storefrontRoutes = router;
