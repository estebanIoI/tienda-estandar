-- ============================================
-- SEED EJECUTABLE: Perfumes BOM (Productos Compuestos)
-- Tenant: tenant-demo-001
-- Ejecutar: mysql -u root -p stockpro_db < seed_perfumes.sql
-- ============================================

USE stockpro_db;

-- 1. Crear tabla de recetas si no existe
CREATE TABLE IF NOT EXISTS product_recipes (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(36) NOT NULL,
    ingredient_id VARCHAR(36) NOT NULL,
    quantity DECIMAL(10,3) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_id) REFERENCES products(id) ON DELETE RESTRICT,
    INDEX idx_recipe_product (product_id),
    INDEX idx_recipe_tenant (tenant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Categorias
INSERT IGNORE INTO categories (id, tenant_id, name, description) VALUES
('perfumes', 'tenant-demo-001', 'Perfumes', 'Perfumes terminados por referencia'),
('insumos', 'tenant-demo-001', 'Insumos', 'Materia prima para produccion');

-- 3. IDs fijos (para poder re-ejecutar sin duplicados)
SET @t = 'tenant-demo-001' COLLATE utf8mb4_unicode_ci;

-- Perfumes terminados
SET @p100 = 'PERF-LW-100-ID' COLLATE utf8mb4_unicode_ci;
SET @p50  = 'PERF-LW-050-ID' COLLATE utf8mb4_unicode_ci;
SET @p30  = 'PERF-LW-030-ID' COLLATE utf8mb4_unicode_ci;

-- Insumos
SET @ext   = 'MAT-EXT-LW-ID'  COLLATE utf8mb4_unicode_ci;
SET @e100  = 'MAT-ENV-100-ID'  COLLATE utf8mb4_unicode_ci;
SET @e50   = 'MAT-ENV-050-ID'  COLLATE utf8mb4_unicode_ci;
SET @e30   = 'MAT-ENV-030-ID'  COLLATE utf8mb4_unicode_ci;
SET @b100  = 'MAT-BOX-100-ID'  COLLATE utf8mb4_unicode_ci;
SET @b50   = 'MAT-BOX-050-ID'  COLLATE utf8mb4_unicode_ci;
SET @b30   = 'MAT-BOX-030-ID'  COLLATE utf8mb4_unicode_ci;

-- 4. Limpiar datos previos (seguro para re-ejecutar)
DELETE FROM product_recipes WHERE tenant_id = @t AND product_id IN (@p100, @p50, @p30);
DELETE FROM products WHERE tenant_id = @t AND id IN (@p100, @p50, @p30, @ext, @e100, @e50, @e30, @b100, @b50, @b30);

-- ============================================
-- 5. INSUMOS (Materia Prima)
-- ============================================

-- Extracto base - $1,700 por unidad
INSERT INTO products (id, tenant_id, name, category, product_type, brand, purchase_price, sale_price, sku, stock, reorder_point, entry_date, description)
VALUES (@ext, @t, 'Extracto Larry White (Unidad Base)', 'insumos', 'otros', 'Larry White', 1700, 0, 'MAT-EXT-LW', 5000, 100, CURDATE(), 'Insumo base para perfumes');

-- Envases
INSERT INTO products (id, tenant_id, name, category, product_type, brand, purchase_price, sale_price, sku, stock, reorder_point, entry_date, description) VALUES
(@e100, @t, 'Envase Lacoste 100ML', 'insumos', 'otros', 'Generico', 1900, 0, 'MAT-ENV-100', 500, 20, CURDATE(), 'Envase vidrio 100ML'),
(@e50,  @t, 'Envase Lacoste 50ML',  'insumos', 'otros', 'Generico', 600,  0, 'MAT-ENV-050', 500, 20, CURDATE(), 'Envase vidrio 50ML'),
(@e30,  @t, 'Envase Lacoste 30ML',  'insumos', 'otros', 'Generico', 400,  0, 'MAT-ENV-030', 500, 20, CURDATE(), 'Envase vidrio 30ML');

-- Cajas
INSERT INTO products (id, tenant_id, name, category, product_type, brand, purchase_price, sale_price, sku, stock, reorder_point, entry_date, description) VALUES
(@b100, @t, 'Caja 100 ML',   'insumos', 'otros', 'Larry White', 0, 0, 'MAT-BOX-100', 500, 20, CURDATE(), 'Caja para perfume 100ML'),
(@b50,  @t, 'Caja 30-50 ML', 'insumos', 'otros', 'Larry White', 0, 0, 'MAT-BOX-050', 500, 20, CURDATE(), 'Caja para perfume 30-50ML'),
(@b30,  @t, 'Caja 30-50 ML', 'insumos', 'otros', 'Larry White', 0, 0, 'MAT-BOX-030', 500, 20, CURDATE(), 'Caja para perfume 30ML');

-- ============================================
-- 6. PERFUMES TERMINADOS (Productos Compuestos)
-- Precio = referencia / 1.19 para que con IVA 19% cuadre
-- ============================================

INSERT INTO products (id, tenant_id, name, category, product_type, brand, purchase_price, sale_price, sku, stock, reorder_point, entry_date, description) VALUES
(@p100, @t, 'Perfume Larry White 100ML', 'perfumes', 'perfumes', 'Larry White', 75000, 63025.21, 'PERF-LW-100', 0, 0, CURDATE(), 'REFERENCIA 100 ML VALOR $75.000'),
(@p50,  @t, 'Perfume Larry White 50ML',  'perfumes', 'perfumes', 'Larry White', 38000, 31932.77, 'PERF-LW-050', 0, 0, CURDATE(), 'REFERENCIA 50 ML VALOR $38.000'),
(@p30,  @t, 'Perfume Larry White 30ML',  'perfumes', 'perfumes', 'Larry White', 22000, 18487.39, 'PERF-LW-030', 0, 0, CURDATE(), 'REFERENCIA 30 ML VALOR $22.000');

-- ============================================
-- 7. RECETAS BOM
-- ============================================

-- 100ML = 43 extracto + 1 envase 100 + 1 caja 100
INSERT INTO product_recipes (id, tenant_id, product_id, ingredient_id, quantity) VALUES
(UUID(), @t, @p100, @ext,  43),
(UUID(), @t, @p100, @e100, 1),
(UUID(), @t, @p100, @b100, 1);

-- 50ML = 22 extracto + 1 envase 50 + 1 caja 50
INSERT INTO product_recipes (id, tenant_id, product_id, ingredient_id, quantity) VALUES
(UUID(), @t, @p50, @ext, 22),
(UUID(), @t, @p50, @e50, 1),
(UUID(), @t, @p50, @b50, 1);

-- 30ML = 13 extracto + 1 envase 30 + 1 caja 30
INSERT INTO product_recipes (id, tenant_id, product_id, ingredient_id, quantity) VALUES
(UUID(), @t, @p30, @ext, 13),
(UUID(), @t, @p30, @e30, 1),
(UUID(), @t, @p30, @b30, 1);

-- ============================================
-- 8. VERIFICACION
-- ============================================
SELECT '=== PERFUMES TERMINADOS ===' AS '';
SELECT
    p.name AS Producto,
    p.sku AS SKU,
    CONCAT('$', FORMAT(p.sale_price, 0)) AS 'Precio Base',
    CONCAT('$', FORMAT(p.sale_price * 0.19, 0)) AS 'IVA 19%',
    CONCAT('$', FORMAT(p.sale_price * 1.19, 0)) AS 'Total con IVA',
    p.stock AS 'Stock Fisico',
    (SELECT FLOOR(MIN(
        CASE WHEN pr.quantity > 0 THEN ing.stock / pr.quantity ELSE 0 END
    ))
    FROM product_recipes pr
    JOIN products ing ON ing.id = pr.ingredient_id
    WHERE pr.product_id = p.id) AS 'Stock Disponible (BOM)'
FROM products p
WHERE p.tenant_id = @t AND p.sku LIKE 'PERF-LW-%'
ORDER BY p.sale_price DESC;

SELECT '=== INSUMOS ===' AS '';
SELECT
    name AS Insumo,
    sku AS SKU,
    stock AS Stock,
    CONCAT('$', FORMAT(purchase_price, 0)) AS Costo
FROM products
WHERE tenant_id = @t AND sku LIKE 'MAT-%'
ORDER BY sku;

SELECT '=== RECETAS BOM ===' AS '';
SELECT
    p.name AS 'Perfume',
    ing.name AS 'Insumo Necesario',
    pr.quantity AS 'Cantidad x Unidad'
FROM product_recipes pr
JOIN products p ON p.id = pr.product_id
JOIN products ing ON ing.id = pr.ingredient_id
WHERE pr.tenant_id = @t
ORDER BY p.name, ing.name;

SELECT 'Seed ejecutado correctamente. Los perfumes apareceran en el POS con badge [Ref]' AS RESULTADO;
