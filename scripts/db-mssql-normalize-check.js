'use strict';

const assert = require('assert');
const { normalizeSqlForTest } = require('../backend/db-mssql');

const unordered = normalizeSqlForTest(
  'SELECT id FROM orders WHERE order_number = ? LIMIT 1',
  ['10001']
);
assert.strictEqual(
  unordered.text,
  'SELECT id FROM orders WHERE order_number = @p0 ORDER BY (SELECT NULL) OFFSET 0 ROWS FETCH NEXT 1 ROWS ONLY'
);
assert.deepStrictEqual(unordered.params, ['10001']);

const ordered = normalizeSqlForTest(
  'SELECT * FROM audit_log ORDER BY created_at DESC LIMIT ?',
  [100]
);
assert.strictEqual(
  ordered.text,
  'SELECT * FROM audit_log ORDER BY created_at DESC OFFSET 0 ROWS FETCH NEXT @p0 ROWS ONLY'
);
assert.deepStrictEqual(ordered.params, [100]);

const filteredOrdered = normalizeSqlForTest(
  'SELECT * FROM audit_log WHERE note LIKE ? ORDER BY created_at DESC LIMIT ?',
  ['%test%', 50]
);
assert.strictEqual(
  filteredOrdered.text,
  'SELECT * FROM audit_log WHERE note LIKE @p0 ORDER BY created_at DESC OFFSET 0 ROWS FETCH NEXT @p1 ROWS ONLY'
);
assert.deepStrictEqual(filteredOrdered.params, ['%test%', 50]);

console.log('SQL Server LIMIT normalization check passed');
