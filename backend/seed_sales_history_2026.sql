-- ============================================
-- SEED: Historico de Ventas 01/01/2026 - 09/02/2026
-- Tenant: tenant-demo-001
-- Genera ~120 ventas con items aleatorios
-- ============================================

USE stockpro_db;

-- Primero, agregar mas stock a los productos para soportar el historico de ventas
-- (Se necesita stock suficiente para ~120 ventas con 1-3 items cada una)
UPDATE products SET stock = stock + 200 WHERE tenant_id = 'tenant-demo-001';

-- Tambien poner stock al Traje Ejecutivo que estaba en 0
UPDATE products SET stock = 50 WHERE id = 'prod-005' AND tenant_id = 'tenant-demo-001';

DELIMITER //

CREATE PROCEDURE sp_seed_sales_history()
BEGIN
    DECLARE v_current_date DATE DEFAULT '2026-01-01';
    DECLARE v_end_date DATE DEFAULT '2026-02-09';
    DECLARE v_invoice_num INT;
    DECLARE v_day_of_week INT;
    DECLARE v_sales_today INT;
    DECLARE v_sale_counter INT;
    DECLARE v_sale_id VARCHAR(36);
    DECLARE v_invoice VARCHAR(20);
    DECLARE v_product_idx INT;
    DECLARE v_product_id VARCHAR(36);
    DECLARE v_product_name VARCHAR(255);
    DECLARE v_product_sku VARCHAR(50);
    DECLARE v_unit_price DECIMAL(12,2);
    DECLARE v_purchase_price DECIMAL(12,2);
    DECLARE v_quantity INT;
    DECLARE v_item_subtotal DECIMAL(12,2);
    DECLARE v_sale_subtotal DECIMAL(12,2);
    DECLARE v_sale_tax DECIMAL(12,2);
    DECLARE v_sale_discount DECIMAL(12,2);
    DECLARE v_sale_total DECIMAL(12,2);
    DECLARE v_payment_method VARCHAR(20);
    DECLARE v_payment_rand INT;
    DECLARE v_seller_id VARCHAR(36);
    DECLARE v_seller_name VARCHAR(255);
    DECLARE v_customer_id VARCHAR(36);
    DECLARE v_customer_name VARCHAR(255);
    DECLARE v_customer_rand INT;
    DECLARE v_num_items INT;
    DECLARE v_item_counter INT;
    DECLARE v_hour INT;
    DECLARE v_minute INT;
    DECLARE v_sale_datetime DATETIME;
    DECLARE v_amount_paid DECIMAL(12,2);
    DECLARE v_change_amount DECIMAL(12,2);
    DECLARE v_total_sales_generated INT DEFAULT 0;
    DECLARE v_credit_status VARCHAR(20);
    DECLARE v_due_date DATE;
    DECLARE v_item_id VARCHAR(36);
    DECLARE v_used_product_1 INT DEFAULT -1;
    DECLARE v_used_product_2 INT DEFAULT -1;

    -- Obtener el numero actual de factura
    SELECT current_number INTO v_invoice_num FROM invoice_sequence WHERE tenant_id = 'tenant-demo-001';

    -- ============================================
    -- LOOP POR CADA DIA
    -- ============================================
    WHILE v_current_date <= v_end_date DO
        SET v_day_of_week = DAYOFWEEK(v_current_date); -- 1=Dom, 2=Lun, ..., 7=Sab

        -- Determinar ventas del dia segun dia de la semana
        -- Enero es temporada baja post-navidad, febrero sube un poco
        IF v_day_of_week = 1 THEN -- Domingo
            SET v_sales_today = FLOOR(1 + RAND() * 2); -- 1-2 ventas
        ELSEIF v_day_of_week = 7 THEN -- Sabado (dia fuerte)
            SET v_sales_today = FLOOR(3 + RAND() * 4); -- 3-6 ventas
        ELSEIF v_day_of_week IN (2, 6) THEN -- Lunes y Viernes
            SET v_sales_today = FLOOR(2 + RAND() * 3); -- 2-4 ventas
        ELSE -- Martes a Jueves
            SET v_sales_today = FLOOR(2 + RAND() * 2); -- 2-3 ventas
        END IF;

        -- Boost en quincenas (15 y 30 de enero, 1 de febrero)
        IF DAY(v_current_date) IN (15, 30, 31) OR (MONTH(v_current_date) = 2 AND DAY(v_current_date) = 1) THEN
            SET v_sales_today = v_sales_today + FLOOR(1 + RAND() * 3); -- +1 a +3 ventas extra
        END IF;

        SET v_sale_counter = 0;

        -- ============================================
        -- LOOP POR CADA VENTA DEL DIA
        -- ============================================
        WHILE v_sale_counter < v_sales_today DO
            SET v_invoice_num = v_invoice_num + 1;
            SET v_sale_id = UUID();
            SET v_invoice = CONCAT('FAC-', LPAD(v_invoice_num, 5, '0'));

            -- Hora aleatoria entre 8:00 y 19:59
            SET v_hour = FLOOR(8 + RAND() * 12);
            SET v_minute = FLOOR(RAND() * 60);
            SET v_sale_datetime = CONCAT(v_current_date, ' ', LPAD(v_hour, 2, '0'), ':', LPAD(v_minute, 2, '0'), ':00');

            -- Vendedor aleatorio (60% vendedor, 40% comerciante)
            IF RAND() < 0.6 THEN
                SET v_seller_id = 'usr-vendedor-001';
                SET v_seller_name = 'Vendedor Demo';
            ELSE
                SET v_seller_id = 'usr-comerciante-001';
                SET v_seller_name = 'Comerciante Demo';
            END IF;

            -- Cliente aleatorio (35% general, 25% Carlos, 20% Roberto, 20% Juan)
            SET v_customer_rand = FLOOR(RAND() * 100);
            IF v_customer_rand < 35 THEN
                SET v_customer_id = NULL;
                SET v_customer_name = 'Cliente General';
            ELSEIF v_customer_rand < 60 THEN
                SET v_customer_id = 'cust-001';
                SET v_customer_name = 'Carlos Mendez';
            ELSEIF v_customer_rand < 80 THEN
                SET v_customer_id = 'cust-002';
                SET v_customer_name = 'Roberto Garcia';
            ELSE
                SET v_customer_id = 'cust-003';
                SET v_customer_name = 'Juan Perez';
            END IF;

            -- Metodo de pago (45% efectivo, 30% tarjeta, 15% transferencia, 10% fiado solo con cliente)
            SET v_payment_rand = FLOOR(RAND() * 100);
            IF v_payment_rand < 45 THEN
                SET v_payment_method = 'efectivo';
            ELSEIF v_payment_rand < 75 THEN
                SET v_payment_method = 'tarjeta';
            ELSEIF v_payment_rand < 90 THEN
                SET v_payment_method = 'transferencia';
            ELSE
                -- Fiado solo si hay cliente registrado
                IF v_customer_id IS NOT NULL THEN
                    SET v_payment_method = 'fiado';
                ELSE
                    SET v_payment_method = 'efectivo';
                END IF;
            END IF;

            -- Numero de items por venta (50% = 1 item, 35% = 2 items, 15% = 3 items)
            SET v_payment_rand = FLOOR(RAND() * 100);
            IF v_payment_rand < 50 THEN
                SET v_num_items = 1;
            ELSEIF v_payment_rand < 85 THEN
                SET v_num_items = 2;
            ELSE
                SET v_num_items = 3;
            END IF;

            SET v_sale_subtotal = 0;
            SET v_item_counter = 0;
            SET v_used_product_1 = -1;
            SET v_used_product_2 = -1;

            -- ============================================
            -- LOOP POR CADA ITEM DE LA VENTA
            -- ============================================
            WHILE v_item_counter < v_num_items DO
                -- Producto aleatorio (1-8), evitar repetidos en la misma venta
                product_loop: LOOP
                    SET v_product_idx = FLOOR(1 + RAND() * 8);
                    IF v_product_idx != v_used_product_1 AND v_product_idx != v_used_product_2 THEN
                        LEAVE product_loop;
                    END IF;
                END LOOP;

                -- Guardar producto usado
                IF v_item_counter = 0 THEN
                    SET v_used_product_1 = v_product_idx;
                ELSEIF v_item_counter = 1 THEN
                    SET v_used_product_2 = v_product_idx;
                END IF;

                CASE v_product_idx
                    WHEN 1 THEN
                        SET v_product_id = 'prod-001';
                        SET v_product_name = 'Camisa Oxford Slim Fit';
                        SET v_product_sku = 'CAM-TH-001';
                        SET v_unit_price = 159900;
                    WHEN 2 THEN
                        SET v_product_id = 'prod-002';
                        SET v_product_name = 'Pantalon Chino Classic';
                        SET v_product_sku = 'PAN-DOC-001';
                        SET v_unit_price = 129900;
                    WHEN 3 THEN
                        SET v_product_id = 'prod-003';
                        SET v_product_name = 'Zapatos Derby Cuero';
                        SET v_product_sku = 'ZAP-VEL-001';
                        SET v_unit_price = 349900;
                    WHEN 4 THEN
                        SET v_product_id = 'prod-004';
                        SET v_product_name = 'Cinturon Piel Italiano';
                        SET v_product_sku = 'ACC-CK-001';
                        SET v_unit_price = 99900;
                    WHEN 5 THEN
                        SET v_product_id = 'prod-005';
                        SET v_product_name = 'Traje Ejecutivo Negro';
                        SET v_product_sku = 'TRA-AC-001';
                        SET v_unit_price = 899900;
                    WHEN 6 THEN
                        SET v_product_id = 'prod-006';
                        SET v_product_name = 'Sudadera Deportiva';
                        SET v_product_sku = 'DEP-NIK-001';
                        SET v_unit_price = 139900;
                    WHEN 7 THEN
                        SET v_product_id = 'prod-007';
                        SET v_product_name = 'Abrigo Lana Premium';
                        SET v_product_sku = 'ABR-ZAR-001';
                        SET v_unit_price = 449900;
                    WHEN 8 THEN
                        SET v_product_id = 'prod-008';
                        SET v_product_name = 'Boxer Pack x3';
                        SET v_product_sku = 'INT-CK-001';
                        SET v_unit_price = 89900;
                END CASE;

                -- Cantidad: mayoría 1, algunos 2, pocos 3
                SET v_payment_rand = FLOOR(RAND() * 100);
                IF v_payment_rand < 60 THEN
                    SET v_quantity = 1;
                ELSEIF v_payment_rand < 90 THEN
                    SET v_quantity = 2;
                ELSE
                    SET v_quantity = 3;
                END IF;

                -- Para productos caros (zapatos, traje, abrigo), siempre cantidad 1
                IF v_product_idx IN (3, 5, 7) THEN
                    SET v_quantity = 1;
                END IF;

                SET v_item_subtotal = v_unit_price * v_quantity;
                SET v_sale_subtotal = v_sale_subtotal + v_item_subtotal;
                SET v_item_id = UUID();

                -- Insertar item de venta
                INSERT INTO sale_items (id, tenant_id, sale_id, product_id, product_name, product_sku, quantity, unit_price, discount, subtotal, created_at)
                VALUES (v_item_id, 'tenant-demo-001', v_sale_id, v_product_id, v_product_name, v_product_sku, v_quantity, v_unit_price, 0, v_item_subtotal, v_sale_datetime);

                -- Insertar movimiento de stock
                INSERT INTO stock_movements (id, tenant_id, product_id, type, quantity, previous_stock, new_stock, reason, reference_id, user_id, created_at)
                SELECT UUID(), 'tenant-demo-001', v_product_id, 'venta', v_quantity, p.stock, p.stock - v_quantity,
                       CONCAT('Venta ', v_invoice), v_sale_id, v_seller_id, v_sale_datetime
                FROM products p WHERE p.id = v_product_id;

                -- Actualizar stock del producto
                UPDATE products SET stock = stock - v_quantity WHERE id = v_product_id AND tenant_id = 'tenant-demo-001';

                SET v_item_counter = v_item_counter + 1;
            END WHILE;

            -- Calcular totales de la venta
            SET v_sale_tax = ROUND(v_sale_subtotal * 0.19, 2);

            -- Descuento: 15% de probabilidad, descuento del 5% o 10%
            IF RAND() < 0.15 THEN
                IF RAND() < 0.7 THEN
                    SET v_sale_discount = ROUND(v_sale_subtotal * 0.05, 2); -- 5% descuento
                ELSE
                    SET v_sale_discount = ROUND(v_sale_subtotal * 0.10, 2); -- 10% descuento
                END IF;
            ELSE
                SET v_sale_discount = 0;
            END IF;

            SET v_sale_total = v_sale_subtotal + v_sale_tax - v_sale_discount;

            -- Calcular pago y cambio
            IF v_payment_method = 'efectivo' THEN
                -- Redondear al siguiente multiplo de 1000 para efectivo
                SET v_amount_paid = CEIL(v_sale_total / 1000) * 1000;
                -- A veces pagan con billete mas grande
                IF RAND() < 0.3 AND v_sale_total < 200000 THEN
                    SET v_amount_paid = CEIL(v_sale_total / 50000) * 50000;
                END IF;
                SET v_change_amount = v_amount_paid - v_sale_total;
            ELSE
                SET v_amount_paid = v_sale_total;
                SET v_change_amount = 0;
            END IF;

            -- Determinar estado de credito para ventas fiado
            SET v_credit_status = NULL;
            SET v_due_date = NULL;
            IF v_payment_method = 'fiado' THEN
                SET v_credit_status = 'pendiente';
                SET v_due_date = DATE_ADD(v_current_date, INTERVAL 30 DAY);
            END IF;

            -- Insertar la venta
            INSERT INTO sales (id, tenant_id, invoice_number, customer_id, customer_name, subtotal, tax, discount, total, payment_method, amount_paid, change_amount, seller_id, seller_name, status, credit_status, due_date, created_at)
            VALUES (v_sale_id, 'tenant-demo-001', v_invoice, v_customer_id, v_customer_name, v_sale_subtotal, v_sale_tax, v_sale_discount, v_sale_total, v_payment_method, v_amount_paid, v_change_amount, v_seller_id, v_seller_name, 'completada', v_credit_status, v_due_date, v_sale_datetime);

            SET v_total_sales_generated = v_total_sales_generated + 1;
            SET v_sale_counter = v_sale_counter + 1;
        END WHILE;

        SET v_current_date = DATE_ADD(v_current_date, INTERVAL 1 DAY);
    END WHILE;

    -- Actualizar secuencia de facturas
    UPDATE invoice_sequence SET current_number = v_invoice_num WHERE tenant_id = 'tenant-demo-001';

    -- Resultado
    SELECT
        v_total_sales_generated AS ventas_generadas,
        v_invoice_num AS ultimo_numero_factura,
        (SELECT COUNT(*) FROM sale_items si JOIN sales s ON si.sale_id = s.id WHERE s.tenant_id = 'tenant-demo-001' AND s.created_at >= '2026-01-01') AS total_items_generados,
        (SELECT SUM(total) FROM sales WHERE tenant_id = 'tenant-demo-001' AND created_at >= '2026-01-01' AND status = 'completada') AS total_facturado;
END //

DELIMITER ;

-- ============================================
-- EJECUTAR EL SEED
-- ============================================
CALL sp_seed_sales_history();

-- Limpiar procedimiento temporal
DROP PROCEDURE IF EXISTS sp_seed_sales_history;

-- ============================================
-- VERIFICACION: Resumen de ventas generadas
-- ============================================
SELECT '--- RESUMEN DE VENTAS GENERADAS ---' AS info;

SELECT
    DATE_FORMAT(created_at, '%Y-%m') AS mes,
    COUNT(*) AS num_ventas,
    SUM(total) AS total_facturado,
    AVG(total) AS promedio_venta,
    MIN(total) AS venta_minima,
    MAX(total) AS venta_maxima
FROM sales
WHERE tenant_id = 'tenant-demo-001'
  AND created_at >= '2026-01-01'
GROUP BY DATE_FORMAT(created_at, '%Y-%m')
ORDER BY mes;

SELECT '--- VENTAS POR METODO DE PAGO ---' AS info;

SELECT
    payment_method,
    COUNT(*) AS num_ventas,
    SUM(total) AS total
FROM sales
WHERE tenant_id = 'tenant-demo-001'
  AND created_at >= '2026-01-01'
GROUP BY payment_method
ORDER BY num_ventas DESC;

SELECT '--- VENTAS POR DIA DE LA SEMANA ---' AS info;

SELECT
    DAYNAME(created_at) AS dia,
    COUNT(*) AS num_ventas,
    SUM(total) AS total
FROM sales
WHERE tenant_id = 'tenant-demo-001'
  AND created_at >= '2026-01-01'
GROUP BY DAYNAME(created_at), DAYOFWEEK(created_at)
ORDER BY DAYOFWEEK(created_at);

SELECT '--- TOP 5 PRODUCTOS MAS VENDIDOS ---' AS info;

SELECT
    si.product_name,
    SUM(si.quantity) AS unidades_vendidas,
    SUM(si.subtotal) AS total_revenue
FROM sale_items si
JOIN sales s ON si.sale_id = s.id
WHERE s.tenant_id = 'tenant-demo-001'
  AND s.created_at >= '2026-01-01'
GROUP BY si.product_id, si.product_name
ORDER BY unidades_vendidas DESC
LIMIT 5;

SELECT '--- STOCK ACTUAL ---' AS info;

SELECT name, sku, stock, reorder_point,
    CASE
        WHEN stock = 0 THEN 'AGOTADO'
        WHEN stock <= reorder_point THEN 'BAJO'
        ELSE 'OK'
    END AS estado
FROM products
WHERE tenant_id = 'tenant-demo-001'
ORDER BY stock ASC;
