PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  phone TEXT,
  a5_customer_id TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pricings (
  id TEXT PRIMARY KEY,
  pricing_number TEXT NOT NULL,
  customer_id TEXT,
  pricing_date TEXT,
  fabric_type TEXT,
  material_type TEXT,
  dyehouse TEXT,
  color_class TEXT,
  quantity REAL DEFAULT 0,
  inch_width REAL DEFAULT 0,
  finished_weight REAL DEFAULT 0,
  raw_cost REAL DEFAULT 0,
  dye_cost REAL DEFAULT 0,
  waste_percent REAL DEFAULT 0,
  extra_cost REAL DEFAULT 0,
  profit_per_kg REAL DEFAULT 0,
  unit_price REAL DEFAULT 0,
  total_price REAL DEFAULT 0,
  payment_terms TEXT,
  notes TEXT,
  status TEXT DEFAULT 'draft',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  order_number TEXT NOT NULL,
  pricing_id TEXT,
  customer_id TEXT,
  order_date TEXT,
  product_code TEXT,
  fabric_type TEXT,
  total_raw_quantity REAL DEFAULT 0,
  expected_waste_percent REAL DEFAULT 0,
  width_mode TEXT DEFAULT 'single',
  width_lines_json TEXT,
  inch_width REAL DEFAULT 0,
  kilo_price REAL DEFAULT 0,
  raw_cost REAL DEFAULT 0,
  payment_terms TEXT,
  accessory_type TEXT,
  accessory_percent REAL DEFAULT 0,
  accessory_lines_json TEXT,
  dyehouse TEXT,
  weaving_source TEXT,
  notes TEXT,
  operation_notes_json TEXT,
  status TEXT DEFAULT 'pending',
  is_closed INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pricing_id) REFERENCES pricings(id),
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE IF NOT EXISTS order_allocations (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  color TEXT,
  pantone_code TEXT,
  planned_quantity REAL DEFAULT 0,
  dyehouse TEXT,
  width_line_id TEXT,
  raw_inch REAL DEFAULT 0,
  raw_width REAL DEFAULT 0,
  finished_width REAL DEFAULT 0,
  finished_weight REAL DEFAULT 0,
  accessory_quantity_manual REAL,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS raw_receiving_batches (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  allocation_id TEXT,
  batch_date TEXT,
  quantity REAL DEFAULT 0,
  supplier TEXT,
  note_number TEXT,
  notes TEXT,
  source_document_json TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (allocation_id) REFERENCES order_allocations(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS dyehouse_delivery_batches (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  allocation_id TEXT,
  batch_date TEXT,
  quantity REAL DEFAULT 0,
  dyehouse TEXT,
  width_line_id TEXT,
  note_number TEXT,
  notes TEXT,
  source_document_json TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (allocation_id) REFERENCES order_allocations(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS finished_receiving_batches (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  allocation_id TEXT,
  batch_date TEXT,
  quantity REAL DEFAULT 0,
  finished_width REAL DEFAULT 0,
  finished_weight REAL DEFAULT 0,
  note_number TEXT,
  notes TEXT,
  source_document_json TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (allocation_id) REFERENCES order_allocations(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS customer_delivery_batches (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  allocation_id TEXT,
  batch_date TEXT,
  quantity REAL DEFAULT 0,
  notes TEXT,
  source_document_json TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (allocation_id) REFERENCES order_allocations(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS accessory_batches (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  allocation_id TEXT,
  batch_date TEXT,
  accessory_type TEXT,
  quantity REAL DEFAULT 0,
  note_number TEXT,
  movement TEXT,
  notes TEXT,
  source_document_json TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (allocation_id) REFERENCES order_allocations(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS raw_returns (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  allocation_id TEXT,
  batch_date TEXT,
  quantity REAL DEFAULT 0,
  reason TEXT,
  note_number TEXT,
  notes TEXT,
  source_document_json TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (allocation_id) REFERENCES order_allocations(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS dyehouse_transfers (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  from_allocation_id TEXT,
  to_allocation_id TEXT,
  from_dyehouse TEXT,
  to_dyehouse TEXT,
  quantity REAL DEFAULT 0,
  transfer_date TEXT,
  note_number TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS report_outbox (
  id TEXT PRIMARY KEY,
  report_type TEXT,
  order_id TEXT,
  order_number TEXT,
  customer_name TEXT,
  target_group TEXT,
  message_text TEXT,
  attachment_path TEXT,
  status TEXT DEFAULT 'queued',
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  sent_at TEXT
);

CREATE TABLE IF NOT EXISTS whatsapp_settings (
  id TEXT PRIMARY KEY,
  settings_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS system_settings (
  key TEXT PRIMARY KEY,
  value_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_log (
  id TEXT PRIMARY KEY,
  action TEXT,
  entity_type TEXT,
  entity_id TEXT,
  before_json TEXT,
  after_json TEXT,
  note TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT,
  role TEXT DEFAULT 'user',
  is_active INTEGER DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_number_customer_fabric_unique
ON orders(order_number, customer_id, TRIM(fabric_type))
WHERE order_number IS NOT NULL AND TRIM(order_number) <> ''
  AND customer_id IS NOT NULL AND TRIM(customer_id) <> ''
  AND fabric_type IS NOT NULL AND TRIM(fabric_type) <> '';
