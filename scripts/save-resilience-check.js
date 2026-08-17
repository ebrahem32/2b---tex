const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const backend = fs.readFileSync(path.join(root, 'backend', 'server.js'), 'utf8');
const client = fs.readFileSync(path.join(root, 'modules', 'backendClient.js'), 'utf8');
const writer = fs.readFileSync(path.join(root, 'modules', 'persistenceWriter.js'), 'utf8');
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');

const replayGuards = [
  "existingPostedRow(table, req.body || {})",
  "existingPostedRow('orders', item || {})",
  "existingPostedRow('order_allocations', req.body || {})",
  "existingPostedRow(item.table, item.body, tx)",
  "existingPostedRow('dyehouse_transfers', req.body || {})",
  "X-Idempotent-Replay",
];

for (const guard of replayGuards) {
  assert(backend.includes(guard), `Missing idempotency guard: ${guard}`);
}

assert(client.includes('error.status = response.status'), 'HTTP status is not attached to backend errors');
assert(client.includes('error.retryable ='), 'Retryable HTTP errors are not classified');
assert(writer.includes('requestWithRetry'), 'Safe backend retry helper is missing');
assert(writer.includes('retryableError'), 'Retry policy is missing');
assert(writer.includes("requestWithRetry(path, { method: 'POST'"), 'POST writes do not use safe retry');
assert(app.includes('window.createPersistenceWriter'), 'The app does not use the extracted persistence writer');

console.log('Save resilience checks passed.');
