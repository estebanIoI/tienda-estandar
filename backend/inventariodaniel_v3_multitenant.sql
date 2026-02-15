-- ============================================
-- BASE DE DATOS: StockPro Inventario Universal 3.0
-- Sistema Multi-Tenant con roles: superadmin, comerciante, vendedor
-- ============================================
-- ARQUITECTURA:
--   superadmin  → Dueño de la plataforma, gestiona comerciantes y ve todo
--   comerciante → Dueño de un negocio (tenant), gestiona su tienda
--   vendedor    → Empleado de un comerciante, opera dentro del tenant
--
-- Cada tabla de datos tiene tenant_id para aislamiento de datos
-- ============================================

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS stockpro_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE stockpro_db;

-- ============================================
-- TABLA: tenants (Negocios/Inquilinos)
-- Cada comerciante tiene un tenant que agrupa todos sus datos
-- ============================================
CREATE TABLE IF NOT EXISTS tenants (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    business_type VARCHAR(100) NULL COMMENT 'ropa, tienda, farmacia, ferreteria, etc.',
    status ENUM('activo', 'suspendido', 'cancelado') NOT NULL DEFAULT 'activo',
    plan ENUM('basico', 'profesional', 'empresarial') NOT NULL DEFAULT 'basico',
    max_users INT NOT NULL DEFAULT 5,
    max_products INT NOT NULL DEFAULT 500,
    owner_id VARCHAR(36) NULL COMMENT 'Se actualiza despues de crear el usuario comerciante',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_tenant_status (status),
    INDEX idx_tenant_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: users (Usuarios del sistema)
-- Roles: superadmin, comerciante, vendedor
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NULL COMMENT 'NULL para superadmin',
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('superadmin', 'comerciante', 'vendedor') NOT NULL DEFAULT 'vendedor',
    avatar VARCHAR(500) NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    INDEX idx_users_tenant (tenant_id),
    INDEX idx_users_role (role),
    INDEX idx_users_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- FK circular: tenants.owner_id -> users.id
ALTER TABLE tenants ADD CONSTRAINT fk_tenant_owner
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL;

-- ============================================
-- TABLA: store_info (Informacion de la tienda por tenant)
-- ============================================
CREATE TABLE IF NOT EXISTS store_info (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tenant_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(500) NULL,
    phone VARCHAR(50) NULL,
    tax_id VARCHAR(50) NULL,
    email VARCHAR(255) NULL,
    logo_url VARCHAR(500) NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    UNIQUE INDEX idx_store_tenant (tenant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: categories (Categorias de productos por tenant)
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(50) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255) NULL,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    UNIQUE INDEX idx_category_tenant_name (tenant_id, name),
    INDEX idx_category_tenant (tenant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: suppliers (Proveedores por tenant)
-- ============================================
CREATE TABLE IF NOT EXISTS suppliers (
    id VARCHAR(50) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL,
    name VARCHAR(200) NOT NULL,
    contact_name VARCHAR(200) NULL,
    phone VARCHAR(20) NULL,
    email VARCHAR(100) NULL,
    address TEXT NULL,
    city VARCHAR(100) NULL,
    country VARCHAR(100) DEFAULT 'Colombia',
    tax_id VARCHAR(50) NULL,
    payment_terms VARCHAR(100) NULL,
    notes TEXT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    INDEX idx_supplier_tenant (tenant_id),
    INDEX idx_supplier_name (name),
    INDEX idx_supplier_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: products (Productos - Universal, por tenant)
-- ============================================
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,

    -- Tipo de producto
    product_type ENUM(
        'general', 'alimentos', 'bebidas', 'ropa', 'electronica',
        'farmacia', 'ferreteria', 'libreria', 'juguetes', 'cosmetica',
        'perfumes', 'deportes', 'hogar', 'mascotas', 'otros'
    ) NOT NULL DEFAULT 'general',

    -- Campos comunes
    brand VARCHAR(100) NULL,
    model VARCHAR(100) NULL,
    description TEXT NULL,
    purchase_price DECIMAL(12, 2) NOT NULL DEFAULT 0,
    sale_price DECIMAL(12, 2) NOT NULL,
    sku VARCHAR(50) NOT NULL,
    barcode VARCHAR(100) DEFAULT NULL,
    stock INT NOT NULL DEFAULT 0,
    reorder_point INT NOT NULL DEFAULT 5,
    supplier VARCHAR(255) NULL,
    supplier_id VARCHAR(50) NULL,
    entry_date DATE NOT NULL,
    image_url VARCHAR(500) NULL,
    location_in_store VARCHAR(100) NULL,
    notes TEXT NULL,
    tags JSON NULL,

    -- Campos ALIMENTOS / BEBIDAS / FARMACIA / COSMETICA / MASCOTAS
    expiry_date DATE NULL,
    batch_number VARCHAR(50) NULL,
    net_weight DECIMAL(10,3) NULL,
    weight_unit ENUM('g', 'kg', 'ml', 'l', 'oz', 'lb', 'unidad') NULL,
    sanitary_registration VARCHAR(100) NULL,
    storage_temperature VARCHAR(50) NULL,
    ingredients TEXT NULL,
    nutritional_info TEXT NULL,
    alcohol_content DECIMAL(5,2) NULL,
    allergens TEXT NULL,

    -- Campos ROPA / DEPORTES
    size VARCHAR(20) NULL,
    color VARCHAR(50) NULL,
    material VARCHAR(100) NULL,
    gender ENUM('hombre', 'mujer', 'unisex', 'niño', 'niña') NULL,
    season ENUM('verano', 'invierno', 'primavera', 'otoño', 'todo_año') NULL,
    garment_type VARCHAR(50) NULL,
    washing_instructions TEXT NULL,
    country_of_origin VARCHAR(50) NULL,

    -- Campos ELECTRONICA
    serial_number VARCHAR(100) NULL,
    warranty_months INT NULL,
    technical_specs TEXT NULL,
    voltage VARCHAR(20) NULL,
    power_watts INT NULL,
    compatibility TEXT NULL,
    includes_accessories TEXT NULL,
    product_condition ENUM('nuevo', 'reacondicionado', 'usado', 'exhibición') DEFAULT 'nuevo',

    -- Campos FARMACIA
    active_ingredient VARCHAR(200) NULL,
    concentration VARCHAR(50) NULL,
    requires_prescription BOOLEAN DEFAULT FALSE,
    administration_route VARCHAR(50) NULL,
    presentation VARCHAR(50) NULL,
    units_per_package INT NULL,
    laboratory VARCHAR(100) NULL,
    contraindications TEXT NULL,

    -- Campos FERRETERIA
    dimensions VARCHAR(50) NULL,
    weight DECIMAL(10,3) NULL,
    caliber VARCHAR(20) NULL,
    resistance VARCHAR(50) NULL,
    finish VARCHAR(50) NULL,
    recommended_use TEXT NULL,

    -- Campos LIBRERIA
    author VARCHAR(200) NULL,
    publisher VARCHAR(100) NULL,
    isbn VARCHAR(20) NULL,
    pages INT NULL,
    language VARCHAR(50) NULL,
    publication_year INT NULL,
    edition VARCHAR(50) NULL,
    book_format ENUM('pasta_dura', 'pasta_blanda', 'digital', 'audio') NULL,

    -- Campos JUGUETES
    recommended_age VARCHAR(50) NULL,
    number_of_players VARCHAR(20) NULL,
    game_type VARCHAR(50) NULL,
    requires_batteries BOOLEAN NULL,
    package_dimensions VARCHAR(50) NULL,
    package_contents TEXT NULL,
    safety_warnings TEXT NULL,

    -- Storefront / Tienda Online
    published_in_store BOOLEAN NOT NULL DEFAULT FALSE,

    -- Auditoria
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(50) NULL,
    updated_by VARCHAR(50) NULL,

    -- Indices
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL,
    UNIQUE INDEX idx_product_tenant_sku (tenant_id, sku),
    UNIQUE INDEX idx_product_tenant_barcode (tenant_id, barcode),
    INDEX idx_product_tenant (tenant_id),
    INDEX idx_category (category),
    INDEX idx_sku (sku),
    INDEX idx_barcode (barcode),
    INDEX idx_stock (stock),
    INDEX idx_product_type (product_type),
    INDEX idx_brand (brand),
    INDEX idx_expiry_date (expiry_date),
    INDEX idx_serial_number (serial_number),
    INDEX idx_isbn (isbn),
    INDEX idx_published_store (published_in_store)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: customers (Clientes por tenant)
-- ============================================
CREATE TABLE IF NOT EXISTS customers (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL,
    cedula VARCHAR(20) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NULL,
    email VARCHAR(255) NULL,
    address VARCHAR(500) NULL,
    credit_limit DECIMAL(12, 2) NOT NULL DEFAULT 0,
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    UNIQUE INDEX idx_customer_tenant_cedula (tenant_id, cedula),
    INDEX idx_customer_tenant (tenant_id),
    INDEX idx_customers_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: sales (Ventas por tenant)
-- ============================================
CREATE TABLE IF NOT EXISTS sales (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL,
    invoice_number VARCHAR(20) NOT NULL,
    customer_id VARCHAR(36) NULL,
    customer_name VARCHAR(255) NULL,
    customer_phone VARCHAR(50) NULL,
    customer_email VARCHAR(255) NULL,
    subtotal DECIMAL(12, 2) NOT NULL,
    tax DECIMAL(12, 2) NOT NULL DEFAULT 0,
    discount DECIMAL(12, 2) NOT NULL DEFAULT 0,
    total DECIMAL(12, 2) NOT NULL,
    payment_method ENUM('efectivo', 'tarjeta', 'transferencia', 'fiado') NOT NULL,
    amount_paid DECIMAL(12, 2) NOT NULL,
    change_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
    seller_id VARCHAR(36) NULL,
    seller_name VARCHAR(255) NOT NULL,
    cash_session_id VARCHAR(36) NULL,
    status ENUM('completada', 'anulada') NOT NULL DEFAULT 'completada',
    credit_status ENUM('pendiente', 'parcial', 'pagado') DEFAULT NULL,
    due_date DATE NULL,
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE INDEX idx_sale_tenant_invoice (tenant_id, invoice_number),
    INDEX idx_sale_tenant (tenant_id),
    INDEX idx_invoice (invoice_number),
    INDEX idx_status (status),
    INDEX idx_created (created_at),
    INDEX idx_sales_credit_status (credit_status),
    INDEX idx_sales_payment_method (payment_method),
    INDEX idx_sales_due_date (due_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: sale_items (Items de cada venta)
-- ============================================
CREATE TABLE IF NOT EXISTS sale_items (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL,
    sale_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(36) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_sku VARCHAR(50) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(12, 2) NOT NULL,
    discount DECIMAL(5, 2) NOT NULL DEFAULT 0,
    subtotal DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    INDEX idx_sale_items_tenant (tenant_id),
    INDEX idx_sale (sale_id),
    INDEX idx_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: stock_movements (Movimientos de stock)
-- ============================================
CREATE TABLE IF NOT EXISTS stock_movements (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(36) NOT NULL,
    type ENUM('entrada', 'salida', 'ajuste', 'venta', 'devolucion') NOT NULL,
    quantity INT NOT NULL,
    previous_stock INT NOT NULL,
    new_stock INT NOT NULL,
    reason VARCHAR(255) NULL,
    reference_id VARCHAR(36) NULL,
    user_id VARCHAR(36) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_stock_tenant (tenant_id),
    INDEX idx_stock_product (product_id),
    INDEX idx_stock_type (type),
    INDEX idx_stock_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: invoice_sequence (Secuencia de facturas por tenant)
-- ============================================
CREATE TABLE IF NOT EXISTS invoice_sequence (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tenant_id VARCHAR(36) NOT NULL,
    prefix VARCHAR(10) NOT NULL DEFAULT 'FAC',
    current_number INT NOT NULL DEFAULT 0,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    UNIQUE INDEX idx_invoice_seq_tenant (tenant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: credit_payments (Abonos a creditos)
-- ============================================
CREATE TABLE IF NOT EXISTS credit_payments (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL,
    sale_id VARCHAR(36) NOT NULL,
    customer_id VARCHAR(36) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    payment_method ENUM('efectivo', 'tarjeta', 'transferencia') NOT NULL,
    receipt_number VARCHAR(20) NULL,
    notes TEXT NULL,
    received_by VARCHAR(36) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE RESTRICT,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT,
    FOREIGN KEY (received_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_credit_payments_tenant (tenant_id),
    INDEX idx_credit_payments_sale (sale_id),
    INDEX idx_credit_payments_customer (customer_id),
    INDEX idx_credit_payments_date (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: payment_receipt_sequence (Secuencia de recibos por tenant)
-- ============================================
CREATE TABLE IF NOT EXISTS payment_receipt_sequence (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tenant_id VARCHAR(36) NOT NULL,
    prefix VARCHAR(10) NOT NULL DEFAULT 'REC',
    current_number INT NOT NULL DEFAULT 0,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    UNIQUE INDEX idx_receipt_seq_tenant (tenant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: store_locations (Ubicaciones en tienda por tenant)
-- ============================================
CREATE TABLE IF NOT EXISTS store_locations (
    id VARCHAR(50) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL,
    code VARCHAR(20) NOT NULL,
    name VARCHAR(100) NOT NULL,
    zone VARCHAR(50) NULL,
    description TEXT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    UNIQUE INDEX idx_location_tenant_code (tenant_id, code),
    INDEX idx_location_tenant (tenant_id),
    INDEX idx_location_zone (zone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: product_alerts (Alertas de productos)
-- ============================================
CREATE TABLE IF NOT EXISTS product_alerts (
    id VARCHAR(50) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(50) NOT NULL,
    alert_type ENUM('vencimiento', 'stock_bajo', 'garantia_proxima', 'reorden', 'otro') NOT NULL,
    alert_date DATE NOT NULL,
    priority ENUM('baja', 'media', 'alta', 'critica') DEFAULT 'media',
    message TEXT NULL,
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMP NULL,
    resolved_by VARCHAR(50) NULL,
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_alert_tenant (tenant_id),
    INDEX idx_alert_date (alert_date, is_resolved),
    INDEX idx_alert_type (alert_type),
    INDEX idx_alert_priority (priority, is_resolved)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: price_history (Historial de precios)
-- ============================================
CREATE TABLE IF NOT EXISTS price_history (
    id VARCHAR(50) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(50) NOT NULL,
    old_cost_price DECIMAL(10,2) NULL,
    new_cost_price DECIMAL(10,2) NULL,
    old_sale_price DECIMAL(10,2) NULL,
    new_sale_price DECIMAL(10,2) NULL,
    reason VARCHAR(200) NULL,
    changed_by VARCHAR(50) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_price_tenant (tenant_id),
    INDEX idx_price_product_date (product_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: cash_sessions (Sesiones de caja por tenant)
-- ============================================
CREATE TABLE IF NOT EXISTS cash_sessions (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL,
    opened_by VARCHAR(36) NOT NULL,
    opened_by_name VARCHAR(255) NOT NULL,
    opening_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
    opened_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    closed_by VARCHAR(36) NULL,
    closed_by_name VARCHAR(255) NULL,
    closed_at TIMESTAMP NULL,
    total_cash_sales DECIMAL(12, 2) NULL DEFAULT 0,
    total_card_sales DECIMAL(12, 2) NULL DEFAULT 0,
    total_transfer_sales DECIMAL(12, 2) NULL DEFAULT 0,
    total_fiado_sales DECIMAL(12, 2) NULL DEFAULT 0,
    total_sales_count INT NULL DEFAULT 0,
    total_change_given DECIMAL(12, 2) NULL DEFAULT 0,
    total_cash_entries DECIMAL(12, 2) NULL DEFAULT 0,
    total_cash_withdrawals DECIMAL(12, 2) NULL DEFAULT 0,
    expected_cash DECIMAL(12, 2) NULL,
    actual_cash DECIMAL(12, 2) NULL,
    difference DECIMAL(12, 2) NULL,
    status ENUM('abierta', 'cerrada') NOT NULL DEFAULT 'abierta',
    closing_status ENUM('cuadrado', 'sobrante', 'faltante') NULL,
    observations TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (opened_by) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (closed_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_cash_session_tenant (tenant_id),
    INDEX idx_cash_session_status (status),
    INDEX idx_cash_session_opened (opened_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: cash_movements (Entradas/Salidas de caja)
-- ============================================
CREATE TABLE IF NOT EXISTS cash_movements (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL,
    session_id VARCHAR(36) NOT NULL,
    type ENUM('entrada', 'salida') NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    reason VARCHAR(255) NOT NULL,
    notes TEXT NULL,
    created_by VARCHAR(36) NOT NULL,
    created_by_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (session_id) REFERENCES cash_sessions(id) ON DELETE RESTRICT,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_cash_movement_tenant (tenant_id),
    INDEX idx_cash_movement_session (session_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: audit_log (Registro de actividad - para superadmin)
-- ============================================
CREATE TABLE IF NOT EXISTS audit_log (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NULL,
    user_id VARCHAR(36) NULL,
    user_email VARCHAR(255) NULL,
    action VARCHAR(100) NOT NULL COMMENT 'login, create_product, delete_sale, etc.',
    entity_type VARCHAR(50) NULL COMMENT 'product, sale, user, tenant, etc.',
    entity_id VARCHAR(36) NULL,
    details JSON NULL,
    ip_address VARCHAR(45) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE SET NULL,
    INDEX idx_audit_tenant (tenant_id),
    INDEX idx_audit_user (user_id),
    INDEX idx_audit_action (action),
    INDEX idx_audit_date (created_at),
    INDEX idx_audit_entity (entity_type, entity_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: discount_coupons (Cupones de descuento por tenant)
-- ============================================
CREATE TABLE IF NOT EXISTS discount_coupons (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL,
    code VARCHAR(50) NOT NULL,
    description VARCHAR(255) NULL,
    discount_type ENUM('porcentaje', 'fijo') NOT NULL DEFAULT 'porcentaje',
    discount_value DECIMAL(12, 2) NOT NULL,
    min_purchase DECIMAL(12, 2) NULL COMMENT 'Compra mínima requerida',
    max_uses INT NULL COMMENT 'NULL = ilimitado',
    times_used INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    expires_at TIMESTAMP NULL COMMENT 'NULL = sin expiración',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    UNIQUE INDEX idx_coupon_tenant_code (tenant_id, code),
    INDEX idx_coupon_tenant (tenant_id),
    INDEX idx_coupon_code (code),
    INDEX idx_coupon_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- DATOS INICIALES
-- ============================================

-- 1. Usuario superadmin (sin tenant)
-- Password: superadmin123 (hash bcrypt)
INSERT INTO users (id, tenant_id, email, password, name, role, is_active) VALUES
('usr-superadmin-001', NULL, 'superadmin@stockpro.com', '$2a$10$0IZ8BSUNFt48w2LMZjmT8uc.rfa3lU4HPJqmaLfDMKpKzR/G3Hx0W', 'Super Administrador', 'superadmin', TRUE);

-- 2. Tenant demo: Tienda de Ropa
INSERT INTO tenants (id, name, slug, business_type, status, plan, max_users, max_products) VALUES
('tenant-demo-001', 'Tienda de Ropa Demo', 'tienda-ropa-demo', 'ropa', 'activo', 'profesional', 10, 1000);

-- 3. Usuario comerciante (dueño del tenant demo)
-- Password: admin123
INSERT INTO users (id, tenant_id, email, password, name, role, is_active) VALUES
('usr-comerciante-001', 'tenant-demo-001', 'comerciante@stockpro.com', '$2a$10$0IZ8BSUNFt48w2LMZjmT8uc.rfa3lU4HPJqmaLfDMKpKzR/G3Hx0W', 'Comerciante Demo', 'comerciante', TRUE);

-- Actualizar owner del tenant
UPDATE tenants SET owner_id = 'usr-comerciante-001' WHERE id = 'tenant-demo-001';

-- 4. Usuario vendedor del tenant demo
-- Password: admin123
INSERT INTO users (id, tenant_id, email, password, name, role, is_active) VALUES
('usr-vendedor-001', 'tenant-demo-001', 'vendedor@stockpro.com', '$2a$10$0IZ8BSUNFt48w2LMZjmT8uc.rfa3lU4HPJqmaLfDMKpKzR/G3Hx0W', 'Vendedor Demo', 'vendedor', TRUE);

-- 5. Info de la tienda del tenant demo
INSERT INTO store_info (tenant_id, name, address, phone, tax_id, email) VALUES
('tenant-demo-001', 'Tienda de Ropa Demo', 'Calle Principal #123, Centro Comercial Plaza', '+57 300 123 4567', '900.123.456-7', 'contacto@stockpro.com');

-- 6. Categorias del tenant demo
INSERT INTO categories (id, tenant_id, name, description) VALUES
('camisas', 'tenant-demo-001', 'Camisas', 'Camisas formales e informales'),
('pantalones', 'tenant-demo-001', 'Pantalones', 'Pantalones de todo tipo'),
('zapatos', 'tenant-demo-001', 'Zapatos', 'Calzado masculino'),
('accesorios', 'tenant-demo-001', 'Accesorios', 'Cinturones, corbatas, etc'),
('ropa-interior', 'tenant-demo-001', 'Ropa Interior', 'Boxers, camisetas interiores'),
('abrigos', 'tenant-demo-001', 'Abrigos', 'Abrigos y chaquetas'),
('trajes', 'tenant-demo-001', 'Trajes', 'Trajes formales'),
('deportivo', 'tenant-demo-001', 'Deportivo', 'Ropa deportiva');

-- 7. Proveedores del tenant demo
INSERT INTO suppliers (id, tenant_id, name, contact_name, phone, email, city) VALUES
('sup-001', 'tenant-demo-001', 'Distribuidora Premium', 'Carlos Lopez', '3001234567', 'contacto@premium.com', 'Bogota'),
('sup-002', 'tenant-demo-001', 'Importadora Textil', 'Ana Garcia', '3007654321', 'ventas@importadora.com', 'Medellin');

-- 8. Productos del tenant demo
INSERT INTO products (id, tenant_id, name, category, product_type, brand, size, color, purchase_price, sale_price, sku, stock, reorder_point, supplier, entry_date) VALUES
('prod-001', 'tenant-demo-001', 'Camisa Oxford Slim Fit', 'camisas', 'ropa', 'Tommy Hilfiger', 'M', 'Azul Cielo', 95000, 159900, 'CAM-TH-001', 25, 5, 'Distribuidora Premium', '2024-01-15'),
('prod-002', 'tenant-demo-001', 'Pantalon Chino Classic', 'pantalones', 'ropa', 'Dockers', 'L', 'Beige', 75000, 129900, 'PAN-DOC-001', 3, 5, 'Importadora Textil', '2024-01-10'),
('prod-003', 'tenant-demo-001', 'Zapatos Derby Cuero', 'zapatos', 'ropa', 'Velez', 'L', 'Marron', 200000, 349900, 'ZAP-VEL-001', 8, 3, 'Velez Colombia', '2024-01-20'),
('prod-004', 'tenant-demo-001', 'Cinturon Piel Italiano', 'accesorios', 'ropa', 'Calvin Klein', 'M', 'Negro', 55000, 99900, 'ACC-CK-001', 15, 5, 'CK Distribuidor', '2024-02-01'),
('prod-005', 'tenant-demo-001', 'Traje Ejecutivo Negro', 'trajes', 'ropa', 'Arturo Calle', 'L', 'Negro', 500000, 899900, 'TRA-AC-001', 0, 2, 'Arturo Calle SA', '2024-01-25'),
('prod-006', 'tenant-demo-001', 'Sudadera Deportiva', 'deportivo', 'ropa', 'Nike', 'M', 'Gris', 80000, 139900, 'DEP-NIK-001', 12, 5, 'Nike Colombia', '2024-02-05'),
('prod-007', 'tenant-demo-001', 'Abrigo Lana Premium', 'abrigos', 'ropa', 'Zara Man', 'XL', 'Gris Oscuro', 280000, 449900, 'ABR-ZAR-001', 4, 3, 'Inditex Colombia', '2024-01-30'),
('prod-008', 'tenant-demo-001', 'Boxer Pack x3', 'ropa-interior', 'ropa', 'Calvin Klein', 'M', 'Surtido', 50000, 89900, 'INT-CK-001', 30, 10, 'CK Distribuidor', '2024-02-10');

-- 9. Clientes del tenant demo
INSERT INTO customers (id, tenant_id, cedula, name, phone, email, credit_limit) VALUES
('cust-001', 'tenant-demo-001', '1098765432', 'Carlos Mendez', '+57 310 555 1234', 'carlos.mendez@email.com', 500000),
('cust-002', 'tenant-demo-001', '1087654321', 'Roberto Garcia', '+57 320 555 5678', 'roberto.garcia@email.com', 300000),
('cust-003', 'tenant-demo-001', '1076543210', 'Juan Perez', '+57 315 555 9012', 'juan.perez@email.com', 200000);

-- 10. Secuencias del tenant demo
INSERT INTO invoice_sequence (tenant_id, prefix, current_number) VALUES ('tenant-demo-001', 'FAC', 3);
INSERT INTO payment_receipt_sequence (tenant_id, prefix, current_number) VALUES ('tenant-demo-001', 'REC', 0);

-- 11. Ubicaciones del tenant demo
INSERT INTO store_locations (id, tenant_id, code, name, zone, description) VALUES
('loc-001', 'tenant-demo-001', 'EST-A1', 'Estante A1', 'Zona A', 'Estanteria principal - Nivel 1'),
('loc-002', 'tenant-demo-001', 'EST-A2', 'Estante A2', 'Zona A', 'Estanteria principal - Nivel 2'),
('loc-003', 'tenant-demo-001', 'REF-01', 'Refrigerador 1', 'Zona Fria', 'Refrigerador para lacteos y bebidas'),
('loc-004', 'tenant-demo-001', 'VIT-01', 'Vitrina 1', 'Exhibicion', 'Vitrina de productos premium'),
('loc-005', 'tenant-demo-001', 'BOD-01', 'Bodega Principal', 'Bodega', 'Almacenamiento general');

-- 12. Ventas del tenant demo
INSERT INTO sales (id, tenant_id, invoice_number, customer_id, customer_name, subtotal, tax, discount, total, payment_method, amount_paid, change_amount, seller_id, seller_name, status, created_at) VALUES
('sale-001', 'tenant-demo-001', 'FAC-00001', 'cust-001', 'Carlos Mendez', 419700, 79743, 0, 499443, 'tarjeta', 499443, 0, 'usr-vendedor-001', 'Vendedor Demo', 'completada', '2024-02-15 10:30:00'),
('sale-002', 'tenant-demo-001', 'FAC-00002', 'cust-002', 'Roberto Garcia', 329916, 62684, 34990, 392581, 'efectivo', 400000, 7419, 'usr-vendedor-001', 'Vendedor Demo', 'completada', '2024-02-15 14:45:00'),
('sale-003', 'tenant-demo-001', 'FAC-00003', 'cust-001', 'Carlos Mendez', 419700, 79743, 0, 499443, 'transferencia', 499443, 0, 'usr-comerciante-001', 'Comerciante Demo', 'completada', '2024-02-16 09:15:00');

-- 13. Items de ventas
INSERT INTO sale_items (id, tenant_id, sale_id, product_id, product_name, product_sku, quantity, unit_price, discount, subtotal) VALUES
('item-001', 'tenant-demo-001', 'sale-001', 'prod-001', 'Camisa Oxford Slim Fit', 'CAM-TH-001', 2, 159900, 0, 319800),
('item-002', 'tenant-demo-001', 'sale-001', 'prod-004', 'Cinturon Piel Italiano', 'ACC-CK-001', 1, 99900, 0, 99900),
('item-003', 'tenant-demo-001', 'sale-002', 'prod-003', 'Zapatos Derby Cuero', 'ZAP-VEL-001', 1, 349900, 10, 314910),
('item-004', 'tenant-demo-001', 'sale-003', 'prod-006', 'Sudadera Deportiva', 'DEP-NIK-001', 3, 139900, 0, 419700);

-- 14. Movimientos de stock
INSERT INTO stock_movements (id, tenant_id, product_id, type, quantity, previous_stock, new_stock, reason, reference_id, user_id, created_at) VALUES
('mov-001', 'tenant-demo-001', 'prod-001', 'venta', 2, 27, 25, 'Venta FAC-00001', 'sale-001', 'usr-vendedor-001', '2024-02-15 10:30:00'),
('mov-002', 'tenant-demo-001', 'prod-004', 'venta', 1, 16, 15, 'Venta FAC-00001', 'sale-001', 'usr-vendedor-001', '2024-02-15 10:30:00'),
('mov-003', 'tenant-demo-001', 'prod-003', 'venta', 1, 9, 8, 'Venta FAC-00002', 'sale-002', 'usr-vendedor-001', '2024-02-15 14:45:00'),
('mov-004', 'tenant-demo-001', 'prod-006', 'venta', 3, 15, 12, 'Venta FAC-00003', 'sale-003', 'usr-comerciante-001', '2024-02-16 09:15:00');

-- ============================================
-- VISTAS UTILES (tenant-aware)
-- ============================================

-- Vista de productos con estado de stock
CREATE OR REPLACE VIEW v_products_stock_status AS
SELECT
    p.*,
    CASE
        WHEN p.stock = 0 THEN 'agotado'
        WHEN p.stock <= p.reorder_point THEN 'bajo'
        ELSE 'suficiente'
    END AS stock_status
FROM products p;

-- Vista de ventas con detalle
CREATE OR REPLACE VIEW v_sales_detail AS
SELECT
    s.*,
    COUNT(si.id) AS total_items,
    SUM(si.quantity) AS total_quantity
FROM sales s
LEFT JOIN sale_items si ON s.id = si.sale_id
GROUP BY s.id;

-- Vista de productos proximos a vencer
CREATE OR REPLACE VIEW v_products_expiring_soon AS
SELECT
    p.*,
    c.name as category_name,
    DATEDIFF(p.expiry_date, CURDATE()) as days_until_expiry
FROM products p
LEFT JOIN categories c ON p.category = c.id AND p.tenant_id = c.tenant_id
WHERE p.expiry_date IS NOT NULL
  AND p.expiry_date <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)
  AND p.expiry_date >= CURDATE()
ORDER BY p.expiry_date ASC;

-- Vista de productos con stock bajo
CREATE OR REPLACE VIEW v_products_low_stock AS
SELECT
    p.*,
    c.name as category_name
FROM products p
LEFT JOIN categories c ON p.category = c.id AND p.tenant_id = c.tenant_id
WHERE p.stock <= p.reorder_point
  AND p.stock >= 0
ORDER BY (p.stock - p.reorder_point) ASC;

-- Vista de saldos de clientes
CREATE OR REPLACE VIEW v_customer_balances AS
SELECT
    c.id AS customer_id,
    c.tenant_id,
    c.cedula,
    c.name AS customer_name,
    c.phone,
    c.email,
    c.address,
    c.credit_limit,
    c.notes,
    COALESCE((
        SELECT SUM(s.total)
        FROM sales s
        WHERE s.customer_id = c.id
        AND s.payment_method = 'fiado'
        AND s.status = 'completada'
    ), 0) AS total_credit,
    COALESCE((
        SELECT SUM(cp.amount)
        FROM credit_payments cp
        WHERE cp.customer_id = c.id
    ), 0) AS total_paid,
    COALESCE((
        SELECT SUM(s.total)
        FROM sales s
        WHERE s.customer_id = c.id
        AND s.payment_method = 'fiado'
        AND s.status = 'completada'
    ), 0) - COALESCE((
        SELECT SUM(cp.amount)
        FROM credit_payments cp
        WHERE cp.customer_id = c.id
    ), 0) AS balance,
    c.created_at,
    c.updated_at
FROM customers c;

-- ============================================
-- VISTA PARA SUPERADMIN: Resumen de todos los tenants
-- ============================================
CREATE OR REPLACE VIEW v_tenants_summary AS
SELECT
    t.id AS tenant_id,
    t.name AS tenant_name,
    t.slug,
    t.business_type,
    t.status,
    t.plan,
    t.created_at,
    u.name AS owner_name,
    u.email AS owner_email,
    (SELECT COUNT(*) FROM users WHERE tenant_id = t.id) AS total_users,
    (SELECT COUNT(*) FROM products WHERE tenant_id = t.id) AS total_products,
    (SELECT COUNT(*) FROM customers WHERE tenant_id = t.id) AS total_customers,
    (SELECT COALESCE(SUM(total), 0) FROM sales WHERE tenant_id = t.id AND status = 'completada') AS total_sales_amount,
    (SELECT COUNT(*) FROM sales WHERE tenant_id = t.id AND status = 'completada') AS total_sales_count,
    (SELECT COALESCE(SUM(stock * sale_price), 0) FROM products WHERE tenant_id = t.id) AS inventory_value
FROM tenants t
LEFT JOIN users u ON t.owner_id = u.id;

-- ============================================
-- PROCEDIMIENTOS ALMACENADOS (tenant-aware)
-- ============================================

DELIMITER //

-- Generar numero de factura por tenant
CREATE PROCEDURE sp_generate_invoice_number(IN p_tenant_id VARCHAR(36), OUT new_invoice VARCHAR(20))
BEGIN
    DECLARE current_num INT;
    DECLARE prefix_val VARCHAR(10);

    SELECT current_number, prefix INTO current_num, prefix_val
    FROM invoice_sequence
    WHERE tenant_id = p_tenant_id
    FOR UPDATE;

    SET current_num = current_num + 1;

    UPDATE invoice_sequence SET current_number = current_num WHERE tenant_id = p_tenant_id;

    SET new_invoice = CONCAT(prefix_val, '-', LPAD(current_num, 5, '0'));
END //

-- Registrar movimiento de stock por tenant
CREATE PROCEDURE sp_register_stock_movement(
    IN p_tenant_id VARCHAR(36),
    IN p_product_id VARCHAR(36),
    IN p_type VARCHAR(20),
    IN p_quantity INT,
    IN p_reason VARCHAR(255),
    IN p_reference_id VARCHAR(36),
    IN p_user_id VARCHAR(36)
)
BEGIN
    DECLARE v_previous_stock INT;
    DECLARE v_new_stock INT;
    DECLARE v_movement_id VARCHAR(36);

    SELECT stock INTO v_previous_stock FROM products WHERE id = p_product_id AND tenant_id = p_tenant_id FOR UPDATE;

    IF p_type IN ('entrada', 'devolucion') THEN
        SET v_new_stock = v_previous_stock + p_quantity;
    ELSE
        SET v_new_stock = v_previous_stock - p_quantity;
    END IF;

    IF v_new_stock < 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Stock insuficiente';
    END IF;

    UPDATE products SET stock = v_new_stock WHERE id = p_product_id AND tenant_id = p_tenant_id;

    SET v_movement_id = UUID();

    INSERT INTO stock_movements (id, tenant_id, product_id, type, quantity, previous_stock, new_stock, reason, reference_id, user_id)
    VALUES (v_movement_id, p_tenant_id, p_product_id, p_type, p_quantity, v_previous_stock, v_new_stock, p_reason, p_reference_id, p_user_id);
END //

-- Top productos vendidos por tenant
CREATE PROCEDURE sp_get_top_selling_products(IN p_tenant_id VARCHAR(36), IN p_limit INT)
BEGIN
    SELECT
        p.id,
        p.name,
        p.category,
        SUM(si.quantity) AS total_sold,
        SUM(si.subtotal) AS total_revenue
    FROM products p
    JOIN sale_items si ON p.id = si.product_id
    JOIN sales s ON si.sale_id = s.id
    WHERE s.status = 'completada' AND s.tenant_id = p_tenant_id
    GROUP BY p.id
    ORDER BY total_sold DESC
    LIMIT p_limit;
END //

-- Ventas por categoria por tenant
CREATE PROCEDURE sp_get_sales_by_category(IN p_tenant_id VARCHAR(36))
BEGIN
    SELECT
        p.category,
        SUM(si.quantity) AS total_quantity,
        SUM(si.subtotal) AS total_revenue
    FROM products p
    JOIN sale_items si ON p.id = si.product_id
    JOIN sales s ON si.sale_id = s.id
    WHERE s.status = 'completada' AND s.tenant_id = p_tenant_id
    GROUP BY p.category
    ORDER BY total_revenue DESC;
END //

-- Actualizar estado de credito
CREATE PROCEDURE sp_update_credit_status(IN p_sale_id VARCHAR(36))
BEGIN
    DECLARE v_total DECIMAL(12,2);
    DECLARE v_paid DECIMAL(12,2);
    DECLARE v_new_status VARCHAR(20);

    SELECT total INTO v_total FROM sales WHERE id = p_sale_id;

    SELECT COALESCE(SUM(amount), 0) INTO v_paid
    FROM credit_payments WHERE sale_id = p_sale_id;

    IF v_paid >= v_total THEN
        SET v_new_status = 'pagado';
    ELSEIF v_paid > 0 THEN
        SET v_new_status = 'parcial';
    ELSE
        SET v_new_status = 'pendiente';
    END IF;

    UPDATE sales SET credit_status = v_new_status WHERE id = p_sale_id;
END //

-- Generar numero de recibo por tenant
CREATE PROCEDURE sp_generate_receipt_number(IN p_tenant_id VARCHAR(36), OUT new_receipt VARCHAR(20))
BEGIN
    DECLARE current_num INT;
    DECLARE prefix_val VARCHAR(10);

    SELECT current_number, prefix INTO current_num, prefix_val
    FROM payment_receipt_sequence
    WHERE tenant_id = p_tenant_id
    FOR UPDATE;

    SET current_num = current_num + 1;

    UPDATE payment_receipt_sequence SET current_number = current_num WHERE tenant_id = p_tenant_id;

    SET new_receipt = CONCAT(prefix_val, '-', LPAD(current_num, 5, '0'));
END //

-- Generar alertas automaticas por tenant
CREATE PROCEDURE sp_generate_product_alerts(IN p_tenant_id VARCHAR(36))
BEGIN
    -- Alertas de vencimiento (productos que vencen en 30 dias)
    INSERT INTO product_alerts (id, tenant_id, product_id, alert_type, alert_date, priority, message)
    SELECT
        UUID(),
        p_tenant_id,
        id,
        'vencimiento',
        expiry_date,
        CASE
            WHEN DATEDIFF(expiry_date, CURDATE()) <= 7 THEN 'critica'
            WHEN DATEDIFF(expiry_date, CURDATE()) <= 15 THEN 'alta'
            ELSE 'media'
        END,
        CONCAT('Producto vence en ', DATEDIFF(expiry_date, CURDATE()), ' dias')
    FROM products
    WHERE tenant_id = p_tenant_id
        AND expiry_date IS NOT NULL
        AND expiry_date <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)
        AND expiry_date >= CURDATE()
        AND NOT EXISTS (
            SELECT 1 FROM product_alerts
            WHERE product_id = products.id
                AND alert_type = 'vencimiento'
                AND is_resolved = FALSE
        );

    -- Alertas de stock bajo
    INSERT INTO product_alerts (id, tenant_id, product_id, alert_type, alert_date, priority, message)
    SELECT
        UUID(),
        p_tenant_id,
        id,
        'stock_bajo',
        CURDATE(),
        CASE
            WHEN stock = 0 THEN 'critica'
            WHEN stock <= (reorder_point * 0.5) THEN 'alta'
            ELSE 'media'
        END,
        CONCAT('Stock actual: ', stock, ' (Minimo: ', reorder_point, ')')
    FROM products
    WHERE tenant_id = p_tenant_id
        AND stock <= reorder_point
        AND NOT EXISTS (
            SELECT 1 FROM product_alerts
            WHERE product_id = products.id
                AND alert_type = 'stock_bajo'
                AND is_resolved = FALSE
        );
END //

-- ============================================
-- PROCEDIMIENTO: Crear nuevo tenant con comerciante
-- Uso por superadmin para dar de alta un nuevo negocio
-- ============================================
CREATE PROCEDURE sp_create_tenant(
    IN p_tenant_name VARCHAR(255),
    IN p_tenant_slug VARCHAR(100),
    IN p_business_type VARCHAR(100),
    IN p_plan VARCHAR(20),
    IN p_owner_email VARCHAR(255),
    IN p_owner_password VARCHAR(255),
    IN p_owner_name VARCHAR(255),
    OUT p_tenant_id VARCHAR(36),
    OUT p_owner_id VARCHAR(36)
)
BEGIN
    SET p_tenant_id = UUID();
    SET p_owner_id = UUID();

    -- Crear tenant
    INSERT INTO tenants (id, name, slug, business_type, plan)
    VALUES (p_tenant_id, p_tenant_name, p_tenant_slug, p_business_type, p_plan);

    -- Crear usuario comerciante
    INSERT INTO users (id, tenant_id, email, password, name, role, is_active)
    VALUES (p_owner_id, p_tenant_id, p_owner_email, p_owner_password, p_owner_name, 'comerciante', TRUE);

    -- Vincular owner al tenant
    UPDATE tenants SET owner_id = p_owner_id WHERE id = p_tenant_id;

    -- Crear secuencias para el tenant
    INSERT INTO invoice_sequence (tenant_id, prefix, current_number) VALUES (p_tenant_id, 'FAC', 0);
    INSERT INTO payment_receipt_sequence (tenant_id, prefix, current_number) VALUES (p_tenant_id, 'REC', 0);

    -- Crear store_info default
    INSERT INTO store_info (tenant_id, name) VALUES (p_tenant_id, p_tenant_name);
END //

DELIMITER ;

-- ============================================
-- TRIGGERS (tenant-aware)
-- ============================================

DELIMITER //

CREATE TRIGGER tr_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END //

CREATE TRIGGER tr_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END //

CREATE TRIGGER tr_tenants_updated_at
BEFORE UPDATE ON tenants
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END //

DELIMITER ;

-- ============================================
-- INDICES ADICIONALES PARA RENDIMIENTO
-- ============================================
CREATE INDEX idx_sales_date ON sales(created_at);
CREATE INDEX idx_sale_items_product ON sale_items(product_id);
CREATE INDEX idx_stock_movements_date ON stock_movements(created_at);

-- ============================================
-- TABLA: storefront_orders (Pedidos del storefront/tienda online)
-- ============================================
CREATE TABLE IF NOT EXISTS storefront_orders (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL,
    order_number VARCHAR(20) NOT NULL,

    -- Datos del cliente
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_email VARCHAR(255) NULL,
    customer_cedula VARCHAR(50) NULL,

    -- Datos de envío
    department VARCHAR(100) NULL,
    municipality VARCHAR(100) NULL,
    address TEXT NULL,
    neighborhood VARCHAR(255) NULL,

    -- Notas
    notes TEXT NULL,

    -- Totales
    subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
    shipping_cost DECIMAL(12,2) NOT NULL DEFAULT 0,
    discount DECIMAL(12,2) NOT NULL DEFAULT 0,
    total DECIMAL(12,2) NOT NULL,

    -- Estado
    status ENUM('pendiente', 'confirmado', 'preparando', 'enviado', 'entregado', 'cancelado') NOT NULL DEFAULT 'pendiente',
    payment_method VARCHAR(50) NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    INDEX idx_order_tenant (tenant_id),
    INDEX idx_order_status (status),
    INDEX idx_order_number (order_number),
    INDEX idx_order_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: storefront_order_items (Items de pedidos del storefront)
-- ============================================
CREATE TABLE IF NOT EXISTS storefront_order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(36) NULL,
    product_name VARCHAR(255) NOT NULL,
    product_image VARCHAR(500) NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(12,2) NOT NULL,
    total_price DECIMAL(12,2) NOT NULL,
    size VARCHAR(20) NULL,
    color VARCHAR(50) NULL,

    FOREIGN KEY (order_id) REFERENCES storefront_orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
    INDEX idx_order_item_order (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- FIN DEL SCRIPT v3.0 Multi-Tenant
-- ============================================
-- CREDENCIALES POR DEFECTO:
--   Superadmin:   superadmin@stockpro.com  / admin123
--   Comerciante:  comerciante@stockpro.com / admin123
--   Vendedor:     vendedor@stockpro.com    / admin123
-- ============================================
