-- ============================================
-- INVENTARIO: PERFUM MUA
-- Comerciante: Jherson Alexander Pinta Enriquez
-- Email: jherson.p9721@gmail.com
-- Tenant ID: 6c6980ea-a142-4ac2-8f47-41042517ddb9
-- Generado: 2026-03-15
-- NOTA: Basado en datos de informe de inventario (datos truncados al final)
-- ============================================
USE stockpro_db;

-- ============================================
-- 3. CATEGORÍAS (basadas en columna Línea)
-- ============================================
INSERT INTO categories (id, tenant_id, name, description) VALUES
('cat-pm-bolsa-eco',    '6c6980ea-a142-4ac2-8f47-41042517ddb9', 'Bolsa Eco',               'Bolsas ecológicas'),
('cat-pm-envase',       '6c6980ea-a142-4ac2-8f47-41042517ddb9', 'Envase',                  'Envases y cajas complementarias'),
('cat-pm-adicional',    '6c6980ea-a142-4ac2-8f47-41042517ddb9', 'Adicional',               'Productos adicionales corporales'),
('cat-pm-splash',       '6c6980ea-a142-4ac2-8f47-41042517ddb9', 'Splash',                  'Splash corporales'),
('cat-pm-crema',        '6c6980ea-a142-4ac2-8f47-41042517ddb9', 'Crema',                   'Cremas corporales'),
('cat-pm-shimmer',      '6c6980ea-a142-4ac2-8f47-41042517ddb9', 'Shimmer',                 'Shimmer corporales'),
('cat-pm-glitter',      '6c6980ea-a142-4ac2-8f47-41042517ddb9', 'Glitter',                 'Glitter corporales'),
('cat-pm-mantequilla',  '6c6980ea-a142-4ac2-8f47-41042517ddb9', 'Mantequilla',             'Mantequillas corporales'),
('cat-pm-textiles',     '6c6980ea-a142-4ac2-8f47-41042517ddb9', 'Textiles',                'Agua de linos y textiles'),
('cat-pm-aromatizante', '6c6980ea-a142-4ac2-8f47-41042517ddb9', 'Aromatizante',            'Aromatizantes hogar y carro'),
('cat-pm-difusores',    '6c6980ea-a142-4ac2-8f47-41042517ddb9', 'Difusores',               'Difusores para hogar'),
('cat-pm-esencias-hs',  '6c6980ea-a142-4ac2-8f47-41042517ddb9', 'Esencias Hidrosolubles',  'Esencias hidrosolubles'),
('cat-pm-esencias-pb',  '6c6980ea-a142-4ac2-8f47-41042517ddb9', 'Esencias Pebetero',       'Esencias para pebetero'),
('cat-pm-pebetero',     '6c6980ea-a142-4ac2-8f47-41042517ddb9', 'Pebetero',                'Pebeteros'),
('cat-pm-extracto',     '6c6980ea-a142-4ac2-8f47-41042517ddb9', 'Extracto',                'Perfumes extracto'),
('cat-pm-original',     '6c6980ea-a142-4ac2-8f47-41042517ddb9', 'Original',                'Perfumes originales'),
('cat-pm-replica',      '6c6980ea-a142-4ac2-8f47-41042517ddb9', 'Replica',                 'Perfumes replica')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- ============================================
-- 4. PRODUCTOS - COMPLEMENTARIO / BOLSA ECO
-- SKU: PM-{ID_interno} | Código en notes
-- ============================================
INSERT INTO products
  (id, tenant_id, name, category, product_type, sku, stock, reorder_point, entry_date, presentation, notes, sale_price)
VALUES
('prod-pm-379','6c6980ea-a142-4ac2-8f47-41042517ddb9','BOLSA ECOLÓGICA GRANDE','cat-pm-bolsa-eco','cosmetica','PM-379',1064,200,'2026-03-15',NULL,'Código: 2001 | Stock Máximo: 1500',0),
('prod-pm-378','6c6980ea-a142-4ac2-8f47-41042517ddb9','BOLSA ECOLÓGICA PEQUEÑA','cat-pm-bolsa-eco','cosmetica','PM-378',937,200,'2026-03-15',NULL,'Código: 2000 | Stock Máximo: 1500',0)
ON DUPLICATE KEY UPDATE stock=VALUES(stock), reorder_point=VALUES(reorder_point), notes=VALUES(notes);

-- ============================================
-- 5. PRODUCTOS - COMPLEMENTARIO / ENVASE
-- ============================================
INSERT INTO products
  (id, tenant_id, name, category, product_type, sku, stock, reorder_point, entry_date, presentation, notes, sale_price)
VALUES
('prod-pm-462','6c6980ea-a142-4ac2-8f47-41042517ddb9','CAJA 100 ML','cat-pm-envase','cosmetica','PM-462',345,100,'2026-03-15','CAJA','Código: 2006 | Stock Máximo: 1000',0),
('prod-pm-461','6c6980ea-a142-4ac2-8f47-41042517ddb9','CAJA 30-50 ML','cat-pm-envase','cosmetica','PM-461',361,150,'2026-03-15','CAJA','Código: 2005 | Stock Máximo: 1000',0),
('prod-pm-382','6c6980ea-a142-4ac2-8f47-41042517ddb9','ENVASE LACOSTE 100ML','cat-pm-envase','cosmetica','PM-382',937,50,'2026-03-15',NULL,'Código: 2004 | Stock Máximo: 200',0),
('prod-pm-380','6c6980ea-a142-4ac2-8f47-41042517ddb9','ENVASE-LACOSTE 30ML','cat-pm-envase','cosmetica','PM-380',790,500,'2026-03-15',NULL,'Código: 2002 | Stock Máximo: 1500',0),
('prod-pm-469','6c6980ea-a142-4ac2-8f47-41042517ddb9','ENVASE-LACOSTE 50 ML','cat-pm-envase','cosmetica','PM-469',1007,600,'2026-03-15',NULL,'Código: 2007 | Stock Máximo: 1560',0)
ON DUPLICATE KEY UPDATE stock=VALUES(stock), reorder_point=VALUES(reorder_point), notes=VALUES(notes);

-- ============================================
-- 6. PRODUCTOS - CORPORAL / ADICIONAL
-- ============================================
INSERT INTO products
  (id, tenant_id, name, category, product_type, sku, stock, reorder_point, entry_date, presentation, notes, sale_price)
VALUES
('prod-pm-470','6c6980ea-a142-4ac2-8f47-41042517ddb9','BONO REGALO','cat-pm-adicional','cosmetica','PM-470',0,0,'2026-03-15',NULL,'Código: 1202',0),
('prod-pm-370','6c6980ea-a142-4ac2-8f47-41042517ddb9','FEROMONAS','cat-pm-adicional','cosmetica','PM-370',5,1,'2026-03-15',NULL,'Código: 390 | Stock Máximo: 1',0),
('prod-pm-371','6c6980ea-a142-4ac2-8f47-41042517ddb9','MUSK TAHARA','cat-pm-adicional','cosmetica','PM-371',21,0,'2026-03-15',NULL,'Código: 391',0),
('prod-pm-702','6c6980ea-a142-4ac2-8f47-41042517ddb9','PURPURE-KITS-VAINILLA CAKE','cat-pm-adicional','cosmetica','PM-702',0,0,'2026-03-15','CAJA','Código: 620',0)
ON DUPLICATE KEY UPDATE stock=VALUES(stock), reorder_point=VALUES(reorder_point), notes=VALUES(notes);

-- ============================================
-- 7. PRODUCTOS - CORPORAL / SHIMMER
-- ============================================
INSERT INTO products
  (id, tenant_id, name, category, product_type, sku, stock, reorder_point, entry_date, presentation, notes, sale_price)
VALUES
('prod-pm-467','6c6980ea-a142-4ac2-8f47-41042517ddb9','PERFUME-CABELLO MAGIC SHINE','cat-pm-shimmer','cosmetica','PM-467',9,0,'2026-03-15',NULL,'Código: 505',0),
('prod-pm-369','6c6980ea-a142-4ac2-8f47-41042517ddb9','PM-SHIMMER PINK-FEM','cat-pm-shimmer','cosmetica','PM-369',0,1,'2026-03-15',NULL,'Código: 327 | Stock Máximo: 1',0),
('prod-pm-368','6c6980ea-a142-4ac2-8f47-41042517ddb9','PM-SHIMMER SCANDAL-FEM','cat-pm-shimmer','cosmetica','PM-368',0,1,'2026-03-15',NULL,'Código: 326 | Stock Máximo: 1',0),
('prod-pm-367','6c6980ea-a142-4ac2-8f47-41042517ddb9','PM-SHIMMER VELVET PETALS-FEM','cat-pm-shimmer','cosmetica','PM-367',0,1,'2026-03-15',NULL,'Código: 325 | Stock Máximo: 1',0)
ON DUPLICATE KEY UPDATE stock=VALUES(stock), reorder_point=VALUES(reorder_point), notes=VALUES(notes);

-- ============================================
-- 8. PRODUCTOS - CORPORAL / GLITTER
-- ============================================
INSERT INTO products
  (id, tenant_id, name, category, product_type, sku, stock, reorder_point, entry_date, presentation, notes, sale_price)
VALUES
('prod-pm-680','6c6980ea-a142-4ac2-8f47-41042517ddb9','PURPURE-BRILLI BRILLI-COCO BLANCO','cat-pm-glitter','cosmetica','PM-680',1,0,'2026-03-15',NULL,'Código: 600',0),
('prod-pm-681','6c6980ea-a142-4ac2-8f47-41042517ddb9','PURPURE-BRILLI BRILLI-FRUTAL MORADO','cat-pm-glitter','cosmetica','PM-681',0,0,'2026-03-15',NULL,'Código: 601',0),
('prod-pm-682','6c6980ea-a142-4ac2-8f47-41042517ddb9','PURPURE-BRILLI BRILLI-VAINILLA ROJO','cat-pm-glitter','cosmetica','PM-682',0,0,'2026-03-15',NULL,'Código: 602',0)
ON DUPLICATE KEY UPDATE stock=VALUES(stock), reorder_point=VALUES(reorder_point), notes=VALUES(notes);

-- ============================================
-- 9. PRODUCTOS - CORPORAL / MANTEQUILLA (PURPURE)
-- ============================================
INSERT INTO products
  (id, tenant_id, name, category, product_type, sku, stock, reorder_point, entry_date, presentation, notes, sale_price)
VALUES
('prod-pm-701','6c6980ea-a142-4ac2-8f47-41042517ddb9','PURPURE-MANTEQUILLA-SWEET LYCHEE','cat-pm-mantequilla','cosmetica','PM-701',1,0,'2026-03-15',NULL,'Código: 619',0),
('prod-pm-692','6c6980ea-a142-4ac2-8f47-41042517ddb9','PURPURE-MINI MANTEQUILLA BELLOTA-BUBBLE GUM','cat-pm-mantequilla','cosmetica','PM-692',1,0,'2026-03-15',NULL,'Código: 610',0),
('prod-pm-694','6c6980ea-a142-4ac2-8f47-41042517ddb9','PURPURE-MINI MANTEQUILLA BELLOTA-CANDY BUM','cat-pm-mantequilla','cosmetica','PM-694',1,0,'2026-03-15',NULL,'Código: 612',0),
('prod-pm-693','6c6980ea-a142-4ac2-8f47-41042517ddb9','PURPURE-MINI MANTEQUILLA BELLOTA-CARAMEL CRUSH','cat-pm-mantequilla','cosmetica','PM-693',1,0,'2026-03-15',NULL,'Código: 611',0),
('prod-pm-695','6c6980ea-a142-4ac2-8f47-41042517ddb9','PURPURE-MINI MANTEQUILLA BELLOTA-STRAWBERRY','cat-pm-mantequilla','cosmetica','PM-695',1,0,'2026-03-15',NULL,'Código: 613',0),
('prod-pm-699','6c6980ea-a142-4ac2-8f47-41042517ddb9','PURPURE-MINI MANTEQUILLA-COCONUT SHINE','cat-pm-mantequilla','cosmetica','PM-699',0,0,'2026-03-15',NULL,'Código: 617',0),
('prod-pm-698','6c6980ea-a142-4ac2-8f47-41042517ddb9','PURPURE-MINI MANTEQUILLA-GIRLBOSS','cat-pm-mantequilla','cosmetica','PM-698',0,0,'2026-03-15',NULL,'Código: 616',0),
('prod-pm-700','6c6980ea-a142-4ac2-8f47-41042517ddb9','PURPURE-MINI MANTEQUILLA-SEXY CHAMPAGNE','cat-pm-mantequilla','cosmetica','PM-700',0,0,'2026-03-15',NULL,'Código: 618',0),
('prod-pm-696','6c6980ea-a142-4ac2-8f47-41042517ddb9','PURPURE-MINI MANTEQUILLA-VAINILLA DREAMS','cat-pm-mantequilla','cosmetica','PM-696',1,0,'2026-03-15',NULL,'Código: 614',0),
('prod-pm-697','6c6980ea-a142-4ac2-8f47-41042517ddb9','PURPURE-MINI MANTEQUILLA-WATERMELON','cat-pm-mantequilla','cosmetica','PM-697',1,0,'2026-03-15',NULL,'Código: 615',0)
ON DUPLICATE KEY UPDATE stock=VALUES(stock), reorder_point=VALUES(reorder_point), notes=VALUES(notes);

-- ============================================
-- 10. PRODUCTOS - CORPORAL / CREMA
-- ============================================
INSERT INTO products
  (id, tenant_id, name, category, product_type, sku, stock, reorder_point, entry_date, presentation, notes, sale_price)
VALUES
('prod-pm-419','6c6980ea-a142-4ac2-8f47-41042517ddb9','CREMA-SATINADA BRILLO','cat-pm-crema','cosmetica','PM-419',4,4,'2026-03-15',NULL,'Código: 500 | Stock Máximo: 10',0),
('prod-pm-463','6c6980ea-a142-4ac2-8f47-41042517ddb9','DISPONIBLE','cat-pm-crema','cosmetica','PM-463',0,5,'2026-03-15',NULL,'Código: 503 | Stock Máximo: 20',0),
('prod-pm-578','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-CREMA INEBRIANTE-FEM','cat-pm-crema','cosmetica','PM-578',1,0,'2026-03-15',NULL,'Código: 1089',0),
('prod-pm-579','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-CREMA STRAX-UNI','cat-pm-crema','cosmetica','PM-579',2,0,'2026-03-15',NULL,'Código: 1090',0),
('prod-pm-512','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-VS CREMA AMBER APERITIF-FEM','cat-pm-crema','cosmetica','PM-512',1,0,'2026-03-15',NULL,'Código: 437',0),
('prod-pm-321','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-VS CREMA AMBER ROMANCE-FEM','cat-pm-crema','cosmetica','PM-321',1,1,'2026-03-15',NULL,'Código: 414 | Stock Máximo: 1',0),
('prod-pm-322','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-VS CREMA AQUA KISS-FEM','cat-pm-crema','cosmetica','PM-322',0,0,'2026-03-15',NULL,'Código: 415',0),
('prod-pm-319','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-VS CREMA BARE VAINILLA-FEM','cat-pm-crema','cosmetica','PM-319',3,0,'2026-03-15',NULL,'Código: 412',0),
('prod-pm-320','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-VS CREMA COCONUT PASSION-FEM','cat-pm-crema','cosmetica','PM-320',2,1,'2026-03-15',NULL,'Código: 413 | Stock Máximo: 1',0),
('prod-pm-318','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-VS CREMA LOVE SPELL-FEM','cat-pm-crema','cosmetica','PM-318',1,0,'2026-03-15',NULL,'Código: 411',0),
('prod-pm-323','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-VS CREMA MIDNIGHT BLOOM-FEM','cat-pm-crema','cosmetica','PM-323',1,0,'2026-03-15',NULL,'Código: 416',0),
('prod-pm-514','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-VS CREMA NEON TROPIC-FEM','cat-pm-crema','cosmetica','PM-514',1,0,'2026-03-15',NULL,'Código: 439',0),
('prod-pm-317','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-VS CREMA PURE SEDUCTION-FEM','cat-pm-crema','cosmetica','PM-317',2,1,'2026-03-15',NULL,'Código: 410 | Stock Máximo: 1',0),
('prod-pm-511','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-VS CREMA ROMANTIC-FEM','cat-pm-crema','cosmetica','PM-511',1,0,'2026-03-15',NULL,'Código: 436',0),
('prod-pm-510','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-VS CREMA RUSH-FEM','cat-pm-crema','cosmetica','PM-510',1,0,'2026-03-15',NULL,'Código: 435',0),
('prod-pm-316','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-VS CREMA VELVET PETALS-FEM','cat-pm-crema','cosmetica','PM-316',2,0,'2026-03-15',NULL,'Código: 409',0),
('prod-pm-513','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-VS CREMA WILD NEROLI-FEM','cat-pm-crema','cosmetica','PM-513',1,0,'2026-03-15',NULL,'Código: 438',0),
('prod-pm-595','6c6980ea-a142-4ac2-8f47-41042517ddb9','VIDAN-CREMA TOCADOR-29K AMBER','cat-pm-crema','cosmetica','PM-595',3,1,'2026-03-15',NULL,'Código: 516 | Stock Máximo: 1',0),
('prod-pm-593','6c6980ea-a142-4ac2-8f47-41042517ddb9','VIDAN-CREMA TOCADOR-29K LOVELY','cat-pm-crema','cosmetica','PM-593',2,0,'2026-03-15',NULL,'Código: 514',0),
('prod-pm-594','6c6980ea-a142-4ac2-8f47-41042517ddb9','VIDAN-CREMA TOCADOR-29K SPELL','cat-pm-crema','cosmetica','PM-594',3,1,'2026-03-15',NULL,'Código: 515 | Stock Máximo: 1',0),
('prod-pm-592','6c6980ea-a142-4ac2-8f47-41042517ddb9','VIDAN-CREMA TOCADOR-29K VAINILLA','cat-pm-crema','cosmetica','PM-592',3,1,'2026-03-15',NULL,'Código: 513 | Stock Máximo: 1',0),
('prod-pm-596','6c6980ea-a142-4ac2-8f47-41042517ddb9','VIDAN-CREMA TOCADOR-BOMBOM','cat-pm-crema','cosmetica','PM-596',2,0,'2026-03-15',NULL,'Código: 517',0),
('prod-pm-591','6c6980ea-a142-4ac2-8f47-41042517ddb9','VIDAN-CREMA TOCADOR-FLOWER DREAMS','cat-pm-crema','cosmetica','PM-591',2,0,'2026-03-15',NULL,'Código: 512',0),
('prod-pm-466','6c6980ea-a142-4ac2-8f47-41042517ddb9','VIDAN-CREMA TOCADOR-MANGO DREAMS','cat-pm-crema','cosmetica','PM-466',2,1,'2026-03-15',NULL,'Código: 511 | Stock Máximo: 1',0),
('prod-pm-590','6c6980ea-a142-4ac2-8f47-41042517ddb9','VIDAN-CREMA TOCADOR-PURE DREMS','cat-pm-crema','cosmetica','PM-590',2,0,'2026-03-15',NULL,'Código: 510',0),
('prod-pm-420','6c6980ea-a142-4ac2-8f47-41042517ddb9','VIDAN-MANTEQUILLA BLIME-COCO','cat-pm-crema','cosmetica','PM-420',2,5,'2026-03-15',NULL,'Código: 526 | Stock Máximo: 10',0),
('prod-pm-605','6c6980ea-a142-4ac2-8f47-41042517ddb9','VIDAN-MANTEQUILLA BLIME-FRESH','cat-pm-crema','cosmetica','PM-605',2,0,'2026-03-15',NULL,'Código: 531',0),
('prod-pm-604','6c6980ea-a142-4ac2-8f47-41042517ddb9','VIDAN-MANTEQUILLA BLIME-FRUTOS ROJOS','cat-pm-crema','cosmetica','PM-604',3,1,'2026-03-15',NULL,'Código: 530 | Stock Máximo: 1',0),
('prod-pm-603','6c6980ea-a142-4ac2-8f47-41042517ddb9','VIDAN-MANTEQUILLA BLIME-MANDARINA','cat-pm-crema','cosmetica','PM-603',0,0,'2026-03-15',NULL,'Código: 529',0),
('prod-pm-602','6c6980ea-a142-4ac2-8f47-41042517ddb9','VIDAN-MANTEQUILLA BLIME-MARACUYA','cat-pm-crema','cosmetica','PM-602',2,1,'2026-03-15',NULL,'Código: 528 | Stock Máximo: 1',0),
('prod-pm-613','6c6980ea-a142-4ac2-8f47-41042517ddb9','VIDAN-MANTEQUILLA BLIME-NARANJA','cat-pm-crema','cosmetica','PM-613',2,1,'2026-03-15',NULL,'Código: 532-b | Stock Máximo: 1',0),
('prod-pm-601','6c6980ea-a142-4ac2-8f47-41042517ddb9','VIDAN-MANTEQUILLA BLIME-PINA COLADA','cat-pm-crema','cosmetica','PM-601',2,1,'2026-03-15',NULL,'Código: 527 | Stock Máximo: 1',0),
('prod-pm-611','6c6980ea-a142-4ac2-8f47-41042517ddb9','VIDAN-MANTEQUILLA BRILLO-29K AMBER','cat-pm-crema','cosmetica','PM-611',1,0,'2026-03-15',NULL,'Código: 537',0),
('prod-pm-614','6c6980ea-a142-4ac2-8f47-41042517ddb9','VIDAN-MANTEQUILLA BRILLO-29K AQUA','cat-pm-crema','cosmetica','PM-614',2,1,'2026-03-15',NULL,'Código: 532-c | Stock Máximo: 1',0),
('prod-pm-610','6c6980ea-a142-4ac2-8f47-41042517ddb9','VIDAN-MANTEQUILLA BRILLO-29K LOVELY','cat-pm-crema','cosmetica','PM-610',1,0,'2026-03-15',NULL,'Código: 536',0),
('prod-pm-609','6c6980ea-a142-4ac2-8f47-41042517ddb9','VIDAN-MANTEQUILLA BRILLO-29K VAINILLA','cat-pm-crema','cosmetica','PM-609',1,0,'2026-03-15',NULL,'Código: 535',0),
('prod-pm-612','6c6980ea-a142-4ac2-8f47-41042517ddb9','VIDAN-MANTEQUILLA BRILLO-BOMBOM','cat-pm-crema','cosmetica','PM-612',1,0,'2026-03-15',NULL,'Código: 539',0),
('prod-pm-607','6c6980ea-a142-4ac2-8f47-41042517ddb9','VIDAN-MANTEQUILLA BRILLO-COCO DREAMS','cat-pm-crema','cosmetica','PM-607',0,0,'2026-03-15',NULL,'Código: 533',0),
('prod-pm-606','6c6980ea-a142-4ac2-8f47-41042517ddb9','VIDAN-MANTEQUILLA BRILLO-MANGO DREAMS','cat-pm-crema','cosmetica','PM-606',1,0,'2026-03-15',NULL,'Código: 532-d',0),
('prod-pm-608','6c6980ea-a142-4ac2-8f47-41042517ddb9','VIDAN-MANTEQUILLA BRILLO-PURE DREAMS','cat-pm-crema','cosmetica','PM-608',1,0,'2026-03-15',NULL,'Código: 534',0),
('prod-pm-525','6c6980ea-a142-4ac2-8f47-41042517ddb9','VIDAN-MANTEQUILLA BRILLO-SKY DREAMS','cat-pm-crema','cosmetica','PM-525',4,1,'2026-03-15',NULL,'Código: 531-b | Stock Máximo: 1',0),
('prod-pm-624','6c6980ea-a142-4ac2-8f47-41042517ddb9','VIDAN-MINI CREMA SHIMMER-29K AMBER','cat-pm-crema','cosmetica','PM-624',2,0,'2026-03-15',NULL,'Código: 548',0),
('prod-pm-626','6c6980ea-a142-4ac2-8f47-41042517ddb9','VIDAN-MINI CREMA SHIMMER-29K BOMB','cat-pm-crema','cosmetica','PM-626',1,1,'2026-03-15',NULL,'Código: 550 | Stock Máximo: 1',0),
('prod-pm-622','6c6980ea-a142-4ac2-8f47-41042517ddb9','VIDAN-MINI CREMA SHIMMER-29K LOVELY','cat-pm-crema','cosmetica','PM-622',3,0,'2026-03-15',NULL,'Código: 546',0),
('prod-pm-623','6c6980ea-a142-4ac2-8f47-41042517ddb9','VIDAN-MINI CREMA SHIMMER-29K SPELL','cat-pm-crema','cosmetica','PM-623',3,1,'2026-03-15',NULL,'Código: 547 | Stock Máximo: 1',0),
('prod-pm-621','6c6980ea-a142-4ac2-8f47-41042517ddb9','VIDAN-MINI CREMA SHIMMER-29K VAINILLA','cat-pm-crema','cosmetica','PM-621',2,0,'2026-03-15',NULL,'Código: 545',0),
('prod-pm-625','6c6980ea-a142-4ac2-8f47-41042517ddb9','VIDAN-MINI CREMA SHIMMER-BOMBOM','cat-pm-crema','cosmetica','PM-625',4,0,'2026-03-15',NULL,'Código: 549',0),
('prod-pm-618','6c6980ea-a142-4ac2-8f47-41042517ddb9','VIDAN-MINI CREMA SHIMMER-COCO DREAMS','cat-pm-crema','cosmetica','PM-618',2,0,'2026-03-15',NULL,'Código: 542',0),
('prod-pm-619','6c6980ea-a142-4ac2-8f47-41042517ddb9','VIDAN-MINI CREMA SHIMMER-FLOWER DREAMS','cat-pm-crema','cosmetica','PM-619',2,0,'2026-03-15',NULL,'Código: 543',0),
('prod-pm-617','6c6980ea-a142-4ac2-8f47-41042517ddb9','VIDAN-MINI CREMA SHIMMER-MANGO DREAMS','cat-pm-crema','cosmetica','PM-617',3,1,'2026-03-15',NULL,'Código: 541 | Stock Máximo: 1',0),
('prod-pm-620','6c6980ea-a142-4ac2-8f47-41042517ddb9','VIDAN-MINI CREMA SHIMMER-PURE DREAMS','cat-pm-crema','cosmetica','PM-620',3,0,'2026-03-15',NULL,'Código: 544',0),
('prod-pm-616','6c6980ea-a142-4ac2-8f47-41042517ddb9','VIDAN-MINI CREMA SHIMMER-SKY DREAMS','cat-pm-crema','cosmetica','PM-616',2,0,'2026-03-15',NULL,'Código: 540',0),
('prod-pm-615','6c6980ea-a142-4ac2-8f47-41042517ddb9','VIDAN-MINI MANTEQUILLA-BABY DREAMS','cat-pm-crema','cosmetica','PM-615',1,1,'2026-03-15',NULL,'Código: 525 | Stock Máximo: 1',0),
('prod-pm-598','6c6980ea-a142-4ac2-8f47-41042517ddb9','VIDAN-MINI MANTEQUILLA-DOLL DREAMS','cat-pm-crema','cosmetica','PM-598',2,0,'2026-03-15',NULL,'Código: 522',0),
('prod-pm-597','6c6980ea-a142-4ac2-8f47-41042517ddb9','VIDAN-MINI MANTEQUILLA-NIGHT DREAMS','cat-pm-crema','cosmetica','PM-597',2,0,'2026-03-15',NULL,'Código: 521',0),
('prod-pm-599','6c6980ea-a142-4ac2-8f47-41042517ddb9','VIDAN-MINI MANTEQUILLA-SHINE DREAMS','cat-pm-crema','cosmetica','PM-599',4,1,'2026-03-15',NULL,'Código: 523 | Stock Máximo: 1',0),
('prod-pm-600','6c6980ea-a142-4ac2-8f47-41042517ddb9','VIDAN-MINI MANTEQUILLA-SUGAR DREAMS','cat-pm-crema','cosmetica','PM-600',3,1,'2026-03-15',NULL,'Código: 524 | Stock Máximo: 1',0),
('prod-pm-468','6c6980ea-a142-4ac2-8f47-41042517ddb9','VIDAN-MINI MANTEQUILLA-WAVES','cat-pm-crema','cosmetica','PM-468',6,1,'2026-03-15',NULL,'Código: 520 | Stock Máximo: 1',0)
ON DUPLICATE KEY UPDATE stock=VALUES(stock), reorder_point=VALUES(reorder_point), notes=VALUES(notes);

-- ============================================
-- 11. PRODUCTOS - CORPORAL / SPLASH (Parte 1: PM-SPLASH y ORI-VS SPLASH)
-- ============================================
INSERT INTO products
  (id, tenant_id, name, category, product_type, sku, stock, reorder_point, entry_date, expiry_date, notes, sale_price)
VALUES
('prod-pm-421','6c6980ea-a142-4ac2-8f47-41042517ddb9','COD DISPONIBLE','cat-pm-splash','cosmetica','PM-421',27,10,'2026-03-15',NULL,'Código: 502 | Stock Máximo: 20',0),
('prod-pm-506','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-VS SPLASH AMBER APERITIF-FEM','cat-pm-splash','cosmetica','PM-506',1,0,'2026-03-15',NULL,'Código: 431',0),
('prod-pm-312','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-VS SPLASH AMBER ROMANCE-FEM','cat-pm-splash','cosmetica','PM-312',1,0,'2026-03-15',NULL,'Código: 405',0),
('prod-pm-315','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-VS SPLASH AQUA KISS-FEM','cat-pm-splash','cosmetica','PM-315',0,0,'2026-03-15',NULL,'Código: 408',0),
('prod-pm-309','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-VS SPLASH BARE VAINILLA-FEM','cat-pm-splash','cosmetica','PM-309',3,0,'2026-03-15',NULL,'Código: 402',0),
('prod-pm-310','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-VS SPLASH COCONUT PASSION-FEM','cat-pm-splash','cosmetica','PM-310',3,1,'2026-03-15',NULL,'Código: 403 | Stock Máximo: 1',0),
('prod-pm-508','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-VS SPLASH ELECTRIC MANGO-FEM','cat-pm-splash','cosmetica','PM-508',1,0,'2026-03-15',NULL,'Código: 433',0),
('prod-pm-314','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-VS SPLASH LOVE SPELL-FEM','cat-pm-splash','cosmetica','PM-314',1,0,'2026-03-15',NULL,'Código: 407',0),
('prod-pm-311','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-VS SPLASH MIDNIGHT BLOOM-FEM','cat-pm-splash','cosmetica','PM-311',2,0,'2026-03-15',NULL,'Código: 404',0),
('prod-pm-509','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-VS SPLASH NEON TROPIC-FEM','cat-pm-splash','cosmetica','PM-509',1,0,'2026-03-15',NULL,'Código: 434',0),
('prod-pm-308','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-VS SPLASH PURE SEDUCTION-FEM','cat-pm-splash','cosmetica','PM-308',1,1,'2026-03-15',NULL,'Código: 401 | Stock Máximo: 1',0),
('prod-pm-505','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-VS SPLASH ROMANTIC-FEM','cat-pm-splash','cosmetica','PM-505',1,0,'2026-03-15',NULL,'Código: 430',0),
('prod-pm-504','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-VS SPLASH RUSH-FEM','cat-pm-splash','cosmetica','PM-504',1,0,'2026-03-15',NULL,'Código: 429',0),
('prod-pm-307','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-VS SPLASH STRAWBERRIES CHAMP-FEM','cat-pm-splash','cosmetica','PM-307',2,0,'2026-03-15',NULL,'Código: 400',0),
('prod-pm-503','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-VS SPLASH TEMPTATION-FEM','cat-pm-splash','cosmetica','PM-503',1,0,'2026-03-15',NULL,'Código: 428',0),
('prod-pm-313','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-VS SPLASH VELVET PETALS-FEM','cat-pm-splash','cosmetica','PM-313',1,0,'2026-03-15',NULL,'Código: 406',0),
('prod-pm-507','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-VS SPLASH WILD NEROLI-FEM','cat-pm-splash','cosmetica','PM-507',1,0,'2026-03-15',NULL,'Código: 432',0),
('prod-pm-374','6c6980ea-a142-4ac2-8f47-41042517ddb9','PM-SPLASH AQUA KISS-FEM','cat-pm-splash','cosmetica','PM-374',6,1,'2026-03-15',NULL,'Código: 393 | Stock Máximo: 1',0),
('prod-pm-385','6c6980ea-a142-4ac2-8f47-41042517ddb9','PM-SPLASH ARRURU-UNI','cat-pm-splash','cosmetica','PM-385',2,1,'2026-03-15',NULL,'Código: 399 | Stock Máximo: 1',0),
('prod-pm-442','6c6980ea-a142-4ac2-8f47-41042517ddb9','PM-SPLASH BATMAN-NINO','cat-pm-splash','cosmetica','PM-442',4,1,'2026-03-15',NULL,'Código: 427 | Stock Máximo: 1',0),
('prod-pm-383','6c6980ea-a142-4ac2-8f47-41042517ddb9','PM-SPLASH BLUE SQUAD-NINO','cat-pm-splash','cosmetica','PM-383',3,1,'2026-03-15',NULL,'Código: 397 | Stock Máximo: 1',0),
('prod-pm-290','6c6980ea-a142-4ac2-8f47-41042517ddb9','PM-SPLASH BOSS BOTTLED UNL-MAS','cat-pm-splash','cosmetica','PM-290',9,1,'2026-03-15','2026-08-20','Código: 302 | Stock Máximo: 1',0),
('prod-pm-446','6c6980ea-a142-4ac2-8f47-41042517ddb9','PM-SPLASH BUBBLE GUMMER-UNI','cat-pm-splash','cosmetica','PM-446',1,1,'2026-03-15',NULL,'Código: 424 | Stock Máximo: 1',0),
('prod-pm-304','6c6980ea-a142-4ac2-8f47-41042517ddb9','PM-SPLASH BUENA CHICA-FEM','cat-pm-splash','cosmetica','PM-304',3,1,'2026-03-15','2026-08-20','Código: 321 | Stock Máximo: 1',0),
('prod-pm-302','6c6980ea-a142-4ac2-8f47-41042517ddb9','PM-SPLASH CAN CAN-FEM','cat-pm-splash','cosmetica','PM-302',5,1,'2026-03-15','2026-08-20','Código: 319 | Stock Máximo: 1',0),
('prod-pm-443','6c6980ea-a142-4ac2-8f47-41042517ddb9','PM-SPLASH CAPITAN AMERICA-NINO','cat-pm-splash','cosmetica','PM-443',4,1,'2026-03-15',NULL,'Código: 421 | Stock Máximo: 1',0),
('prod-pm-465','6c6980ea-a142-4ac2-8f47-41042517ddb9','PM-SPLASH CARNAVAL 62-FEM','cat-pm-splash','cosmetica','PM-465',3,1,'2026-03-15',NULL,'Código: 425 | Stock Máximo: 1',0),
('prod-pm-526','6c6980ea-a142-4ac2-8f47-41042517ddb9','PM-SPLASH CARNAVAL 68-FEM','cat-pm-splash','cosmetica','PM-526',4,1,'2026-03-15',NULL,'Código: 442 | Stock Máximo: 1',0),
('prod-pm-301','6c6980ea-a142-4ac2-8f47-41042517ddb9','PM-SPLASH CHOCOLATE-FEM','cat-pm-splash','cosmetica','PM-301',8,1,'2026-03-15','2026-08-20','Código: 318 | Stock Máximo: 1',0),
('prod-pm-303','6c6980ea-a142-4ac2-8f47-41042517ddb9','PM-SPLASH COCONUT PASSION-FEM','cat-pm-splash','cosmetica','PM-303',6,1,'2026-03-15','2026-08-20','Código: 320 | Stock Máximo: 1',0),
('prod-pm-376','6c6980ea-a142-4ac2-8f47-41042517ddb9','PM-SPLASH COOL BOY-NINO','cat-pm-splash','cosmetica','PM-376',2,1,'2026-03-15',NULL,'Código: 395 | Stock Máximo: 1',0),
('prod-pm-440','6c6980ea-a142-4ac2-8f47-41042517ddb9','PM-SPLASH FROZEN-NINA','cat-pm-splash','cosmetica','PM-440',1,1,'2026-03-15',NULL,'Código: 418 | Stock Máximo: 1',0),
('prod-pm-295','6c6980ea-a142-4ac2-8f47-41042517ddb9','PM-SPLASH FRUITS-FEM','cat-pm-splash','cosmetica','PM-295',6,1,'2026-03-15','2026-08-20','Código: 312 | Stock Máximo: 1',0),
('prod-pm-386','6c6980ea-a142-4ac2-8f47-41042517ddb9','PM-SPLASH GLAM ANGEL-NINA','cat-pm-splash','cosmetica','PM-386',6,1,'2026-03-15',NULL,'Código: 420 | Stock Máximo: 1',0),
('prod-pm-300','6c6980ea-a142-4ac2-8f47-41042517ddb9','PM-SPLASH HEIRESS-FEM','cat-pm-splash','cosmetica','PM-300',8,1,'2026-03-15','2026-08-20','Código: 317 | Stock Máximo: 1',0),
('prod-pm-292','6c6980ea-a142-4ac2-8f47-41042517ddb9','PM-SPLASH INVICTUS-MAS','cat-pm-splash','cosmetica','PM-292',7,1,'2026-03-15','2026-08-20','Código: 304 | Stock Máximo: 1',0),
('prod-pm-296','6c6980ea-a142-4ac2-8f47-41042517ddb9','PM-SPLASH JUICED BERRY-FEM','cat-pm-splash','cosmetica','PM-296',5,1,'2026-03-15','2026-08-20','Código: 313 | Stock Máximo: 1',0),
('prod-pm-288','6c6980ea-a142-4ac2-8f47-41042517ddb9','PM-SPLASH LACOSTE RED-MAS','cat-pm-splash','cosmetica','PM-288',6,1,'2026-03-15','2026-08-20','Código: 300 | Stock Máximo: 1',0),
('prod-pm-306','6c6980ea-a142-4ac2-8f47-41042517ddb9','PM-SPLASH MANGO-FEM','cat-pm-splash','cosmetica','PM-306',8,1,'2026-03-15','2026-08-20','Código: 323 | Stock Máximo: 1',0),
('prod-pm-444','6c6980ea-a142-4ac2-8f47-41042517ddb9','PM-SPLASH MARIO BROSS-NINO','cat-pm-splash','cosmetica','PM-444',1,1,'2026-03-15',NULL,'Código: 422 | Stock Máximo: 1',0),
('prod-pm-439','6c6980ea-a142-4ac2-8f47-41042517ddb9','PM-SPLASH MONSTER HIGH-NINA','cat-pm-splash','cosmetica','PM-439',2,1,'2026-03-15',NULL,'Código: 417 | Stock Máximo: 1',0),
('prod-pm-291','6c6980ea-a142-4ac2-8f47-41042517ddb9','PM-SPLASH NAUTICO-MAS','cat-pm-splash','cosmetica','PM-291',6,1,'2026-03-15','2026-08-20','Código: 303 | Stock Máximo: 1',0),
('prod-pm-384','6c6980ea-a142-4ac2-8f47-41042517ddb9','PM-SPLASH PHANTOM LEGION-NINO','cat-pm-splash','cosmetica','PM-384',2,1,'2026-03-15',NULL,'Código: 398 | Stock Máximo: 1',0),
('prod-pm-324','6c6980ea-a142-4ac2-8f47-41042517ddb9','PM-SPLASH PINK CHIFFON-FEM','cat-pm-splash','cosmetica','PM-324',5,1,'2026-03-15',NULL,'Código: 426 | Stock Máximo: 1',0),
('prod-pm-289','6c6980ea-a142-4ac2-8f47-41042517ddb9','PM-SPLASH POWER MIX-MAS','cat-pm-splash','cosmetica','PM-289',5,1,'2026-03-15','2026-08-20','Código: 301 | Stock Máximo: 1',0),
('prod-pm-441','6c6980ea-a142-4ac2-8f47-41042517ddb9','PM-SPLASH PRINCESA SOFIA-NINA','cat-pm-splash','cosmetica','PM-441',6,1,'2026-03-15',NULL,'Código: 419 | Stock Máximo: 1',0),
('prod-pm-298','6c6980ea-a142-4ac2-8f47-41042517ddb9','PM-SPLASH PURE SEDUCTION-FEM','cat-pm-splash','cosmetica','PM-298',4,1,'2026-03-15','2026-08-20','Código: 315 | Stock Máximo: 1',0),
('prod-pm-297','6c6980ea-a142-4ac2-8f47-41042517ddb9','PM-SPLASH SANDIA-FEM','cat-pm-splash','cosmetica','PM-297',5,1,'2026-03-15','2026-08-20','Código: 314 | Stock Máximo: 1',0),
('prod-pm-293','6c6980ea-a142-4ac2-8f47-41042517ddb9','PM-SPLASH SCANDALOUS-FEM','cat-pm-splash','cosmetica','PM-293',7,1,'2026-03-15','2026-08-20','Código: 310 | Stock Máximo: 1',0),
('prod-pm-445','6c6980ea-a142-4ac2-8f47-41042517ddb9','PM-SPLASH SUAVE CARICIA-UNI','cat-pm-splash','cosmetica','PM-445',6,1,'2026-03-15',NULL,'Código: 423 | Stock Máximo: 1',0),
('prod-pm-589','6c6980ea-a142-4ac2-8f47-41042517ddb9','PM-SPLASH TALCO-FEM','cat-pm-splash','cosmetica','PM-589',6,1,'2026-03-15',NULL,'Código: 444 | Stock Máximo: 1',0),
('prod-pm-305','6c6980ea-a142-4ac2-8f47-41042517ddb9','PM-SPLASH V DAME AMOR-FEM','cat-pm-splash','cosmetica','PM-305',6,1,'2026-03-15','2026-08-20','Código: 322 | Stock Máximo: 1',0),
('prod-pm-294','6c6980ea-a142-4ac2-8f47-41042517ddb9','PM-SPLASH V RUSH-FEM','cat-pm-splash','cosmetica','PM-294',8,1,'2026-03-15','2026-08-20','Código: 311 | Stock Máximo: 1',0),
('prod-pm-377','6c6980ea-a142-4ac2-8f47-41042517ddb9','PM-SPLASH VAINILLA LACE-NINA','cat-pm-splash','cosmetica','PM-377',2,1,'2026-03-15',NULL,'Código: 396 | Stock Máximo: 1',0),
('prod-pm-299','6c6980ea-a142-4ac2-8f47-41042517ddb9','PM-SPLASH VAINILLA-FEM','cat-pm-splash','cosmetica','PM-299',10,1,'2026-03-15','2026-08-20','Código: 316 | Stock Máximo: 1',0),
('prod-pm-373','6c6980ea-a142-4ac2-8f47-41042517ddb9','PM-SPLASH VELVET PETALS-FEM','cat-pm-splash','cosmetica','PM-373',8,1,'2026-03-15',NULL,'Código: 324 | Stock Máximo: 1',0),
('prod-pm-375','6c6980ea-a142-4ac2-8f47-41042517ddb9','PM-SPLASH WOOD NOIR-MAS','cat-pm-splash','cosmetica','PM-375',7,1,'2026-03-15',NULL,'Código: 394 | Stock Máximo: 1',0)
ON DUPLICATE KEY UPDATE stock=VALUES(stock), reorder_point=VALUES(reorder_point), expiry_date=VALUES(expiry_date), notes=VALUES(notes);

-- ============================================
-- 11b. SPLASH - PURPURE MINI, REP-SPLASH ACRILICOS, VIDAN MINI, BODY SPRAY
-- ============================================
INSERT INTO products
  (id, tenant_id, name, category, product_type, sku, stock, reorder_point, entry_date, expiry_date, notes, sale_price)
VALUES
('prod-pm-690','6c6980ea-a142-4ac2-8f47-41042517ddb9','PURPURE-MINI SPLASH-ADDICTION GIRL','cat-pm-splash','cosmetica','PM-690',3,1,'2026-03-15',NULL,'Código: 609 | Stock Máximo: 1',0),
('prod-pm-688','6c6980ea-a142-4ac2-8f47-41042517ddb9','PURPURE-MINI SPLASH-BIRTHDAY CAKE','cat-pm-splash','cosmetica','PM-688',1,0,'2026-03-15',NULL,'Código: 607',0),
('prod-pm-686','6c6980ea-a142-4ac2-8f47-41042517ddb9','PURPURE-MINI SPLASH-CANDY BUM','cat-pm-splash','cosmetica','PM-686',1,0,'2026-03-15',NULL,'Código: 604',0),
('prod-pm-689','6c6980ea-a142-4ac2-8f47-41042517ddb9','PURPURE-MINI SPLASH-COCONUT SHINE','cat-pm-splash','cosmetica','PM-689',1,0,'2026-03-15',NULL,'Código: 605',0),
('prod-pm-687','6c6980ea-a142-4ac2-8f47-41042517ddb9','PURPURE-MINI SPLASH-SEXY CHAMPAGNE','cat-pm-splash','cosmetica','PM-687',3,1,'2026-03-15',NULL,'Código: 606 | Stock Máximo: 1',0),
('prod-pm-691','6c6980ea-a142-4ac2-8f47-41042517ddb9','PURPURE-MINI SPLASH-SWEET LYCHEE','cat-pm-splash','cosmetica','PM-691',2,1,'2026-03-15',NULL,'Código: 608 | Stock Máximo: 1',0),
('prod-pm-683','6c6980ea-a142-4ac2-8f47-41042517ddb9','PURPURE-MINI SPLASH-VAINILLA DREAMS','cat-pm-splash','cosmetica','PM-683',1,0,'2026-03-15',NULL,'Código: 603',0),
('prod-pm-636','6c6980ea-a142-4ac2-8f47-41042517ddb9','REP-SPLASH ACRILICOS-1 MILLON-MAS','cat-pm-splash','cosmetica','PM-636',0,1,'2026-03-15',NULL,'Código: 582 | Stock Máximo: 1',0),
('prod-pm-644','6c6980ea-a142-4ac2-8f47-41042517ddb9','REP-SPLASH ACRILICOS-AMBER OUD GOLD-UNI','cat-pm-splash','cosmetica','PM-644',1,1,'2026-03-15',NULL,'Código: 589 | Stock Máximo: 1',0),
('prod-pm-645','6c6980ea-a142-4ac2-8f47-41042517ddb9','REP-SPLASH ACRILICOS-AMETHYSTE-UNI','cat-pm-splash','cosmetica','PM-645',2,1,'2026-03-15',NULL,'Código: 589-b | Stock Máximo: 1',0),
('prod-pm-641','6c6980ea-a142-4ac2-8f47-41042517ddb9','REP-SPLASH ACRILICOS-ARI-FEM','cat-pm-splash','cosmetica','PM-641',1,1,'2026-03-15',NULL,'Código: 587 | Stock Máximo: 1',0),
('prod-pm-639','6c6980ea-a142-4ac2-8f47-41042517ddb9','REP-SPLASH ACRILICOS-ASAD-MAS','cat-pm-splash','cosmetica','PM-639',2,1,'2026-03-15',NULL,'Código: 585 | Stock Máximo: 1',0),
('prod-pm-635','6c6980ea-a142-4ac2-8f47-41042517ddb9','REP-SPLASH ACRILICOS-BHARARA KING-MAS','cat-pm-splash','cosmetica','PM-635',2,1,'2026-03-15',NULL,'Código: 581 | Stock Máximo: 1',0),
('prod-pm-640','6c6980ea-a142-4ac2-8f47-41042517ddb9','REP-SPLASH ACRILICOS-CLOUD-FEM','cat-pm-splash','cosmetica','PM-640',2,1,'2026-03-15',NULL,'Código: 586 | Stock Máximo: 1',0),
('prod-pm-654','6c6980ea-a142-4ac2-8f47-41042517ddb9','REP-SPLASH ACRILICOS-CLUB DE NUIT INTENSE-MAS','cat-pm-splash','cosmetica','PM-654',1,1,'2026-03-15',NULL,'Código: 595 | Stock Máximo: 1',0),
('prod-pm-648','6c6980ea-a142-4ac2-8f47-41042517ddb9','REP-SPLASH ACRILICOS-DELINHA-FEM','cat-pm-splash','cosmetica','PM-648',1,1,'2026-03-15',NULL,'Código: 590 | Stock Máximo: 1',0),
('prod-pm-643','6c6980ea-a142-4ac2-8f47-41042517ddb9','REP-SPLASH ACRILICOS-EMEER-UNI','cat-pm-splash','cosmetica','PM-643',1,1,'2026-03-15',NULL,'Código: 588 | Stock Máximo: 1',0),
('prod-pm-651','6c6980ea-a142-4ac2-8f47-41042517ddb9','REP-SPLASH ACRILICOS-HAYA-FEM','cat-pm-splash','cosmetica','PM-651',1,1,'2026-03-15',NULL,'Código: 593 | Stock Máximo: 1',0),
('prod-pm-650','6c6980ea-a142-4ac2-8f47-41042517ddb9','REP-SPLASH ACRILICOS-HEIRES-FEM','cat-pm-splash','cosmetica','PM-650',0,1,'2026-03-15',NULL,'Código: 592 | Stock Máximo: 1',0),
('prod-pm-652','6c6980ea-a142-4ac2-8f47-41042517ddb9','REP-SPLASH ACRILICOS-HONOR Y GLORY-UNI','cat-pm-splash','cosmetica','PM-652',1,1,'2026-03-15',NULL,'Código: 596 | Stock Máximo: 1',0),
('prod-pm-637','6c6980ea-a142-4ac2-8f47-41042517ddb9','REP-SPLASH ACRILICOS-INVICTUS-MAS','cat-pm-splash','cosmetica','PM-637',1,1,'2026-03-15',NULL,'Código: 583 | Stock Máximo: 1',0),
('prod-pm-653','6c6980ea-a142-4ac2-8f47-41042517ddb9','REP-SPLASH ACRILICOS-MANDARIN SKY-MAS','cat-pm-splash','cosmetica','PM-653',1,1,'2026-03-15',NULL,'Código: 594 | Stock Máximo: 1',0),
('prod-pm-638','6c6980ea-a142-4ac2-8f47-41042517ddb9','REP-SPLASH ACRILICOS-NAUTICA VOYAGE-MAS','cat-pm-splash','cosmetica','PM-638',2,1,'2026-03-15',NULL,'Código: 584 | Stock Máximo: 1',0),
('prod-pm-647','6c6980ea-a142-4ac2-8f47-41042517ddb9','REP-SPLASH ACRILICOS-SANTAL 33-UNI','cat-pm-splash','cosmetica','PM-647',1,1,'2026-03-15',NULL,'Código: 560 | Stock Máximo: 1',0),
('prod-pm-649','6c6980ea-a142-4ac2-8f47-41042517ddb9','REP-SPLASH ACRILICOS-STARRY NIGHT-UNI','cat-pm-splash','cosmetica','PM-649',1,1,'2026-03-15',NULL,'Código: 591 | Stock Máximo: 1',0),
('prod-pm-642','6c6980ea-a142-4ac2-8f47-41042517ddb9','REP-SPLASH ACRILICOS-SWEET LIKE CANDY-FEM','cat-pm-splash','cosmetica','PM-642',1,1,'2026-03-15',NULL,'Código: 588-b | Stock Máximo: 1',0),
('prod-pm-646','6c6980ea-a142-4ac2-8f47-41042517ddb9','REP-SPLASH ACRILICOS-TOY PEARL-UNI','cat-pm-splash','cosmetica','PM-646',1,1,'2026-03-15',NULL,'Código: 589-c | Stock Máximo: 1',0),
('prod-pm-634','6c6980ea-a142-4ac2-8f47-41042517ddb9','REP-SPLASH ACRILICOS-UOMO BORN IN ROMA-MAS','cat-pm-splash','cosmetica','PM-634',1,1,'2026-03-15',NULL,'Código: 580 | Stock Máximo: 1',0),
('prod-pm-405','6c6980ea-a142-4ac2-8f47-41042517ddb9','SPLASH-BODY SPRAY YARA-FEM','cat-pm-splash','cosmetica','PM-405',3,0,'2026-03-15','2025-06-14','Código: 1004',0),
('prod-pm-656','6c6980ea-a142-4ac2-8f47-41042517ddb9','VIDAN-MINI SPLASH-29K AMBER','cat-pm-splash','cosmetica','PM-656',0,0,'2026-03-15',NULL,'Código: 552',0),
('prod-pm-658','6c6980ea-a142-4ac2-8f47-41042517ddb9','VIDAN-MINI SPLASH-29K AQUA','cat-pm-splash','cosmetica','PM-658',0,0,'2026-03-15',NULL,'Código: 554',0),
('prod-pm-655','6c6980ea-a142-4ac2-8f47-41042517ddb9','VIDAN-MINI SPLASH-29K BOMB','cat-pm-splash','cosmetica','PM-655',1,0,'2026-03-15',NULL,'Código: 551',0),
('prod-pm-657','6c6980ea-a142-4ac2-8f47-41042517ddb9','VIDAN-MINI SPLASH-29K SPELL','cat-pm-splash','cosmetica','PM-657',0,0,'2026-03-15',NULL,'Código: 553',0),
('prod-pm-661','6c6980ea-a142-4ac2-8f47-41042517ddb9','VIDAN-MINI SPLASH-BOMBOM','cat-pm-splash','cosmetica','PM-661',0,0,'2026-03-15',NULL,'Código: 557',0),
('prod-pm-659','6c6980ea-a142-4ac2-8f47-41042517ddb9','VIDAN-MINI SPLASH-MANGO DREAMS','cat-pm-splash','cosmetica','PM-659',0,0,'2026-03-15',NULL,'Código: 555',0),
('prod-pm-660','6c6980ea-a142-4ac2-8f47-41042517ddb9','VIDAN-MINI SPLASH-PURE DREAMS','cat-pm-splash','cosmetica','PM-660',0,0,'2026-03-15',NULL,'Código: 556',0)
ON DUPLICATE KEY UPDATE stock=VALUES(stock), reorder_point=VALUES(reorder_point), expiry_date=VALUES(expiry_date), notes=VALUES(notes);

-- ============================================
-- 12. PRODUCTOS - HOGAR / TEXTILES (Agua de Linos)
-- ============================================
INSERT INTO products
  (id, tenant_id, name, category, product_type, sku, stock, reorder_point, entry_date, notes, sale_price)
VALUES
('prod-pm-476','6c6980ea-a142-4ac2-8f47-41042517ddb9','AGUA DE LINOS-ALGODON','cat-pm-textiles','hogar','PM-476',5,4,'2026-03-15','Código: 354 | Stock Máximo: 10',0),
('prod-pm-477','6c6980ea-a142-4ac2-8f47-41042517ddb9','AGUA DE LINOS-FRESCURA DE ALGODON','cat-pm-textiles','hogar','PM-477',6,4,'2026-03-15','Código: 355 | Stock Máximo: 10',0),
('prod-pm-474','6c6980ea-a142-4ac2-8f47-41042517ddb9','AGUA DE LINOS-FRUTOS ROJOS','cat-pm-textiles','hogar','PM-474',10,4,'2026-03-15','Código: 352 | Stock Máximo: 10',0),
('prod-pm-472','6c6980ea-a142-4ac2-8f47-41042517ddb9','AGUA DE LINOS-GOLD','cat-pm-textiles','hogar','PM-472',6,4,'2026-03-15','Código: 338 | Stock Máximo: 10',0),
('prod-pm-475','6c6980ea-a142-4ac2-8f47-41042517ddb9','AGUA DE LINOS-TAF PINK','cat-pm-textiles','hogar','PM-475',6,4,'2026-03-15','Código: 353 | Stock Máximo: 10',0),
('prod-pm-473','6c6980ea-a142-4ac2-8f47-41042517ddb9','AGUA DE LINOS-VAINILLA','cat-pm-textiles','hogar','PM-473',7,4,'2026-03-15','Código: 339 | Stock Máximo: 10',0)
ON DUPLICATE KEY UPDATE stock=VALUES(stock), reorder_point=VALUES(reorder_point), notes=VALUES(notes);

-- ============================================
-- 13. PRODUCTOS - HOGAR / AROMATIZANTE (Ambiente y Carro)
-- ============================================
INSERT INTO products
  (id, tenant_id, name, category, product_type, sku, stock, reorder_point, entry_date, notes, sale_price)
VALUES
('prod-pm-328','6c6980ea-a142-4ac2-8f47-41042517ddb9','AROMATIZANTE-ALGODON','cat-pm-aromatizante','hogar','PM-328',5,1,'2026-03-15','Código: 330 | Stock Máximo: 1',0),
('prod-pm-332','6c6980ea-a142-4ac2-8f47-41042517ddb9','AROMATIZANTE-CHICLE BOMBON','cat-pm-aromatizante','hogar','PM-332',6,1,'2026-03-15','Código: 334 | Stock Máximo: 1',0),
('prod-pm-563','6c6980ea-a142-4ac2-8f47-41042517ddb9','AROMATIZANTE-CITRONELA LEMON','cat-pm-aromatizante','hogar','PM-563',6,1,'2026-03-15','Código: 443 | Stock Máximo: 1',0),
('prod-pm-330','6c6980ea-a142-4ac2-8f47-41042517ddb9','AROMATIZANTE-COCO','cat-pm-aromatizante','hogar','PM-330',7,1,'2026-03-15','Código: 332 | Stock Máximo: 1',0),
('prod-pm-334','6c6980ea-a142-4ac2-8f47-41042517ddb9','AROMATIZANTE-FRUITS','cat-pm-aromatizante','hogar','PM-334',7,1,'2026-03-15','Código: 336 | Stock Máximo: 1',0),
('prod-pm-329','6c6980ea-a142-4ac2-8f47-41042517ddb9','AROMATIZANTE-FRUTOS ROJOS','cat-pm-aromatizante','hogar','PM-329',2,1,'2026-03-15','Código: 331 | Stock Máximo: 1',0),
('prod-pm-331','6c6980ea-a142-4ac2-8f47-41042517ddb9','AROMATIZANTE-KIWI','cat-pm-aromatizante','hogar','PM-331',8,1,'2026-03-15','Código: 333 | Stock Máximo: 1',0),
('prod-pm-471','6c6980ea-a142-4ac2-8f47-41042517ddb9','AROMATIZANTE-LAVANDA FRESH','cat-pm-aromatizante','hogar','PM-471',3,3,'2026-03-15','Código: 337 | Stock Máximo: 10',0),
('prod-pm-333','6c6980ea-a142-4ac2-8f47-41042517ddb9','AROMATIZANTE-VAINILLA','cat-pm-aromatizante','hogar','PM-333',6,1,'2026-03-15','Código: 335 | Stock Máximo: 1',0),
('prod-pm-705','6c6980ea-a142-4ac2-8f47-41042517ddb9','PM CARRO-ARANDANO MORA CAR','cat-pm-aromatizante','hogar','PM-705',4,1,'2026-03-15','Código: 366 | Stock Máximo: 1',0),
('prod-pm-497','6c6980ea-a142-4ac2-8f47-41042517ddb9','PM CARRO-AUDI','cat-pm-aromatizante','hogar','PM-497',1,1,'2026-03-15','Código: 364 | Stock Máximo: 1',0),
('prod-pm-498','6c6980ea-a142-4ac2-8f47-41042517ddb9','PM CARRO-CHEVROLET','cat-pm-aromatizante','hogar','PM-498',1,1,'2026-03-15','Código: 365 | Stock Máximo: 1',0),
('prod-pm-326','6c6980ea-a142-4ac2-8f47-41042517ddb9','PM CARRO-FRESCO CHUSPIANTE','cat-pm-aromatizante','hogar','PM-326',4,1,'2026-03-15','Código: 361 | Stock Máximo: 1',0),
('prod-pm-327','6c6980ea-a142-4ac2-8f47-41042517ddb9','PM CARRO-SANDIA FRAPE','cat-pm-aromatizante','hogar','PM-327',7,1,'2026-03-15','Código: 362 | Stock Máximo: 1',0),
('prod-pm-496','6c6980ea-a142-4ac2-8f47-41042517ddb9','PM CARRO-TOYOTA','cat-pm-aromatizante','hogar','PM-496',1,1,'2026-03-15','Código: 363 | Stock Máximo: 1',0),
('prod-pm-325','6c6980ea-a142-4ac2-8f47-41042517ddb9','PM CARRO-XTREME CAR','cat-pm-aromatizante','hogar','PM-325',2,1,'2026-03-15','Código: 360 | Stock Máximo: 1',0)
ON DUPLICATE KEY UPDATE stock=VALUES(stock), reorder_point=VALUES(reorder_point), notes=VALUES(notes);

-- ============================================
-- 14. PRODUCTOS - HOGAR / DIFUSORES
-- ============================================
INSERT INTO products
  (id, tenant_id, name, category, product_type, sku, stock, reorder_point, entry_date, notes, sale_price)
VALUES
('prod-pm-515','6c6980ea-a142-4ac2-8f47-41042517ddb9','DIFUSOR-AMBROSIA VAINILLA','cat-pm-difusores','hogar','PM-515',5,1,'2026-03-15','Código: 440 | Stock Máximo: 1',0),
('prod-pm-554','6c6980ea-a142-4ac2-8f47-41042517ddb9','DIFUSOR-BRISA TROPICAL','cat-pm-difusores','hogar','PM-554',4,1,'2026-03-15','Código: 403 | Stock Máximo: 1',0),
('prod-pm-342','6c6980ea-a142-4ac2-8f47-41042517ddb9','DIFUSOR-CAFE MOCKA','cat-pm-difusores','hogar','PM-342',0,1,'2026-03-15','Código: 347 | Stock Máximo: 1',0),
('prod-pm-343','6c6980ea-a142-4ac2-8f47-41042517ddb9','DIFUSOR-CITRUS','cat-pm-difusores','hogar','PM-343',5,1,'2026-03-15','Código: 348 | Stock Máximo: 1',0),
('prod-pm-553','6c6980ea-a142-4ac2-8f47-41042517ddb9','DIFUSOR-ELEGANT','cat-pm-difusores','hogar','PM-553',6,1,'2026-03-15','Código: 402 | Stock Máximo: 1',0),
('prod-pm-555','6c6980ea-a142-4ac2-8f47-41042517ddb9','DIFUSOR-FRESCA BRISA','cat-pm-difusores','hogar','PM-555',2,1,'2026-03-15','Código: 404 | Stock Máximo: 1',0),
('prod-pm-338','6c6980ea-a142-4ac2-8f47-41042517ddb9','DIFUSOR-FRUTOS ROJOS','cat-pm-difusores','hogar','PM-338',1,1,'2026-03-15','Código: 343 | Stock Máximo: 1',0),
('prod-pm-341','6c6980ea-a142-4ac2-8f47-41042517ddb9','DIFUSOR-KIWI','cat-pm-difusores','hogar','PM-341',3,1,'2026-03-15','Código: 346 | Stock Máximo: 1',0),
('prod-pm-344','6c6980ea-a142-4ac2-8f47-41042517ddb9','DIFUSOR-KOLA PINK','cat-pm-difusores','hogar','PM-344',3,1,'2026-03-15','Código: 349 | Stock Máximo: 1',0),
('prod-pm-552','6c6980ea-a142-4ac2-8f47-41042517ddb9','DIFUSOR-MANZANA CANELA','cat-pm-difusores','hogar','PM-552',5,1,'2026-03-15','Código: 441 | Stock Máximo: 1',0),
('prod-pm-336','6c6980ea-a142-4ac2-8f47-41042517ddb9','DIFUSOR-MARACUYA','cat-pm-difusores','hogar','PM-336',0,1,'2026-03-15','Código: 341 | Stock Máximo: 1',0),
('prod-pm-340','6c6980ea-a142-4ac2-8f47-41042517ddb9','DIFUSOR-MELON','cat-pm-difusores','hogar','PM-340',2,1,'2026-03-15','Código: 345 | Stock Máximo: 1',0),
('prod-pm-335','6c6980ea-a142-4ac2-8f47-41042517ddb9','DIFUSOR-PINA','cat-pm-difusores','hogar','PM-335',3,1,'2026-03-15','Código: 340 | Stock Máximo: 1',0),
('prod-pm-345','6c6980ea-a142-4ac2-8f47-41042517ddb9','DIFUSOR-PINO','cat-pm-difusores','hogar','PM-345',10,1,'2026-03-15','Código: 350 | Stock Máximo: 1',0),
('prod-pm-556','6c6980ea-a142-4ac2-8f47-41042517ddb9','DIFUSOR-ROJOS SILVESTRES','cat-pm-difusores','hogar','PM-556',4,1,'2026-03-15','Código: 405 | Stock Máximo: 1',0),
('prod-pm-417','6c6980ea-a142-4ac2-8f47-41042517ddb9','DIFUSOR-TUTTY FRUTTY','cat-pm-difusores','hogar','PM-417',6,1,'2026-03-15','Código: 351 | Stock Máximo: 1',0),
('prod-pm-337','6c6980ea-a142-4ac2-8f47-41042517ddb9','DIFUSOR-VAINILLA','cat-pm-difusores','hogar','PM-337',3,1,'2026-03-15','Código: 342 | Stock Máximo: 1',0),
('prod-pm-339','6c6980ea-a142-4ac2-8f47-41042517ddb9','DIFUSOR-VAINILLA TOST','cat-pm-difusores','hogar','PM-339',3,1,'2026-03-15','Código: 344 | Stock Máximo: 1',0)
ON DUPLICATE KEY UPDATE stock=VALUES(stock), reorder_point=VALUES(reorder_point), notes=VALUES(notes);

-- ============================================
-- 15. PRODUCTOS - HOGAR / ESENCIAS HIDROSOLUBLES
-- ============================================
INSERT INTO products
  (id, tenant_id, name, category, product_type, sku, stock, reorder_point, entry_date, notes, sale_price)
VALUES
('prod-pm-346','6c6980ea-a142-4ac2-8f47-41042517ddb9','ESENCIA HS-BLACK BERRY','cat-pm-esencias-hs','hogar','PM-346',7,1,'2026-03-15','Código: 370 | Stock Máximo: 1',0),
('prod-pm-351','6c6980ea-a142-4ac2-8f47-41042517ddb9','ESENCIA HS-BRISA MARINA','cat-pm-esencias-hs','hogar','PM-351',2,1,'2026-03-15','Código: 375 | Stock Máximo: 1',0),
('prod-pm-354','6c6980ea-a142-4ac2-8f47-41042517ddb9','ESENCIA HS-CASCARA MANDARINA','cat-pm-esencias-hs','hogar','PM-354',4,1,'2026-03-15','Código: 378 | Stock Máximo: 1',0),
('prod-pm-357','6c6980ea-a142-4ac2-8f47-41042517ddb9','ESENCIA HS-COCO VAINILLA','cat-pm-esencias-hs','hogar','PM-357',4,1,'2026-03-15','Código: 381 | Stock Máximo: 1',0),
('prod-pm-348','6c6980ea-a142-4ac2-8f47-41042517ddb9','ESENCIA HS-FANTASIA FRUTAL','cat-pm-esencias-hs','hogar','PM-348',0,1,'2026-03-15','Código: 372 | Stock Máximo: 1',0),
('prod-pm-350','6c6980ea-a142-4ac2-8f47-41042517ddb9','ESENCIA HS-FLORES ALGODON','cat-pm-esencias-hs','hogar','PM-350',2,1,'2026-03-15','Código: 374 | Stock Máximo: 1',0),
('prod-pm-347','6c6980ea-a142-4ac2-8f47-41042517ddb9','ESENCIA HS-FRUTOS AMARILLOS','cat-pm-esencias-hs','hogar','PM-347',5,0,'2026-03-15','Código: 371',0),
('prod-pm-355','6c6980ea-a142-4ac2-8f47-41042517ddb9','ESENCIA HS-FRUTOS ROJOS','cat-pm-esencias-hs','hogar','PM-355',3,1,'2026-03-15','Código: 379 | Stock Máximo: 1',0),
('prod-pm-356','6c6980ea-a142-4ac2-8f47-41042517ddb9','ESENCIA HS-MARACUYA','cat-pm-esencias-hs','hogar','PM-356',3,1,'2026-03-15','Código: 380 | Stock Máximo: 1',0),
('prod-pm-353','6c6980ea-a142-4ac2-8f47-41042517ddb9','ESENCIA HS-MENTA FRESCA','cat-pm-esencias-hs','hogar','PM-353',2,0,'2026-03-15','Código: 377',0),
('prod-pm-352','6c6980ea-a142-4ac2-8f47-41042517ddb9','ESENCIA HS-ROLLOS CANELA','cat-pm-esencias-hs','hogar','PM-352',3,1,'2026-03-15','Código: 376 | Stock Máximo: 1',0),
('prod-pm-349','6c6980ea-a142-4ac2-8f47-41042517ddb9','ESENCIA HS-TUTTY FRUTTY','cat-pm-esencias-hs','hogar','PM-349',0,0,'2026-03-15','Código: 373',0)
ON DUPLICATE KEY UPDATE stock=VALUES(stock), reorder_point=VALUES(reorder_point), notes=VALUES(notes);

-- ============================================
-- 16. PRODUCTOS - HOGAR / ESENCIAS PEBETERO + PEBETERO
-- ============================================
INSERT INTO products
  (id, tenant_id, name, category, product_type, sku, stock, reorder_point, entry_date, notes, sale_price)
VALUES
('prod-pm-362','6c6980ea-a142-4ac2-8f47-41042517ddb9','ESENCIA PB-CANELA','cat-pm-esencias-pb','hogar','PM-362',2,0,'2026-03-15','Código: 385',0),
('prod-pm-359','6c6980ea-a142-4ac2-8f47-41042517ddb9','ESENCIA PB-CANNES AIR','cat-pm-esencias-pb','hogar','PM-359',2,0,'2026-03-15','Código: 382',0),
('prod-pm-366','6c6980ea-a142-4ac2-8f47-41042517ddb9','ESENCIA PB-COCO','cat-pm-esencias-pb','hogar','PM-366',2,0,'2026-03-15','Código: 389',0),
('prod-pm-360','6c6980ea-a142-4ac2-8f47-41042517ddb9','ESENCIA PB-FRAMBUESA','cat-pm-esencias-pb','hogar','PM-360',0,0,'2026-03-15','Código: 383',0),
('prod-pm-363','6c6980ea-a142-4ac2-8f47-41042517ddb9','ESENCIA PB-FRESCO BAMBOO','cat-pm-esencias-pb','hogar','PM-363',0,0,'2026-03-15','Código: 386',0),
('prod-pm-365','6c6980ea-a142-4ac2-8f47-41042517ddb9','ESENCIA PB-LIMON','cat-pm-esencias-pb','hogar','PM-365',2,0,'2026-03-15','Código: 388',0),
('prod-pm-358','6c6980ea-a142-4ac2-8f47-41042517ddb9','ESENCIA PB-SANDALO','cat-pm-esencias-pb','hogar','PM-358',3,0,'2026-03-15','Código: 381',0),
('prod-pm-361','6c6980ea-a142-4ac2-8f47-41042517ddb9','ESENCIA PB-TUTTY FRUTTY','cat-pm-esencias-pb','hogar','PM-361',2,0,'2026-03-15','Código: 384',0),
('prod-pm-364','6c6980ea-a142-4ac2-8f47-41042517ddb9','ESENCIA PB-VAINILLA','cat-pm-esencias-pb','hogar','PM-364',1,0,'2026-03-15','Código: 387',0),
('prod-pm-372','6c6980ea-a142-4ac2-8f47-41042517ddb9','PEBETERO','cat-pm-pebetero','hogar','PM-372',9,0,'2026-03-15','Código: 392',0)
ON DUPLICATE KEY UPDATE stock=VALUES(stock), reorder_point=VALUES(reorder_point), notes=VALUES(notes);

-- ============================================
-- 17. PRODUCTOS - PERFUMERÍA / RÉPLICA
-- ============================================
INSERT INTO products
  (id, tenant_id, name, category, product_type, sku, stock, reorder_point, entry_date, presentation, notes, sale_price)
VALUES
('prod-pm-551','6c6980ea-a142-4ac2-8f47-41042517ddb9','COD DISPONIBLE','cat-pm-replica','perfumes','PM-551',8,1,'2026-03-15','CAJA','Código: 508 | Stock Máximo: 1',0)
ON DUPLICATE KEY UPDATE stock=VALUES(stock), reorder_point=VALUES(reorder_point), notes=VALUES(notes);

-- ============================================
-- 18. PRODUCTOS - PERFUMERÍA / ORIGINAL (Decants y ORI-)
-- ============================================
INSERT INTO products
  (id, tenant_id, name, category, product_type, sku, stock, reorder_point, entry_date, expiry_date, notes, sale_price)
VALUES
('prod-pm-459','6c6980ea-a142-4ac2-8f47-41042517ddb9','DECANT 10 ML','cat-pm-original','perfumes','PM-459',20,1,'2026-03-15',NULL,'Código: 1201 | Stock Máximo: 1',0),
('prod-pm-458','6c6980ea-a142-4ac2-8f47-41042517ddb9','DECANT 5 ML','cat-pm-original','perfumes','PM-458',17,1,'2026-03-15',NULL,'Código: 1200 | Stock Máximo: 1',0),
('prod-pm-2','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-AFNAN-9 AM DIVE-UNI','cat-pm-original','perfumes','PM-2',1,0,'2026-03-15',NULL,'Código: 942',0),
('prod-pm-490','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-AFNAN-9 PM ELIXIR-MAS','cat-pm-original','perfumes','PM-490',3,0,'2026-03-15',NULL,'Código: 1043',0),
('prod-pm-449','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-AFNAN-9 PM REBEL-UNI','cat-pm-original','perfumes','PM-449',1,0,'2026-03-15','2027-07-10','Código: 1024',0),
('prod-pm-3','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-AFNAN-9 PM-MAS','cat-pm-original','perfumes','PM-3',3,0,'2026-03-15',NULL,'Código: 938',0),
('prod-pm-489','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-AFNAN-KIANA CRUSH-FEM','cat-pm-original','perfumes','PM-489',3,0,'2026-03-15',NULL,'Código: 1042',0),
('prod-pm-390','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-AFNAN-ORNAMENT-FEM','cat-pm-original','perfumes','PM-390',2,0,'2026-03-15','2027-06-14','Código: 989',0),
('prod-pm-4','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-AGATHA RUIZ PRADA-GOTAS DE COLOR-FEM','cat-pm-original','perfumes','PM-4',2,0,'2026-03-15',NULL,'Código: 983',0),
('prod-pm-704','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-AHLI-OVERDOSE-UNI','cat-pm-original','perfumes','PM-704',0,0,'2026-03-15',NULL,'Código: 1113',0),
('prod-pm-5','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-AL HARAMAIN-AMBER OUD GOLD-UNI','cat-pm-original','perfumes','PM-5',2,0,'2026-03-15',NULL,'Código: 939',0),
('prod-pm-436','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-AL REHAB-CHOCO MUSK-UNI','cat-pm-original','perfumes','PM-436',2,0,'2026-03-15','2027-07-09','Código: 1019',0),
('prod-pm-6','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-ANTONIO BANDERAS-BLUE SEDUCTION-FEM','cat-pm-original','perfumes','PM-6',2,0,'2026-03-15',NULL,'Código: 947',0),
('prod-pm-7','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-ANTONIO BANDERAS-BLUE SEDUCTION-MAS','cat-pm-original','perfumes','PM-7',1,0,'2026-03-15',NULL,'Código: 946',0),
('prod-pm-488','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-ARABIYAT PRESTIGE-ASHAA NEROLI-UNI','cat-pm-original','perfumes','PM-488',2,0,'2026-03-15',NULL,'Código: 1041',0),
('prod-pm-482','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-ARABIYAT PRESTIGE-FONDUE LAVA LUSH-UNI','cat-pm-original','perfumes','PM-482',3,0,'2026-03-15',NULL,'Código: 1035',0),
('prod-pm-486','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-ARABIYAT PRESTIGE-HABIB-MAS','cat-pm-original','perfumes','PM-486',2,0,'2026-03-15',NULL,'Código: 1039',0),
('prod-pm-487','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-ARABIYAT PRESTIGE-HABIBA-FEM','cat-pm-original','perfumes','PM-487',3,0,'2026-03-15',NULL,'Código: 1040',0),
('prod-pm-397','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-ARABIYAT PRESTIGE-LA DI DA-FEM','cat-pm-original','perfumes','PM-397',3,0,'2026-03-15','2027-12-14','Código: 997',0),
('prod-pm-398','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-ARABIYAT PRESTIGE-LA DI DA-MAS','cat-pm-original','perfumes','PM-398',2,0,'2026-03-15','2027-06-14','Código: 998',0),
('prod-pm-483','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-ARABIYAT PRESTIGE-LUTFAH FIRST LOVE-FEM','cat-pm-original','perfumes','PM-483',3,0,'2026-03-15',NULL,'Código: 1036',0),
('prod-pm-396','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-ARABIYAT PRESTIGE-MAHAD AL DHAHAB-UNI','cat-pm-original','perfumes','PM-396',3,0,'2026-03-15','2027-12-14','Código: 996',0),
('prod-pm-8','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-ARIANA GRANDE-CLOUD PINK-FEM','cat-pm-original','perfumes','PM-8',1,0,'2026-03-15',NULL,'Código: 968',0),
('prod-pm-9','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-ARIANA GRANDE-CLOUD-FEM','cat-pm-original','perfumes','PM-9',0,0,'2026-03-15',NULL,'Código: 921',0),
('prod-pm-10','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-ARIANA GRANDE-SWEET LIKE CANDY-FEM','cat-pm-original','perfumes','PM-10',0,0,'2026-03-15',NULL,'Código: 980',0),
('prod-pm-11','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-ARIANA GRANDE-THANK U NEXT-FEM','cat-pm-original','perfumes','PM-11',1,0,'2026-03-15',NULL,'Código: 922',0),
('prod-pm-668','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-ARMAF-CLUB DE NUIT BLING-MAS','cat-pm-original','perfumes','PM-668',3,0,'2026-03-15',NULL,'Código: 1102',0),
('prod-pm-517','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-ARMAF-CLUB DE NUIT ICONIC-MAS','cat-pm-original','perfumes','PM-517',3,0,'2026-03-15',NULL,'Código: 1048',0),
('prod-pm-12','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-ARMAF-CLUB DE NUIT INTENSE-MAS','cat-pm-original','perfumes','PM-12',1,0,'2026-03-15',NULL,'Código: 911',0),
('prod-pm-399','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-ARMAF-CLUB DE NUIT MALEKA-FEM','cat-pm-original','perfumes','PM-399',3,0,'2026-03-15','2027-06-14','Código: 999',0),
('prod-pm-527','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-ARMAF-CLUB DE NUIT PRECIEUX IV-FEM','cat-pm-original','perfumes','PM-527',2,0,'2026-03-15',NULL,'Código: 1056',0),
('prod-pm-13','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-ARMAF-CLUB DE NUIT SILLAGE-UNI','cat-pm-original','perfumes','PM-13',3,0,'2026-03-15',NULL,'Código: 949',0),
('prod-pm-567','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-ARMAF-CLUB DE NUIT UNTOLD-UNI','cat-pm-original','perfumes','PM-567',3,0,'2026-03-15',NULL,'Código: 1078',0),
('prod-pm-427','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-ARMAF-CLUB DE NUIT WOMAN-FEM','cat-pm-original','perfumes','PM-427',2,0,'2026-03-15','2027-07-09','Código: 1010',0),
('prod-pm-542','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-ARMAF-ISLAND BLISS-FEM','cat-pm-original','perfumes','PM-542',2,0,'2026-03-15',NULL,'Código: 1071',0),
('prod-pm-531','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-ARMAF-ISLAND BREEZE-FEM','cat-pm-original','perfumes','PM-531',3,0,'2026-03-15',NULL,'Código: 1060',0),
('prod-pm-14','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-ARMAF-ODYSSEY AQUA-MAS','cat-pm-original','perfumes','PM-14',2,0,'2026-03-15',NULL,'Código: 950',0),
('prod-pm-15','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-ARMAF-ODYSSEY CANDEE-FEM','cat-pm-original','perfumes','PM-15',0,0,'2026-03-15',NULL,'Código: 962',0),
('prod-pm-516','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-ARMAF-ODYSSEY MANDARIN SKY ELIXIR-MAS','cat-pm-original','perfumes','PM-516',3,0,'2026-03-15',NULL,'Código: 1047',0),
('prod-pm-16','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-ARMAF-ODYSSEY MANDARIN SKY-MAS','cat-pm-original','perfumes','PM-16',0,0,'2026-03-15',NULL,'Código: 941',0),
('prod-pm-392','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-ARMAF-ODYSSEY WHITE EDITION-MAS','cat-pm-original','perfumes','PM-392',3,0,'2026-03-15','2025-06-14','Código: 992',0),
('prod-pm-403','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-ARMAF-SPACE AGE-FEM','cat-pm-original','perfumes','PM-403',0,0,'2026-03-15','2027-06-14','Código: 990',0),
('prod-pm-391','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-ARMAF-TAG HER-FEM','cat-pm-original','perfumes','PM-391',2,0,'2026-03-15','2025-06-14','Código: 991',0),
('prod-pm-543','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-ARMAF-TAG HIM UOMO ROSSO-MAS','cat-pm-original','perfumes','PM-543',3,0,'2026-03-15',NULL,'Código: 1072',0),
('prod-pm-17','6c6980ea-a142-4ac2-8f47-41042517ddb9','ORI-ARMAF-YUM YUM-FEM','cat-pm-original','perfumes','PM-17',2,0,'2026-03-15',NULL,'Código: 971',0)
ON DUPLICATE KEY UPDATE stock=VALUES(stock), reorder_point=VALUES(reorder_point), expiry_date=VALUES(expiry_date), notes=VALUES(notes);

-- ============================================
-- 19. PRODUCTOS - PERFUMERÍA / EXTRACTO (Parte 1: A-C)
-- ============================================
INSERT INTO products
  (id, tenant_id, name, category, product_type, sku, stock, reorder_point, entry_date, expiry_date, notes, sale_price)
VALUES
('prod-pm-159','6c6980ea-a142-4ac2-8f47-41042517ddb9','COD DISPONIBLE','cat-pm-extracto','perfumes','PM-159',0,1,'2026-03-15','2026-08-20','Código: 072 | Stock Máximo: 1',0),
('prod-pm-413','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-AFNAN-9 PM REBEL-UNI','cat-pm-extracto','perfumes','PM-413',323,1,'2026-03-15','2027-06-16','Código: 208 | Stock Máximo: 1',0),
('prod-pm-460','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-AFNAN-9 PM-MAS','cat-pm-extracto','perfumes','PM-460',409,1,'2026-03-15',NULL,'Código: 213 | Stock Máximo: 1',0),
('prod-pm-88','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-AHLI-CORVUS-FEM','cat-pm-extracto','perfumes','PM-88',328,1,'2026-03-15','2026-08-20','Código: 002 | Stock Máximo: 1',0),
('prod-pm-89','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-AHLI-KARPOS-UNI','cat-pm-extracto','perfumes','PM-89',134,1,'2026-03-15','2026-08-20','Código: 003 | Stock Máximo: 1',0),
('prod-pm-87','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-AHLI-PEGASUS-UNI','cat-pm-extracto','perfumes','PM-87',206,1,'2026-03-15','2026-08-20','Código: 001 | Stock Máximo: 1',0),
('prod-pm-90','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-AHLI-VEGA-UNI','cat-pm-extracto','perfumes','PM-90',240,1,'2026-03-15','2026-08-20','Código: 004 | Stock Máximo: 1',0),
('prod-pm-92','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-AL HARAMAIN AMBER OUD DUBAI NIGHT-MAS','cat-pm-extracto','perfumes','PM-92',491,1,'2026-03-15','2026-08-20','Código: 006 | Stock Máximo: 1',0),
('prod-pm-91','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-AL HARAMAIN-AMBER OUD AQUA DUBAI-UNI','cat-pm-extracto','perfumes','PM-91',223,1,'2026-03-15','2026-08-20','Código: 005 | Stock Máximo: 1',0),
('prod-pm-93','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-AL HARMAIN-AMBER OUD GOLD EDITION-UNI','cat-pm-extracto','perfumes','PM-93',263,1,'2026-03-15','2026-08-20','Código: 007 | Stock Máximo: 1',0),
('prod-pm-94','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-ANTONIO BANDERAS-BLUE SEDUCTION-MAS','cat-pm-extracto','perfumes','PM-94',137,1,'2026-03-15','2026-08-20','Código: 008 | Stock Máximo: 1',0),
('prod-pm-381','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-ARIANA GRANDE-ANGEL KISS-FEM','cat-pm-extracto','perfumes','PM-381',337,150,'2026-03-15',NULL,'Código: 2003 | Stock Máximo: 500',0),
('prod-pm-95','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-ARIANA GRANDE-CLOUD PINK-FEM','cat-pm-extracto','perfumes','PM-95',365,1,'2026-03-15','2026-08-20','Código: 009 | Stock Máximo: 1',0),
('prod-pm-96','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-ARIANA GRANDE-CLOUD-FEM','cat-pm-extracto','perfumes','PM-96',359,1,'2026-03-15','2026-08-20','Código: 010 | Stock Máximo: 1',0),
('prod-pm-97','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-ARIANA GRANDE-SWEET LIKE CANDY-FEM','cat-pm-extracto','perfumes','PM-97',267,1,'2026-03-15','2026-08-20','Código: 011 | Stock Máximo: 1',0),
('prod-pm-98','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-ARIANA GRANDE-THANK U NEXT-FEM','cat-pm-extracto','perfumes','PM-98',278,1,'2026-03-15','2026-08-20','Código: 012 | Stock Máximo: 1',0),
('prod-pm-99','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-ARMAF-CLUB DE NUIT INTENSE-MAS','cat-pm-extracto','perfumes','PM-99',339,1,'2026-03-15','2026-08-20','Código: 013 | Stock Máximo: 1',0),
('prod-pm-564','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-ARMAF-CLUB DE NUIT MALEKA-FEM','cat-pm-extracto','perfumes','PM-564',311,0,'2026-03-15',NULL,'Código: 233',0),
('prod-pm-585','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-ARMAF-ISLAND BREEZE-FEM','cat-pm-extracto','perfumes','PM-585',287,1,'2026-03-15',NULL,'Código: 235 | Stock Máximo: 1',0),
('prod-pm-494','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-ARMAF-ODYSSEY CHOCOLAT-UNI','cat-pm-extracto','perfumes','PM-494',182,1,'2026-03-15',NULL,'Código: 217 | Stock Máximo: 1',0),
('prod-pm-410','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-ARMAF-ODYSSEY MANDARIN SKY-MAS','cat-pm-extracto','perfumes','PM-410',132,1,'2026-03-15','2027-06-16','Código: 205 | Stock Máximo: 1',0),
('prod-pm-416','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-ARMAF-YUM YUM-FEM','cat-pm-extracto','perfumes','PM-416',237,1,'2026-03-15','2027-06-16','Código: 211 | Stock Máximo: 1',0),
('prod-pm-100','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-AZZARO-AZZARO POUR HOMME-MAS','cat-pm-extracto','perfumes','PM-100',109,1,'2026-03-15','2025-08-20','Código: 014 | Stock Máximo: 1',0),
('prod-pm-101','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-BBW-CRAZY FOR YOU-FEM','cat-pm-extracto','perfumes','PM-101',265,1,'2026-03-15','2026-08-20','Código: 015 | Stock Máximo: 1',0),
('prod-pm-102','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-BHARARA-BHARARA BLEU-MAS','cat-pm-extracto','perfumes','PM-102',224,1,'2026-03-15','2026-08-20','Código: 016 | Stock Máximo: 1',0),
('prod-pm-415','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-BHARARA-BHARARA CHOCOLATE-UNI','cat-pm-extracto','perfumes','PM-415',274,1,'2026-03-15','2027-06-16','Código: 210 | Stock Máximo: 1',0),
('prod-pm-103','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-BHARARA-BHARARA KING-MAS','cat-pm-extracto','perfumes','PM-103',455,1,'2026-03-15','2026-08-20','Código: 017 | Stock Máximo: 1',0),
('prod-pm-678','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-BHARARA-BHARARA NICHE-UNI','cat-pm-extracto','perfumes','PM-678',200,0,'2026-03-15',NULL,'Código: 238',0),
('prod-pm-406','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-BHARARA-BHARARA ROSE-FEM','cat-pm-extracto','perfumes','PM-406',242,1,'2026-03-15','2027-06-16','Código: 201 | Stock Máximo: 1',0),
('prod-pm-104','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-BOND N9-BLEECKER STREET-UNI','cat-pm-extracto','perfumes','PM-104',124,1,'2026-03-15','2026-08-20','Código: 018 | Stock Máximo: 1',0),
('prod-pm-105','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-BRITNEY SPEARS-FANTASY-FEM','cat-pm-extracto','perfumes','PM-105',201,1,'2026-03-15','2026-08-20','Código: 019 | Stock Máximo: 1',0),
('prod-pm-106','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-BRITNEY SPEARS-MIDNIGHT FANTASY-FEM','cat-pm-extracto','perfumes','PM-106',39,1,'2026-03-15','2026-08-20','Código: 020 | Stock Máximo: 1',0),
('prod-pm-108','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-BURBERRY-BURBERRY HER-FEM','cat-pm-extracto','perfumes','PM-108',256,1,'2026-03-15','2026-08-20','Código: 021 | Stock Máximo: 1',0),
('prod-pm-109','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-BURBERRY-BURBERRY-FEM','cat-pm-extracto','perfumes','PM-109',292,1,'2026-03-15','2026-08-20','Código: 022 | Stock Máximo: 1',0),
('prod-pm-110','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-BVLGARI-AQVA MARINE-MAS','cat-pm-extracto','perfumes','PM-110',196,1,'2026-03-15','2026-08-20','Código: 023 | Stock Máximo: 1',0),
('prod-pm-111','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-BVLGARI-BLV-FEM','cat-pm-extracto','perfumes','PM-111',136,1,'2026-03-15','2026-08-20','Código: 024 | Stock Máximo: 1',0),
('prod-pm-112','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-BVLGARI-BVLGARI MAN IN BLACK-MAS','cat-pm-extracto','perfumes','PM-112',239,1,'2026-03-15','2026-08-20','Código: 025 | Stock Máximo: 1',0),
('prod-pm-113','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-BVLGARI-OMNIA CORAL-FEM','cat-pm-extracto','perfumes','PM-113',158,1,'2026-03-15','2026-08-20','Código: 026 | Stock Máximo: 1',0),
('prod-pm-114','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-BVLGARI-OMNIA CRYSTALLINE-FEM','cat-pm-extracto','perfumes','PM-114',286,1,'2026-03-15','2026-08-20','Código: 027 | Stock Máximo: 1',0),
('prod-pm-115','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-BVLGARI-OMNIA PINK SAPPHIRE-FEM','cat-pm-extracto','perfumes','PM-115',196,1,'2026-03-15','2026-08-20','Código: 028 | Stock Máximo: 1',0),
('prod-pm-116','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-CALVIN KLEIN-CK ONE-UNI','cat-pm-extracto','perfumes','PM-116',84,1,'2026-03-15','2026-08-20','Código: 029 | Stock Máximo: 1',0),
('prod-pm-117','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-CALVIN KLEIN-CKIN2U-FEM','cat-pm-extracto','perfumes','PM-117',197,1,'2026-03-15','2026-08-20','Código: 030 | Stock Máximo: 1',0),
('prod-pm-118','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-CAROLINA HERRERA-212 HEROES FOREVER-MAS','cat-pm-extracto','perfumes','PM-118',294,1,'2026-03-15','2026-08-20','Código: 031 | Stock Máximo: 1',0),
('prod-pm-119','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-CAROLINA HERRERA-212 HEROES-FEM','cat-pm-extracto','perfumes','PM-119',112,1,'2026-03-15','2026-08-20','Código: 032 | Stock Máximo: 1',0),
('prod-pm-120','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-CAROLINA HERRERA-212 SEXY-FEM','cat-pm-extracto','perfumes','PM-120',142,1,'2026-03-15','2026-08-20','Código: 033 | Stock Máximo: 1',0),
('prod-pm-121','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-CAROLINA HERRERA-212 VIP BLACK RED-MAS','cat-pm-extracto','perfumes','PM-121',250,1,'2026-03-15','2026-08-20','Código: 034 | Stock Máximo: 1',0),
('prod-pm-122','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-CAROLINA HERRERA-212 VIP BLACK-MAS','cat-pm-extracto','perfumes','PM-122',367,1,'2026-03-15','2026-08-20','Código: 035 | Stock Máximo: 1',0),
('prod-pm-123','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-CAROLINA HERRERA-212 VIP PARTY FEVER-MAS','cat-pm-extracto','perfumes','PM-123',214,1,'2026-03-15','2026-08-20','Código: 036 | Stock Máximo: 1',0),
('prod-pm-124','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-CAROLINA HERRERA-212 VIP ROSE RED-FEM','cat-pm-extracto','perfumes','PM-124',215,1,'2026-03-15','2025-08-20','Código: 037 | Stock Máximo: 1',0),
('prod-pm-125','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-CAROLINA HERRERA-212 VIP ROSE-FEM','cat-pm-extracto','perfumes','PM-125',372,1,'2026-03-15','2026-08-20','Código: 038 | Stock Máximo: 1',0),
('prod-pm-126','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-CAROLINA HERRERA-212 VIP-FEM','cat-pm-extracto','perfumes','PM-126',195,1,'2026-03-15','2026-08-20','Código: 039 | Stock Máximo: 1',0),
('prod-pm-127','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-CAROLINA HERRERA-212 VIP-MAS','cat-pm-extracto','perfumes','PM-127',358,1,'2026-03-15','2026-08-20','Código: 040 | Stock Máximo: 1',0),
('prod-pm-128','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-CAROLINA HERRERA-212-FEM','cat-pm-extracto','perfumes','PM-128',154,1,'2026-03-15','2026-08-20','Código: 041 | Stock Máximo: 1',0),
('prod-pm-129','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-CAROLINA HERRERA-212-MAS','cat-pm-extracto','perfumes','PM-129',248,1,'2026-03-15','2026-08-20','Código: 042 | Stock Máximo: 1',0),
('prod-pm-130','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-CAROLINA HERRERA-BAD BOY COBALT-MAS','cat-pm-extracto','perfumes','PM-130',230,1,'2026-03-15','2026-08-20','Código: 043 | Stock Máximo: 1',0),
('prod-pm-131','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-CAROLINA HERRERA-BAD BOY-MAS','cat-pm-extracto','perfumes','PM-131',187,1,'2026-03-15','2026-08-20','Código: 044 | Stock Máximo: 1',0),
('prod-pm-132','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-CAROLINA HERRERA-CAROLINA HERRERA-FEM','cat-pm-extracto','perfumes','PM-132',263,1,'2026-03-15','2026-08-20','Código: 045 | Stock Máximo: 1',0),
('prod-pm-133','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-CAROLINA HERRERA-CH-FEM','cat-pm-extracto','perfumes','PM-133',267,1,'2026-03-15','2026-08-20','Código: 046 | Stock Máximo: 1',0),
('prod-pm-134','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-CAROLINA HERRERA-CH-MAS','cat-pm-extracto','perfumes','PM-134',210,1,'2026-03-15','2026-08-20','Código: 047 | Stock Máximo: 1',0),
('prod-pm-135','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-CAROLINA HERRERA-GOOD GIRL BLUSH-FEM','cat-pm-extracto','perfumes','PM-135',226,1,'2026-03-15','2026-08-20','Código: 048 | Stock Máximo: 1',0),
('prod-pm-136','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-CAROLINA HERRERA-GOOD GIRL-FEM','cat-pm-extracto','perfumes','PM-136',243,1,'2026-03-15','2026-08-20','Código: 049 | Stock Máximo: 1',0),
('prod-pm-561','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-CAROLINA HERRERA-LA BOMBA-FEM','cat-pm-extracto','perfumes','PM-561',241,1,'2026-03-15',NULL,'Código: 231 | Stock Máximo: 1',0),
('prod-pm-137','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-CASAMORATI-BOUQUET IDEALE-FEM','cat-pm-extracto','perfumes','PM-137',263,1,'2026-03-15','2026-08-20','Código: 050 | Stock Máximo: 1',0),
('prod-pm-138','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-CHANEL-ALLURE SPORT-MAS','cat-pm-extracto','perfumes','PM-138',170,1,'2026-03-15','2026-08-20','Código: 051 | Stock Máximo: 1',0),
('prod-pm-139','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-CHANEL-BLEU DE CHANEL-MAS','cat-pm-extracto','perfumes','PM-139',177,1,'2026-03-15','2026-08-20','Código: 052 | Stock Máximo: 1',0),
('prod-pm-550','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-CHANEL-CHANCE EAU TENDRE-FEM','cat-pm-extracto','perfumes','PM-550',130,1,'2026-03-15',NULL,'Código: 226 | Stock Máximo: 1',0),
('prod-pm-140','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-CHANEL-CHANCE-FEM','cat-pm-extracto','perfumes','PM-140',150,1,'2026-03-15','2026-08-20','Código: 053 | Stock Máximo: 1',0),
('prod-pm-141','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-CHANEL-COCO MADEMOISELLE-FEM','cat-pm-extracto','perfumes','PM-141',165,1,'2026-03-15','2026-08-20','Código: 054 | Stock Máximo: 1',0),
('prod-pm-142','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-CHANEL-N5-FEM','cat-pm-extracto','perfumes','PM-142',239,1,'2026-03-15','2026-08-20','Código: 055 | Stock Máximo: 1',0),
('prod-pm-147','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-CHRISTIAN DIOR-DIOR HOMME INTENSE-MAS','cat-pm-extracto','perfumes','PM-147',169,1,'2026-03-15','2026-08-20','Código: 060 | Stock Máximo: 1',0),
('prod-pm-143','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-CHRISTIAN DIOR-FAHRENHEIT-MAS','cat-pm-extracto','perfumes','PM-143',145,1,'2026-03-15','2026-08-20','Código: 056 | Stock Máximo: 1',0),
('prod-pm-144','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-CHRISTIAN DIOR-JADORE-FEM','cat-pm-extracto','perfumes','PM-144',149,1,'2026-03-15','2026-08-20','Código: 057 | Stock Máximo: 1',0),
('prod-pm-145','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-CHRISTIAN DIOR-MISS DIOR BOUQUET-FEM','cat-pm-extracto','perfumes','PM-145',207,1,'2026-03-15','2026-08-20','Código: 058 | Stock Máximo: 1',0),
('prod-pm-146','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-CHRISTIAN DIOR-SAUVAGE ELIXIR-MAS','cat-pm-extracto','perfumes','PM-146',208,1,'2026-03-15','2026-08-20','Código: 059 | Stock Máximo: 1',0),
('prod-pm-148','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-CHRISTIAN DIOR-SAUVAGE-MAS','cat-pm-extracto','perfumes','PM-148',348,1,'2026-03-15','2026-08-20','Código: 061 | Stock Máximo: 1',0)
ON DUPLICATE KEY UPDATE stock=VALUES(stock), reorder_point=VALUES(reorder_point), expiry_date=VALUES(expiry_date), notes=VALUES(notes);

-- ============================================
-- 19b. EXTRACTO (Parte 2: C-L)
-- ============================================
INSERT INTO products
  (id, tenant_id, name, category, product_type, sku, stock, reorder_point, entry_date, expiry_date, notes, sale_price)
VALUES
('prod-pm-149','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-CREED-AVENTUS HER-FEM','cat-pm-extracto','perfumes','PM-149',225,1,'2026-03-15','2026-08-20','Código: 062 | Stock Máximo: 1',0),
('prod-pm-150','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-CREED-AVENTUS-MAS','cat-pm-extracto','perfumes','PM-150',377,1,'2026-03-15','2026-08-20','Código: 063 | Stock Máximo: 1',0),
('prod-pm-500','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-CREED-QUEEN OF SILK-FEM','cat-pm-extracto','perfumes','PM-500',351,1,'2026-03-15',NULL,'Código: 220 | Stock Máximo: 1',0),
('prod-pm-151','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-CREED-SILVER MOUNTAIN WATER-MAS','cat-pm-extracto','perfumes','PM-151',238,1,'2026-03-15','2026-08-20','Código: 064 | Stock Máximo: 1',0),
('prod-pm-152','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-CRISTIANO RONALDO-CR7 ORIGINIS-MAS','cat-pm-extracto','perfumes','PM-152',124,1,'2026-03-15','2026-08-20','Código: 065 | Stock Máximo: 1',0),
('prod-pm-153','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-CRISTIANO RONALDO-LEGACY-MAS','cat-pm-extracto','perfumes','PM-153',168,1,'2026-03-15','2026-08-20','Código: 066 | Stock Máximo: 1',0),
('prod-pm-154','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-DIESEL-BAD INTENSE-MAS','cat-pm-extracto','perfumes','PM-154',204,1,'2026-03-15','2026-08-20','Código: 067 | Stock Máximo: 1',0),
('prod-pm-155','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-DIESEL-DIESEL PLUS PLUS-MAS','cat-pm-extracto','perfumes','PM-155',168,1,'2026-03-15','2026-08-20','Código: 068 | Stock Máximo: 1',0),
('prod-pm-156','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-DOLCE Y GABBANA-K-MAS','cat-pm-extracto','perfumes','PM-156',306,1,'2026-03-15','2026-08-20','Código: 069 | Stock Máximo: 1',0),
('prod-pm-157','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-DOLCE Y GABBANA-LIGHT BLUE-FEM','cat-pm-extracto','perfumes','PM-157',122,1,'2026-03-15','2026-08-20','Código: 070 | Stock Máximo: 1',0),
('prod-pm-560','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-DUMONT PARIS-NITRO ELIXIR-MAS','cat-pm-extracto','perfumes','PM-560',146,1,'2026-03-15',NULL,'Código: 230 | Stock Máximo: 1',0),
('prod-pm-584','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-DUMONT PARIS-NITRO RED-MAS','cat-pm-extracto','perfumes','PM-584',188,1,'2026-03-15',NULL,'Código: 234 | Stock Máximo: 1',0),
('prod-pm-158','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-ESCADA-AGUA DE SOL-FEM','cat-pm-extracto','perfumes','PM-158',531,1,'2026-03-15','2026-08-20','Código: 071 | Stock Máximo: 1',0),
('prod-pm-547','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-ESCADA-MIAMI BLOSSOM-FEM','cat-pm-extracto','perfumes','PM-547',211,1,'2026-03-15',NULL,'Código: 223 | Stock Máximo: 1',0),
('prod-pm-160','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-ESCADA-SORBETTO ROSSO-FEM','cat-pm-extracto','perfumes','PM-160',282,1,'2026-03-15','2026-08-20','Código: 073 | Stock Máximo: 1',0),
('prod-pm-161','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-ESCADA-TAJ SUNSET-FEM','cat-pm-extracto','perfumes','PM-161',347,1,'2026-03-15','2026-08-20','Código: 074 | Stock Máximo: 1',0),
('prod-pm-162','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-ESIKA-DORSAY-MAS','cat-pm-extracto','perfumes','PM-162',204,1,'2026-03-15','2026-08-20','Código: 075 | Stock Máximo: 1',0),
('prod-pm-163','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-FACONNABLE-FACONNABLE-MAS','cat-pm-extracto','perfumes','PM-163',211,1,'2026-03-15','2026-08-20','Código: 076 | Stock Máximo: 1',0),
('prod-pm-164','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-GIARDINI DI TOSCANA-BIANCO LATTE-UNI','cat-pm-extracto','perfumes','PM-164',417,1,'2026-03-15','2026-08-20','Código: 077 | Stock Máximo: 1',0),
('prod-pm-165','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-GILLES CANTUEL-ARSENAL-MAS','cat-pm-extracto','perfumes','PM-165',210,1,'2026-03-15','2026-08-20','Código: 078 | Stock Máximo: 1',0),
('prod-pm-166','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-GIORGIO ARMANI-ACQUA DI GIO PROFONDO-MAS','cat-pm-extracto','perfumes','PM-166',268,1,'2026-03-15','2026-08-20','Código: 079 | Stock Máximo: 1',0),
('prod-pm-167','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-GIORGIO ARMANI-ACQUA DI GIO-MAS','cat-pm-extracto','perfumes','PM-167',66,1,'2026-03-15','2026-08-20','Código: 080 | Stock Máximo: 1',0),
('prod-pm-168','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-GIORGIO ARMANI-STRONGER WITH YOU-MAS','cat-pm-extracto','perfumes','PM-168',370,1,'2026-03-15','2026-08-20','Código: 081 | Stock Máximo: 1',0),
('prod-pm-169','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-GIVENCHY-GIVENCHY BLUE-MAS','cat-pm-extracto','perfumes','PM-169',183,1,'2026-03-15','2026-08-20','Código: 082 | Stock Máximo: 1',0),
('prod-pm-170','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-GIVENCHY-GIVENCHY-MAS','cat-pm-extracto','perfumes','PM-170',209,1,'2026-03-15','2026-08-20','Código: 083 | Stock Máximo: 1',0),
('prod-pm-171','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-GUCCI-GUCCI GUILTY POUR HOMME-MAS','cat-pm-extracto','perfumes','PM-171',303,1,'2026-03-15','2026-08-20','Código: 084 | Stock Máximo: 1',0),
('prod-pm-172','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-HUGO BOSS-BOSS BOTTLED NIGHT-MAS','cat-pm-extracto','perfumes','PM-172',184,1,'2026-03-15','2026-08-20','Código: 085 | Stock Máximo: 1',0),
('prod-pm-173','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-HUGO BOSS-BOSS BOTTLED UNLIMITED-MAS','cat-pm-extracto','perfumes','PM-173',289,1,'2026-03-15','2026-08-20','Código: 086 | Stock Máximo: 1',0),
('prod-pm-174','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-HUGO BOSS-HUGO BOSS-MAS','cat-pm-extracto','perfumes','PM-174',215,1,'2026-03-15','2026-08-20','Código: 087 | Stock Máximo: 1',0),
('prod-pm-175','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-HUGO BOSS-HUGO RED-MAS','cat-pm-extracto','perfumes','PM-175',506,1,'2026-03-15','2026-08-20','Código: 088 | Stock Máximo: 1',0),
('prod-pm-679','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-ILMIN-IL FEMME-UNI','cat-pm-extracto','perfumes','PM-679',200,0,'2026-03-15',NULL,'Código: 239',0),
('prod-pm-176','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-ISSEY MIYAKE-ISSEY MIYAKE-FEM','cat-pm-extracto','perfumes','PM-176',339,1,'2026-03-15','2026-08-20','Código: 089 | Stock Máximo: 1',0),
('prod-pm-177','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-ISSEY MIYAKE-ISSEY MIYAKE-MAS','cat-pm-extracto','perfumes','PM-177',224,1,'2026-03-15','2026-08-20','Código: 090 | Stock Máximo: 1',0),
('prod-pm-178','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-JEAN PASCAL-JEAN PASCAL-MAS','cat-pm-extracto','perfumes','PM-178',255,1,'2026-03-15','2026-08-20','Código: 091 | Stock Máximo: 1',0),
('prod-pm-412','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-JEAN PAUL GAULTIER-DIVINE-FEM','cat-pm-extracto','perfumes','PM-412',203,1,'2026-03-15','2027-06-16','Código: 207 | Stock Máximo: 1',0),
('prod-pm-179','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-JEAN PAUL GAULTIER-LE MALE-MAS','cat-pm-extracto','perfumes','PM-179',190,1,'2026-03-15','2026-08-20','Código: 092 | Stock Máximo: 1',0),
('prod-pm-180','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-JEAN PAUL GAULTIER-LE BEAU-MAS','cat-pm-extracto','perfumes','PM-180',166,1,'2026-03-15','2026-08-20','Código: 093 | Stock Máximo: 1',0),
('prod-pm-181','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-JEAN PAUL GAULTIER-LE MALE ELIXIR-MAS','cat-pm-extracto','perfumes','PM-181',148,1,'2026-03-15','2026-08-20','Código: 094 | Stock Máximo: 1',0),
('prod-pm-182','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-JEAN PAUL GAULTIER-SCANDAL-FEM','cat-pm-extracto','perfumes','PM-182',307,1,'2026-03-15','2026-08-20','Código: 095 | Stock Máximo: 1',0),
('prod-pm-183','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-JEAN PAUL GAULTIER-SCANDAL-MAS','cat-pm-extracto','perfumes','PM-183',256,1,'2026-03-15','2026-08-20','Código: 096 | Stock Máximo: 1',0),
('prod-pm-184','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-JEAN PAUL GAULTIER-ULTRA MALE-MAS','cat-pm-extracto','perfumes','PM-184',304,1,'2026-03-15','2026-08-20','Código: 097 | Stock Máximo: 1',0),
('prod-pm-185','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-KAJAL-ALMAZ-UNI','cat-pm-extracto','perfumes','PM-185',214,1,'2026-03-15','2026-08-20','Código: 098 | Stock Máximo: 1',0),
('prod-pm-409','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-KAJAL-DAHAB-FEM','cat-pm-extracto','perfumes','PM-409',339,1,'2026-03-15','2027-06-16','Código: 204 | Stock Máximo: 1',0),
('prod-pm-186','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-KENZO-FLOWER BY KENZO-FEM','cat-pm-extracto','perfumes','PM-186',181,1,'2026-03-15','2026-08-20','Código: 099 | Stock Máximo: 1',0),
('prod-pm-187','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-KIM KARDASHIAN-BFF-FEM','cat-pm-extracto','perfumes','PM-187',375,1,'2026-03-15','2026-08-20','Código: 100 | Stock Máximo: 1',0),
('prod-pm-188','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-LACOSTE-LACOSTE BLANC-MAS','cat-pm-extracto','perfumes','PM-188',176,1,'2026-03-15','2026-08-20','Código: 101 | Stock Máximo: 1',0),
('prod-pm-189','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-LACOSTE-LACOSTE ESSENTIAL-MAS','cat-pm-extracto','perfumes','PM-189',266,1,'2026-03-15','2026-08-20','Código: 102 | Stock Máximo: 1',0),
('prod-pm-190','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-LACOSTE-LACOSTE NOIR-MAS','cat-pm-extracto','perfumes','PM-190',144,1,'2026-03-15','2026-08-20','Código: 103 | Stock Máximo: 1',0),
('prod-pm-191','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-LACOSTE-LACOSTE RED-MAS','cat-pm-extracto','perfumes','PM-191',198,1,'2026-03-15','2026-08-20','Código: 104 | Stock Máximo: 1',0),
('prod-pm-192','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-LACOSTE-LACOSTE WOMAN-FEM','cat-pm-extracto','perfumes','PM-192',259,1,'2026-03-15','2026-08-20','Código: 105 | Stock Máximo: 1',0),
('prod-pm-193','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-LACOSTE-TOUCH OF PINK-FEM','cat-pm-extracto','perfumes','PM-193',271,1,'2026-03-15','2026-08-20','Código: 106 | Stock Máximo: 1',0),
('prod-pm-194','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-LANCOME-LA VIDA ES BELLA FLORAL-FEM','cat-pm-extracto','perfumes','PM-194',207,1,'2026-03-15','2026-08-20','Código: 107 | Stock Máximo: 1',0),
('prod-pm-195','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-LANCOME-LA VIDA ES BELLA-FEM','cat-pm-extracto','perfumes','PM-195',144,1,'2026-03-15','2026-08-20','Código: 108 | Stock Máximo: 1',0),
('prod-pm-478','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-LATTAFA-AFEEF-UNI','cat-pm-extracto','perfumes','PM-478',396,1,'2026-03-15',NULL,'Código: 215 | Stock Máximo: 1',0),
('prod-pm-197','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-LATTAFA-AL NOBLE AMEER-UNI','cat-pm-extracto','perfumes','PM-197',163,1,'2026-03-15','2026-08-20','Código: 110 | Stock Máximo: 1',0),
('prod-pm-198','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-LATTAFA-AMETHYST-UNI','cat-pm-extracto','perfumes','PM-198',293,1,'2026-03-15','2026-08-20','Código: 111 | Stock Máximo: 1',0),
('prod-pm-557','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-LATTAFA-ART OF UNIVERSE-UNI','cat-pm-extracto','perfumes','PM-557',256,1,'2026-03-15',NULL,'Código: 227 | Stock Máximo: 1',0),
('prod-pm-199','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-LATTAFA-ASAD-MAS','cat-pm-extracto','perfumes','PM-199',210,1,'2026-03-15','2026-08-20','Código: 112 | Stock Máximo: 1',0),
('prod-pm-588','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-LATTAFA-ECLAIRE-FEM','cat-pm-extracto','perfumes','PM-588',132,1,'2026-03-15',NULL,'Código: 237 | Stock Máximo: 1',0),
('prod-pm-204','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-LATTAFA-EMEER-UNI','cat-pm-extracto','perfumes','PM-204',159,1,'2026-03-15','2026-08-20','Código: 117 | Stock Máximo: 1',0),
('prod-pm-200','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-LATTAFA-HAYA-FEM','cat-pm-extracto','perfumes','PM-200',439,1,'2026-03-15','2026-08-20','Código: 113 | Stock Máximo: 1',0),
('prod-pm-201','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-LATTAFA-HONOR Y GLORY-UNI','cat-pm-extracto','perfumes','PM-201',237,1,'2026-03-15','2026-08-20','Código: 114 | Stock Máximo: 1',0),
('prod-pm-549','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-LATTAFA-KHAMRAH DUKHAN-UNI','cat-pm-extracto','perfumes','PM-549',147,1,'2026-03-15',NULL,'Código: 225 | Stock Máximo: 1',0),
('prod-pm-202','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-LATTAFA-KHAMRAH-UNI','cat-pm-extracto','perfumes','PM-202',212,1,'2026-03-15','2026-08-20','Código: 115 | Stock Máximo: 1',0),
('prod-pm-559','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-LATTAFA-MALLOW MADNESS-FEM','cat-pm-extracto','perfumes','PM-559',145,1,'2026-03-15',NULL,'Código: 229 | Stock Máximo: 1',0),
('prod-pm-495','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-LATTAFA-MAYAR-FEM','cat-pm-extracto','perfumes','PM-495',310,1,'2026-03-15',NULL,'Código: 218 | Stock Máximo: 1',0),
('prod-pm-196','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-LATTAFA-NOBLE BLUSH-FEM','cat-pm-extracto','perfumes','PM-196',407,1,'2026-03-15','2026-08-20','Código: 109 | Stock Máximo: 1',0),
('prod-pm-203','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-LATTAFA-OUD FOR GLORY-UNI','cat-pm-extracto','perfumes','PM-203',206,1,'2026-03-15','2026-08-20','Código: 116 | Stock Máximo: 1',0),
('prod-pm-205','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-LATTAFA-QAED AL FURSAN-UNI','cat-pm-extracto','perfumes','PM-205',387,1,'2026-03-15','2026-08-20','Código: 118 | Stock Máximo: 1',0),
('prod-pm-206','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-LATTAFA-RAMZ SILVER-UNI','cat-pm-extracto','perfumes','PM-206',145,1,'2026-03-15','2026-08-20','Código: 119 | Stock Máximo: 1',0),
('prod-pm-207','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-LATTAFA-SHAHEEN GOLD-UNI','cat-pm-extracto','perfumes','PM-207',177,1,'2026-03-15','2026-08-20','Código: 120 | Stock Máximo: 1',0),
('prod-pm-208','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-LATTAFA-SUBLIME-UNI','cat-pm-extracto','perfumes','PM-208',263,1,'2026-03-15','2026-08-20','Código: 121 | Stock Máximo: 1',0),
('prod-pm-562','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-LATTAFA-VAINILLA FREAK-FEM','cat-pm-extracto','perfumes','PM-562',179,1,'2026-03-15',NULL,'Código: 232 | Stock Máximo: 1',0),
('prod-pm-411','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-LATTAFA-VICTORIA-UNI','cat-pm-extracto','perfumes','PM-411',105,1,'2026-03-15','2027-06-16','Código: 206 | Stock Máximo: 1',0),
('prod-pm-209','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-LATTAFA-YARA CANDY-FEM','cat-pm-extracto','perfumes','PM-209',187,1,'2026-03-15','2026-08-20','Código: 122 | Stock Máximo: 1',0),
('prod-pm-210','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-LATTAFA-YARA-FEM','cat-pm-extracto','perfumes','PM-210',252,1,'2026-03-15','2026-08-20','Código: 123 | Stock Máximo: 1',0),
('prod-pm-211','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-LE LABO-SANTAL 33-UNI','cat-pm-extracto','perfumes','PM-211',322,1,'2026-03-15','2026-08-20','Código: 124 | Stock Máximo: 1',0),
('prod-pm-212','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-LOEWE-SOLO-MAS','cat-pm-extracto','perfumes','PM-212',438,1,'2026-03-15','2026-08-20','Código: 125 | Stock Máximo: 1',0),
('prod-pm-213','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-LOLITA LEMPICKA-LOLITA LEMPICKA-FEM','cat-pm-extracto','perfumes','PM-213',181,1,'2026-03-15','2026-08-20','Código: 126 | Stock Máximo: 1',0),
('prod-pm-214','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-LORENZO PAZZAGLIA-SUMMER HAMMER-UNI','cat-pm-extracto','perfumes','PM-214',216,1,'2026-03-15','2026-08-20','Código: 127 | Stock Máximo: 1',0),
('prod-pm-464','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-LORENZO PAZZAGLIA-SUN GRIA-UNI','cat-pm-extracto','perfumes','PM-464',177,1,'2026-03-15',NULL,'Código: 214 | Stock Máximo: 1',0)
ON DUPLICATE KEY UPDATE stock=VALUES(stock), reorder_point=VALUES(reorder_point), expiry_date=VALUES(expiry_date), notes=VALUES(notes);

-- ============================================
-- 19c. EXTRACTO (Parte 3: L-Z)
-- ============================================
INSERT INTO products
  (id, tenant_id, name, category, product_type, sku, stock, reorder_point, entry_date, expiry_date, notes, sale_price)
VALUES
('prod-pm-414','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-LOUIS VOUITTON-IMAGINATION-MAS','cat-pm-extracto','perfumes','PM-414',229,1,'2026-03-15','2027-06-16','Código: 209 | Stock Máximo: 1',0),
('prod-pm-215','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-LOUIS VOUITTON-L IMMENSITE-MAS','cat-pm-extracto','perfumes','PM-215',211,1,'2026-03-15','2026-08-20','Código: 128 | Stock Máximo: 1',0),
('prod-pm-501','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-LOUIS VOUITTON-OMBRE NOMADE-MAS','cat-pm-extracto','perfumes','PM-501',128,1,'2026-03-15',NULL,'Código: 221 | Stock Máximo: 1',0),
('prod-pm-216','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-MAISON CRIVELLI-OUD MARACUJA-UNI','cat-pm-extracto','perfumes','PM-216',96,1,'2026-03-15','2026-08-20','Código: 129 | Stock Máximo: 1',0),
('prod-pm-217','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-MAISON FRANCIS KURKDJIAN-BACCARAT ROUGE 540-UNI','cat-pm-extracto','perfumes','PM-217',209,1,'2026-03-15','2026-08-20','Código: 130 | Stock Máximo: 1',0),
('prod-pm-418','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-MANCERA-RED TOBACCO-UNI','cat-pm-extracto','perfumes','PM-418',179,1,'2026-03-15','2027-07-04','Código: 212 | Stock Máximo: 1',0),
('prod-pm-218','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-MARC JACOBS-DAISY LOVE-FEM','cat-pm-extracto','perfumes','PM-218',259,1,'2026-03-15','2026-08-20','Código: 131 | Stock Máximo: 1',0),
('prod-pm-219','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-MONTALE-ARABIANS TONKA-UNI','cat-pm-extracto','perfumes','PM-219',200,1,'2026-03-15','2026-08-20','Código: 132 | Stock Máximo: 1',0),
('prod-pm-220','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-MONTALE-NEPAL AOUD-FEM','cat-pm-extracto','perfumes','PM-220',209,1,'2026-03-15','2026-08-20','Código: 133 | Stock Máximo: 1',0),
('prod-pm-221','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-MONTALE-STARRY NIGHT-UNI','cat-pm-extracto','perfumes','PM-221',248,1,'2026-03-15','2026-08-20','Código: 134 | Stock Máximo: 1',0),
('prod-pm-222','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-MONTBLANC-STARWALKER-MAS','cat-pm-extracto','perfumes','PM-222',338,1,'2026-03-15','2026-08-20','Código: 135 | Stock Máximo: 1',0),
('prod-pm-223','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-MOSCHINO-MOSCHINO FOREVER-MAS','cat-pm-extracto','perfumes','PM-223',209,1,'2026-03-15','2026-08-20','Código: 136 | Stock Máximo: 1',0),
('prod-pm-224','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-MOSCHINO-TOY 2 BUBBLE GUM-FEM','cat-pm-extracto','perfumes','PM-224',156,1,'2026-03-15','2026-08-20','Código: 137 | Stock Máximo: 1',0),
('prod-pm-225','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-MOSCHINO-TOY 2 PEARL-UNI','cat-pm-extracto','perfumes','PM-225',178,1,'2026-03-15','2026-08-20','Código: 138 | Stock Máximo: 1',0),
('prod-pm-226','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-MOSCHINO-TOY 2-FEM','cat-pm-extracto','perfumes','PM-226',84,1,'2026-03-15','2026-08-20','Código: 139 | Stock Máximo: 1',0),
('prod-pm-227','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-MOSCHINO-TOY BOY-MAS','cat-pm-extracto','perfumes','PM-227',171,1,'2026-03-15','2026-08-20','Código: 140 | Stock Máximo: 1',0),
('prod-pm-228','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-NAUTICA-NAUTICA VOYAGE-MAS','cat-pm-extracto','perfumes','PM-228',272,1,'2026-03-15','2026-08-20','Código: 141 | Stock Máximo: 1',0),
('prod-pm-229','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-ORIENTICA-AMBER ROUGE-UNI','cat-pm-extracto','perfumes','PM-229',318,1,'2026-03-15','2026-08-20','Código: 142 | Stock Máximo: 1',0),
('prod-pm-230','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-ORIENTICA-VELVET GOLD-FEM','cat-pm-extracto','perfumes','PM-230',253,1,'2026-03-15','2026-08-20','Código: 143 | Stock Máximo: 1',0),
('prod-pm-231','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-OSCAR DE LA RENTA-OSCAR DE LA RENTA-MAS','cat-pm-extracto','perfumes','PM-231',117,1,'2026-03-15','2026-08-20','Código: 144 | Stock Máximo: 1',0),
('prod-pm-232','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-PACO RABANNE-1 MILLION ELIXIR-MAS','cat-pm-extracto','perfumes','PM-232',372,1,'2026-03-15','2026-08-20','Código: 145 | Stock Máximo: 1',0),
('prod-pm-233','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-PACO RABANNE-1 MILLION INTENSE-MAS','cat-pm-extracto','perfumes','PM-233',179,1,'2026-03-15','2026-08-20','Código: 146 | Stock Máximo: 1',0),
('prod-pm-234','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-PACO RABANNE-1 MILLION LUCKY-MAS','cat-pm-extracto','perfumes','PM-234',319,1,'2026-03-15','2026-08-20','Código: 147 | Stock Máximo: 1',0),
('prod-pm-235','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-PACO RABANNE-1 MILLION PRIVE-MAS','cat-pm-extracto','perfumes','PM-235',142,1,'2026-03-15','2026-08-20','Código: 148 | Stock Máximo: 1',0),
('prod-pm-236','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-PACO RABANNE-1 MILLION ROYAL-MAS','cat-pm-extracto','perfumes','PM-236',348,1,'2026-03-15','2026-08-20','Código: 149 | Stock Máximo: 1',0),
('prod-pm-237','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-PACO RABANNE-1 MILLION-MAS','cat-pm-extracto','perfumes','PM-237',539,1,'2026-03-15','2026-08-20','Código: 150 | Stock Máximo: 1',0),
('prod-pm-238','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-PACO RABANNE-BLACK XS AFRODISIACA-MAS','cat-pm-extracto','perfumes','PM-238',304,1,'2026-03-15','2026-08-20','Código: 151 | Stock Máximo: 1',0),
('prod-pm-239','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-PACO RABANNE-BLACK XS-MAS','cat-pm-extracto','perfumes','PM-239',266,1,'2026-03-15','2026-07-20','Código: 152 | Stock Máximo: 1',0),
('prod-pm-240','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-PACO RABANNE-FAME-FEM','cat-pm-extracto','perfumes','PM-240',150,1,'2026-03-15','2026-08-20','Código: 153 | Stock Máximo: 1',0),
('prod-pm-241','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-PACO RABANNE-INVICTUS INTENSE-MAS','cat-pm-extracto','perfumes','PM-241',236,1,'2026-03-15','2026-08-20','Código: 154 | Stock Máximo: 1',0),
('prod-pm-242','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-PACO RABANNE-INVICTUS LEGEND-MAS','cat-pm-extracto','perfumes','PM-242',106,1,'2026-03-15','2026-08-20','Código: 155 | Stock Máximo: 1',0),
('prod-pm-502','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-PACO RABANNE-INVICTUS VICTORY ABSOLU-MAS','cat-pm-extracto','perfumes','PM-502',322,1,'2026-03-15',NULL,'Código: 222 | Stock Máximo: 1',0),
('prod-pm-243','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-PACO RABANNE-INVICTUS VICTORY ELIXIR-MAS','cat-pm-extracto','perfumes','PM-243',129,1,'2026-03-15','2026-08-20','Código: 156 | Stock Máximo: 1',0),
('prod-pm-244','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-PACO RABANNE-INVICTUS VICTORY-MAS','cat-pm-extracto','perfumes','PM-244',158,1,'2026-03-15','2026-08-20','Código: 157 | Stock Máximo: 1',0),
('prod-pm-245','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-PACO RABANNE-INVICTUS-MAS','cat-pm-extracto','perfumes','PM-245',83,1,'2026-03-15','2026-08-20','Código: 158 | Stock Máximo: 1',0),
('prod-pm-246','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-PACO RABANNE-LADY MILLION GOLD-FEM','cat-pm-extracto','perfumes','PM-246',299,1,'2026-03-15','2026-08-20','Código: 159 | Stock Máximo: 1',0),
('prod-pm-247','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-PACO RABANNE-LADY MILLION-FEM','cat-pm-extracto','perfumes','PM-247',236,1,'2026-03-15','2026-08-20','Código: 160 | Stock Máximo: 1',0),
('prod-pm-248','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-PACO RABANNE-OLYMPEA-FEM','cat-pm-extracto','perfumes','PM-248',158,1,'2026-03-15','2026-08-20','Código: 161 | Stock Máximo: 1',0),
('prod-pm-249','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-PACO RABANNE-PHANTOM INTENSE-MAS','cat-pm-extracto','perfumes','PM-249',227,1,'2026-03-15','2026-08-20','Código: 162 | Stock Máximo: 1',0),
('prod-pm-250','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-PACO RABANNE-PURE XS-FEM','cat-pm-extracto','perfumes','PM-250',276,1,'2026-03-15','2026-08-20','Código: 163 | Stock Máximo: 1',0),
('prod-pm-251','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-PACO RABANNE-PURE XS-MAS','cat-pm-extracto','perfumes','PM-251',194,1,'2026-03-15','2026-08-20','Código: 164 | Stock Máximo: 1',0),
('prod-pm-587','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-PARFUMS DE MARLY-ALTHAIR-MAS','cat-pm-extracto','perfumes','PM-587',161,0,'2026-03-15',NULL,'Código: 236',0),
('prod-pm-252','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-PARFUMS DE MARLY-DELINA-FEM','cat-pm-extracto','perfumes','PM-252',126,1,'2026-03-15','2026-08-20','Código: 165 | Stock Máximo: 1',0),
('prod-pm-253','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-PARFUMS DE MARLY-KALAN-UNI','cat-pm-extracto','perfumes','PM-253',163,1,'2026-03-15','2026-08-20','Código: 166 | Stock Máximo: 1',0),
('prod-pm-254','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-PARFUMS DE MARLY-LAYTON-UNI','cat-pm-extracto','perfumes','PM-254',274,1,'2026-03-15','2026-08-20','Código: 167 | Stock Máximo: 1',0),
('prod-pm-255','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-PARIS HILTON-CAN CAN-FEM','cat-pm-extracto','perfumes','PM-255',129,1,'2026-03-15','2026-08-20','Código: 168 | Stock Máximo: 1',0),
('prod-pm-256','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-PARIS HILTON-DAZZLE-FEM','cat-pm-extracto','perfumes','PM-256',153,1,'2026-03-15','2026-08-20','Código: 169 | Stock Máximo: 1',0),
('prod-pm-257','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-PARIS HILTON-HEIRESS-FEM','cat-pm-extracto','perfumes','PM-257',320,1,'2026-03-15','2026-08-20','Código: 170 | Stock Máximo: 1',0),
('prod-pm-258','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-PARIS HILTON-PARIS HILTON-FEM','cat-pm-extracto','perfumes','PM-258',291,1,'2026-03-15','2026-08-20','Código: 171 | Stock Máximo: 1',0),
('prod-pm-259','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-PARIS HILTON-ROSE RUSH-FEM','cat-pm-extracto','perfumes','PM-259',177,1,'2026-03-15','2026-08-20','Código: 172 | Stock Máximo: 1',0),
('prod-pm-260','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-PERRY ELLIS-360 PURPLE-FEM','cat-pm-extracto','perfumes','PM-260',276,1,'2026-03-15','2026-08-20','Código: 173 | Stock Máximo: 1',0),
('prod-pm-261','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-PERRY ELLIS-360-FEM','cat-pm-extracto','perfumes','PM-261',225,1,'2026-03-15','2026-08-20','Código: 174 | Stock Máximo: 1',0),
('prod-pm-262','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-PERRY ELLIS-360-MAS','cat-pm-extracto','perfumes','PM-262',200,1,'2026-03-15','2026-08-20','Código: 175 | Stock Máximo: 1',0),
('prod-pm-558','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-PRADA-PARADOXE-FEM','cat-pm-extracto','perfumes','PM-558',333,1,'2026-03-15',NULL,'Código: 228 | Stock Máximo: 1',0),
('prod-pm-263','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-RALPH LAUREN-POLO BLUE-MAS','cat-pm-extracto','perfumes','PM-263',239,1,'2026-03-15','2026-08-20','Código: 176 | Stock Máximo: 1',0),
('prod-pm-264','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-RALPH LAUREN-POLO RED-MAS','cat-pm-extracto','perfumes','PM-264',265,0,'2026-03-15','2026-08-20','Código: 177',0),
('prod-pm-265','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-RALPH LAUREN-RALPH-FEM','cat-pm-extracto','perfumes','PM-265',239,1,'2026-03-15','2026-08-20','Código: 178 | Stock Máximo: 1',0),
('prod-pm-499','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-SABRINA CARPENTER-SWEET TOOTH-FEM','cat-pm-extracto','perfumes','PM-499',191,1,'2026-03-15',NULL,'Código: 219 | Stock Máximo: 1',0),
('prod-pm-266','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-SELENA GOMEZ-SELENA GOMEZ-FEM','cat-pm-extracto','perfumes','PM-266',222,1,'2026-03-15','2026-08-20','Código: 179 | Stock Máximo: 1',0),
('prod-pm-267','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-SHAKIRA-ELIXIR-FEM','cat-pm-extracto','perfumes','PM-267',207,1,'2026-03-15','2026-08-20','Código: 180 | Stock Máximo: 1',0),
('prod-pm-268','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-SOFIA VERGARA-SOFIA-FEM','cat-pm-extracto','perfumes','PM-268',307,1,'2026-03-15','2026-08-20','Código: 181 | Stock Máximo: 1',0),
('prod-pm-269','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-TED LAPIDUS-LAPIDUS POUR HOMME-MAS','cat-pm-extracto','perfumes','PM-269',230,1,'2026-03-15','2026-08-20','Código: 182 | Stock Máximo: 1',0),
('prod-pm-270','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-THIERRY MUGLER-ANGEL-FEM','cat-pm-extracto','perfumes','PM-270',113,1,'2026-03-15','2026-08-20','Código: 183 | Stock Máximo: 1',0),
('prod-pm-271','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-THIERRY MUGLER-ANGEL-MAS','cat-pm-extracto','perfumes','PM-271',93,1,'2026-03-15','2026-08-20','Código: 184 | Stock Máximo: 1',0),
('prod-pm-272','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-TOMMY HILFIGER-TOMMY GIRL-FEM','cat-pm-extracto','perfumes','PM-272',182,1,'2026-03-15','2026-08-20','Código: 185 | Stock Máximo: 1',0),
('prod-pm-273','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-TOMMY HILFIGER-TOMMY-MAS','cat-pm-extracto','perfumes','PM-273',270,1,'2026-03-15','2026-08-20','Código: 186 | Stock Máximo: 1',0),
('prod-pm-479','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-VALENTINO-DONNA BORN ROMA EXTRADOSE-FEM','cat-pm-extracto','perfumes','PM-479',284,1,'2026-03-15',NULL,'Código: 216 | Stock Máximo: 1',0),
('prod-pm-548','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-VALENTINO-DONNA CLASICA-FEM','cat-pm-extracto','perfumes','PM-548',197,1,'2026-03-15',NULL,'Código: 224 | Stock Máximo: 1',0),
('prod-pm-274','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-VALENTINO-UOMO BORN IN ROMA INTENSE-MAS','cat-pm-extracto','perfumes','PM-274',193,1,'2026-03-15','2026-08-20','Código: 187 | Stock Máximo: 1',0),
('prod-pm-275','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-VERSACE-BRIGHT CRYSTAL-FEM','cat-pm-extracto','perfumes','PM-275',194,1,'2026-03-15','2026-08-20','Código: 188 | Stock Máximo: 1',0),
('prod-pm-276','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-VERSACE-DYLAN PURPLE-FEM','cat-pm-extracto','perfumes','PM-276',426,1,'2026-03-15','2026-08-20','Código: 189 | Stock Máximo: 1',0),
('prod-pm-277','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-VERSACE-DYLAN TURQUOISE-FEM','cat-pm-extracto','perfumes','PM-277',238,1,'2026-03-15','2026-08-20','Código: 190 | Stock Máximo: 1',0),
('prod-pm-408','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-VERSACE-EROS ENERGY-MAS','cat-pm-extracto','perfumes','PM-408',150,1,'2026-03-15','2027-06-16','Código: 203 | Stock Máximo: 1',0),
('prod-pm-278','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-VERSACE-EROS-MAS','cat-pm-extracto','perfumes','PM-278',313,1,'2026-03-15','2026-08-20','Código: 191 | Stock Máximo: 1',0),
('prod-pm-279','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-VICTORIA SECRET-BOMBSHELL-FEM','cat-pm-extracto','perfumes','PM-279',199,1,'2026-03-15','2026-08-20','Código: 192 | Stock Máximo: 1',0),
('prod-pm-280','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-VICTORIA SECRET-COCONUT PASSION-FEM','cat-pm-extracto','perfumes','PM-280',300,1,'2026-03-15','2026-08-20','Código: 193 | Stock Máximo: 1',0),
('prod-pm-281','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-VICTORINOX-SWISS ARMY-MAS','cat-pm-extracto','perfumes','PM-281',49,1,'2026-03-15','2026-08-20','Código: 194 | Stock Máximo: 1',0),
('prod-pm-282','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-XERJOFF-ERBA PURA-UNI','cat-pm-extracto','perfumes','PM-282',183,1,'2026-03-15','2026-08-20','Código: 195 | Stock Máximo: 1',0),
('prod-pm-407','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-XERJOFF-NAXOS-UNI','cat-pm-extracto','perfumes','PM-407',249,1,'2026-03-15','2027-06-16','Código: 202 | Stock Máximo: 1',0),
('prod-pm-283','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-YANBAL-OHM-MAS','cat-pm-extracto','perfumes','PM-283',290,1,'2026-03-15','2026-08-20','Código: 196 | Stock Máximo: 1',0),
('prod-pm-284','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-YANBAL-SOLO-MAS','cat-pm-extracto','perfumes','PM-284',226,1,'2026-03-15','2026-08-20','Código: 197 | Stock Máximo: 1',0),
('prod-pm-285','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-YVES SAINT LAURENT-BABYCAT-FEM','cat-pm-extracto','perfumes','PM-285',260,1,'2026-03-15','2026-08-20','Código: 198 | Stock Máximo: 1',0),
('prod-pm-286','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-YVES SAINT LAURENT-BLACK OPIUM-FEM','cat-pm-extracto','perfumes','PM-286',261,1,'2026-03-15','2026-08-20','Código: 199 | Stock Máximo: 1',0),
('prod-pm-287','6c6980ea-a142-4ac2-8f47-41042517ddb9','EXT-YVES SAINT LAURENT-Y-MAS','cat-pm-extracto','perfumes','PM-287',226,1,'2026-03-15','2026-08-20','Código: 200 | Stock Máximo: 1',0)
ON DUPLICATE KEY UPDATE stock=VALUES(stock), reorder_point=VALUES(reorder_point), expiry_date=VALUES(expiry_date), notes=VALUES(notes);

-- ============================================
-- FIN DEL SCRIPT
-- NOTA: Los datos de ORIGINAL (ORI-) fueron truncados en el informe fuente
-- a partir de ORI-ARMAF-YUM YUM-FEM (ID 17). Agregar los restantes manualmente.
-- Total de productos cargados: ~450
-- ============================================
