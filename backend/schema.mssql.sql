IF OBJECT_ID('dbo.customers', 'U') IS NULL
CREATE TABLE dbo.customers (
  id NVARCHAR(120) NOT NULL PRIMARY KEY,
  customer_code NVARCHAR(40) NULL,
  name NVARCHAR(255) NOT NULL UNIQUE,
  phone NVARCHAR(100) NULL,
  a5_customer_id NVARCHAR(120) NULL,
  notes NVARCHAR(MAX) NULL,
  created_at NVARCHAR(40) NOT NULL DEFAULT CONVERT(NVARCHAR(40), SYSUTCDATETIME(), 126),
  updated_at NVARCHAR(40) NOT NULL DEFAULT CONVERT(NVARCHAR(40), SYSUTCDATETIME(), 126)
);
GO

IF OBJECT_ID('dbo.pricings', 'U') IS NULL
CREATE TABLE dbo.pricings (
  id NVARCHAR(120) NOT NULL PRIMARY KEY,
  pricing_number NVARCHAR(120) NOT NULL,
  customer_id NVARCHAR(120) NULL,
  pricing_date NVARCHAR(40) NULL,
  fabric_type NVARCHAR(500) NULL,
  material_type NVARCHAR(255) NULL,
  dyehouse NVARCHAR(255) NULL,
  color_class NVARCHAR(255) NULL,
  quantity FLOAT DEFAULT 0,
  inch_width FLOAT DEFAULT 0,
  finished_weight FLOAT DEFAULT 0,
  raw_cost FLOAT DEFAULT 0,
  dye_cost FLOAT DEFAULT 0,
  waste_percent FLOAT DEFAULT 0,
  extra_cost FLOAT DEFAULT 0,
  profit_per_kg FLOAT DEFAULT 0,
  unit_price FLOAT DEFAULT 0,
  total_price FLOAT DEFAULT 0,
  pricing_items_json NVARCHAR(MAX) NULL,
  payment_terms NVARCHAR(255) NULL,
  notes NVARCHAR(MAX) NULL,
  status NVARCHAR(80) DEFAULT 'draft',
  created_at NVARCHAR(40) NOT NULL DEFAULT CONVERT(NVARCHAR(40), SYSUTCDATETIME(), 126),
  updated_at NVARCHAR(40) NOT NULL DEFAULT CONVERT(NVARCHAR(40), SYSUTCDATETIME(), 126)
);
GO

IF OBJECT_ID('dbo.orders', 'U') IS NULL
CREATE TABLE dbo.orders (
  id NVARCHAR(120) NOT NULL PRIMARY KEY,
  order_number NVARCHAR(120) NOT NULL,
  pricing_id NVARCHAR(120) NULL,
  customer_id NVARCHAR(120) NULL,
  order_date NVARCHAR(40) NULL,
  product_code NVARCHAR(255) NULL,
  fabric_type NVARCHAR(500) NULL,
  order_type NVARCHAR(40) NOT NULL DEFAULT 'trade',
  total_raw_quantity FLOAT DEFAULT 0,
  expected_waste_percent FLOAT DEFAULT 0,
  width_mode NVARCHAR(80) DEFAULT 'single',
  width_lines_json NVARCHAR(MAX) NULL,
  inch_width FLOAT DEFAULT 0,
  kilo_price FLOAT DEFAULT 0,
  raw_cost FLOAT DEFAULT 0,
  payment_terms NVARCHAR(255) NULL,
  accessory_type NVARCHAR(255) NULL,
  accessory_percent FLOAT DEFAULT 0,
  accessory_lines_json NVARCHAR(MAX) NULL,
  dyehouse NVARCHAR(255) NULL,
  weaving_source NVARCHAR(255) NULL,
  notes NVARCHAR(MAX) NULL,
  operation_notes_json NVARCHAR(MAX) NULL,
  status NVARCHAR(80) DEFAULT 'pending',
  is_closed INT DEFAULT 0,
  created_at NVARCHAR(40) NOT NULL DEFAULT CONVERT(NVARCHAR(40), SYSUTCDATETIME(), 126),
  updated_at NVARCHAR(40) NOT NULL DEFAULT CONVERT(NVARCHAR(40), SYSUTCDATETIME(), 126)
);
GO

IF OBJECT_ID('dbo.order_allocations', 'U') IS NULL
CREATE TABLE dbo.order_allocations (
  id NVARCHAR(120) NOT NULL PRIMARY KEY,
  order_id NVARCHAR(120) NOT NULL,
  color NVARCHAR(255) NULL,
  pantone_code NVARCHAR(255) NULL,
  planned_quantity FLOAT DEFAULT 0,
  dyehouse NVARCHAR(255) NULL,
  width_line_id NVARCHAR(120) NULL,
  raw_inch FLOAT DEFAULT 0,
  raw_width FLOAT DEFAULT 0,
  finished_width FLOAT DEFAULT 0,
  finished_weight FLOAT DEFAULT 0,
  accessory_quantity_manual FLOAT NULL,
  notes NVARCHAR(MAX) NULL,
  created_at NVARCHAR(40) NOT NULL DEFAULT CONVERT(NVARCHAR(40), SYSUTCDATETIME(), 126),
  updated_at NVARCHAR(40) NOT NULL DEFAULT CONVERT(NVARCHAR(40), SYSUTCDATETIME(), 126)
);
GO

IF OBJECT_ID('dbo.raw_receiving_batches', 'U') IS NULL
CREATE TABLE dbo.raw_receiving_batches (
  id NVARCHAR(120) NOT NULL PRIMARY KEY,
  order_id NVARCHAR(120) NOT NULL,
  allocation_id NVARCHAR(120) NULL,
  batch_date NVARCHAR(40) NULL,
  quantity FLOAT DEFAULT 0,
  supplier NVARCHAR(255) NULL,
  note_number NVARCHAR(255) NULL,
  notes NVARCHAR(MAX) NULL,
  source_document_json NVARCHAR(MAX) NULL,
  created_at NVARCHAR(40) NOT NULL DEFAULT CONVERT(NVARCHAR(40), SYSUTCDATETIME(), 126),
  updated_at NVARCHAR(40) NOT NULL DEFAULT CONVERT(NVARCHAR(40), SYSUTCDATETIME(), 126)
);
GO

IF OBJECT_ID('dbo.dyehouse_delivery_batches', 'U') IS NULL
CREATE TABLE dbo.dyehouse_delivery_batches (
  id NVARCHAR(120) NOT NULL PRIMARY KEY,
  order_id NVARCHAR(120) NOT NULL,
  allocation_id NVARCHAR(120) NULL,
  batch_date NVARCHAR(40) NULL,
  quantity FLOAT DEFAULT 0,
  dyehouse NVARCHAR(255) NULL,
  width_line_id NVARCHAR(120) NULL,
  note_number NVARCHAR(255) NULL,
  notes NVARCHAR(MAX) NULL,
  source_document_json NVARCHAR(MAX) NULL,
  created_at NVARCHAR(40) NOT NULL DEFAULT CONVERT(NVARCHAR(40), SYSUTCDATETIME(), 126),
  updated_at NVARCHAR(40) NOT NULL DEFAULT CONVERT(NVARCHAR(40), SYSUTCDATETIME(), 126)
);
GO

IF OBJECT_ID('dbo.finished_receiving_batches', 'U') IS NULL
CREATE TABLE dbo.finished_receiving_batches (
  id NVARCHAR(120) NOT NULL PRIMARY KEY,
  order_id NVARCHAR(120) NOT NULL,
  allocation_id NVARCHAR(120) NULL,
  batch_date NVARCHAR(40) NULL,
  quantity FLOAT DEFAULT 0,
  finished_width FLOAT DEFAULT 0,
  finished_weight FLOAT DEFAULT 0,
  note_number NVARCHAR(255) NULL,
  notes NVARCHAR(MAX) NULL,
  source_document_json NVARCHAR(MAX) NULL,
  created_at NVARCHAR(40) NOT NULL DEFAULT CONVERT(NVARCHAR(40), SYSUTCDATETIME(), 126),
  updated_at NVARCHAR(40) NOT NULL DEFAULT CONVERT(NVARCHAR(40), SYSUTCDATETIME(), 126)
);
GO

IF OBJECT_ID('dbo.customer_delivery_batches', 'U') IS NULL
CREATE TABLE dbo.customer_delivery_batches (
  id NVARCHAR(120) NOT NULL PRIMARY KEY,
  order_id NVARCHAR(120) NOT NULL,
  allocation_id NVARCHAR(120) NULL,
  batch_date NVARCHAR(40) NULL,
  quantity FLOAT DEFAULT 0,
  customer_name NVARCHAR(255) NULL,
  unit_price FLOAT DEFAULT 0,
  total_price FLOAT DEFAULT 0,
  payment_terms NVARCHAR(255) NULL,
  note_number NVARCHAR(255) NULL,
  movement NVARCHAR(80) NULL,
  notes NVARCHAR(MAX) NULL,
  source_document_json NVARCHAR(MAX) NULL,
  created_at NVARCHAR(40) NOT NULL DEFAULT CONVERT(NVARCHAR(40), SYSUTCDATETIME(), 126),
  updated_at NVARCHAR(40) NOT NULL DEFAULT CONVERT(NVARCHAR(40), SYSUTCDATETIME(), 126)
);
GO

IF OBJECT_ID('dbo.accessory_batches', 'U') IS NULL
CREATE TABLE dbo.accessory_batches (
  id NVARCHAR(120) NOT NULL PRIMARY KEY,
  order_id NVARCHAR(120) NOT NULL,
  allocation_id NVARCHAR(120) NULL,
  batch_date NVARCHAR(40) NULL,
  accessory_type NVARCHAR(255) NULL,
  quantity FLOAT DEFAULT 0,
  note_number NVARCHAR(255) NULL,
  movement NVARCHAR(80) NULL,
  notes NVARCHAR(MAX) NULL,
  source_document_json NVARCHAR(MAX) NULL,
  created_at NVARCHAR(40) NOT NULL DEFAULT CONVERT(NVARCHAR(40), SYSUTCDATETIME(), 126),
  updated_at NVARCHAR(40) NOT NULL DEFAULT CONVERT(NVARCHAR(40), SYSUTCDATETIME(), 126)
);
GO

IF OBJECT_ID('dbo.raw_returns', 'U') IS NULL
CREATE TABLE dbo.raw_returns (
  id NVARCHAR(120) NOT NULL PRIMARY KEY,
  order_id NVARCHAR(120) NOT NULL,
  allocation_id NVARCHAR(120) NULL,
  batch_date NVARCHAR(40) NULL,
  quantity FLOAT DEFAULT 0,
  reason NVARCHAR(MAX) NULL,
  note_number NVARCHAR(255) NULL,
  notes NVARCHAR(MAX) NULL,
  source_document_json NVARCHAR(MAX) NULL,
  created_at NVARCHAR(40) NOT NULL DEFAULT CONVERT(NVARCHAR(40), SYSUTCDATETIME(), 126),
  updated_at NVARCHAR(40) NOT NULL DEFAULT CONVERT(NVARCHAR(40), SYSUTCDATETIME(), 126)
);
GO

IF OBJECT_ID('dbo.gluing_batches', 'U') IS NULL
CREATE TABLE dbo.gluing_batches (
  id NVARCHAR(120) NOT NULL PRIMARY KEY,
  order_id NVARCHAR(120) NOT NULL,
  allocation_id NVARCHAR(120) NULL,
  batch_date NVARCHAR(40) NULL,
  quantity FLOAT DEFAULT 0,
  movement NVARCHAR(80) DEFAULT 'sent',
  partner_fabric NVARCHAR(255) NULL,
  output_name NVARCHAR(255) NULL,
  customer_name NVARCHAR(255) NULL,
  note_number NVARCHAR(255) NULL,
  notes NVARCHAR(MAX) NULL,
  source_document_json NVARCHAR(MAX) NULL,
  created_at NVARCHAR(40) NOT NULL DEFAULT CONVERT(NVARCHAR(40), SYSUTCDATETIME(), 126),
  updated_at NVARCHAR(40) NOT NULL DEFAULT CONVERT(NVARCHAR(40), SYSUTCDATETIME(), 126)
);
GO

IF OBJECT_ID('dbo.dyehouse_transfers', 'U') IS NULL
CREATE TABLE dbo.dyehouse_transfers (
  id NVARCHAR(120) NOT NULL PRIMARY KEY,
  order_id NVARCHAR(120) NOT NULL,
  from_allocation_id NVARCHAR(120) NULL,
  to_allocation_id NVARCHAR(120) NULL,
  from_dyehouse NVARCHAR(255) NULL,
  to_dyehouse NVARCHAR(255) NULL,
  quantity FLOAT DEFAULT 0,
  transfer_date NVARCHAR(40) NULL,
  note_number NVARCHAR(255) NULL,
  notes NVARCHAR(MAX) NULL,
  created_at NVARCHAR(40) NOT NULL DEFAULT CONVERT(NVARCHAR(40), SYSUTCDATETIME(), 126),
  updated_at NVARCHAR(40) NOT NULL DEFAULT CONVERT(NVARCHAR(40), SYSUTCDATETIME(), 126)
);
GO

IF OBJECT_ID('dbo.report_outbox', 'U') IS NULL
CREATE TABLE dbo.report_outbox (
  id NVARCHAR(120) NOT NULL PRIMARY KEY,
  report_type NVARCHAR(120) NULL,
  order_id NVARCHAR(120) NULL,
  order_number NVARCHAR(120) NULL,
  customer_name NVARCHAR(255) NULL,
  target_group NVARCHAR(255) NULL,
  message_text NVARCHAR(MAX) NULL,
  attachment_path NVARCHAR(MAX) NULL,
  status NVARCHAR(80) DEFAULT 'queued',
  error_message NVARCHAR(MAX) NULL,
  retry_count INT DEFAULT 0,
  created_at NVARCHAR(40) NOT NULL DEFAULT CONVERT(NVARCHAR(40), SYSUTCDATETIME(), 126),
  sent_at NVARCHAR(40) NULL
);
GO

IF OBJECT_ID('dbo.whatsapp_settings', 'U') IS NULL
CREATE TABLE dbo.whatsapp_settings (
  id NVARCHAR(120) NOT NULL PRIMARY KEY,
  settings_json NVARCHAR(MAX) NOT NULL,
  created_at NVARCHAR(40) NOT NULL DEFAULT CONVERT(NVARCHAR(40), SYSUTCDATETIME(), 126),
  updated_at NVARCHAR(40) NOT NULL DEFAULT CONVERT(NVARCHAR(40), SYSUTCDATETIME(), 126)
);
GO

IF OBJECT_ID('dbo.system_settings', 'U') IS NULL
CREATE TABLE dbo.system_settings (
  [key] NVARCHAR(255) NOT NULL PRIMARY KEY,
  value_json NVARCHAR(MAX) NOT NULL,
  created_at NVARCHAR(40) NOT NULL DEFAULT CONVERT(NVARCHAR(40), SYSUTCDATETIME(), 126),
  updated_at NVARCHAR(40) NOT NULL DEFAULT CONVERT(NVARCHAR(40), SYSUTCDATETIME(), 126)
);
GO

IF OBJECT_ID('dbo.audit_log', 'U') IS NULL
CREATE TABLE dbo.audit_log (
  id NVARCHAR(120) NOT NULL PRIMARY KEY,
  action NVARCHAR(120) NULL,
  entity_type NVARCHAR(120) NULL,
  entity_id NVARCHAR(120) NULL,
  before_json NVARCHAR(MAX) NULL,
  after_json NVARCHAR(MAX) NULL,
  note NVARCHAR(MAX) NULL,
  created_at NVARCHAR(40) NOT NULL DEFAULT CONVERT(NVARCHAR(40), SYSUTCDATETIME(), 126)
);
GO

IF OBJECT_ID('dbo.users', 'U') IS NULL
CREATE TABLE dbo.users (
  id NVARCHAR(120) NOT NULL PRIMARY KEY,
  name NVARCHAR(255) NULL,
  username NVARCHAR(255) NOT NULL UNIQUE,
  password_hash NVARCHAR(MAX) NULL,
  role NVARCHAR(80) DEFAULT 'user',
  is_active INT DEFAULT 1,
  created_at NVARCHAR(40) NOT NULL DEFAULT CONVERT(NVARCHAR(40), SYSUTCDATETIME(), 126),
  updated_at NVARCHAR(40) NOT NULL DEFAULT CONVERT(NVARCHAR(40), SYSUTCDATETIME(), 126)
);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'idx_orders_number_customer_fabric_unique' AND object_id = OBJECT_ID('dbo.orders'))
CREATE UNIQUE INDEX idx_orders_number_customer_fabric_unique
ON dbo.orders(order_number, customer_id, fabric_type)
WHERE order_number IS NOT NULL AND order_number <> ''
  AND customer_id IS NOT NULL AND customer_id <> ''
  AND fabric_type IS NOT NULL AND fabric_type <> '';
GO
