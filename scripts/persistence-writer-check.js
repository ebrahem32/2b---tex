const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const source = fs.readFileSync(path.resolve(__dirname, '..', 'modules', 'persistenceWriter.js'), 'utf8');
const context = { window: {}, console, setTimeout };
vm.createContext(context);
vm.runInContext(source, context);

async function main() {
  let calls = 0;
  const retryWriter = context.window.createPersistenceWriter({
    request: async () => {
      calls += 1;
      if (calls === 1) throw new Error('temporary network failure');
      return { id: 'saved-1' };
    },
    isAvailable: () => true,
    retryDelayMs: 0,
  });
  assert.deepStrictEqual(await retryWriter.post('/orders', { id:'saved-1' }, { strict:true }), { id:'saved-1' });
  assert.strictEqual(calls, 2, 'A transient POST failure must retry exactly once');

  calls = 0;
  const validationWriter = context.window.createPersistenceWriter({
    request: async () => {
      calls += 1;
      const error = new Error('invalid data');
      error.status = 400;
      error.retryable = false;
      throw error;
    },
    isAvailable: () => true,
    retryDelayMs: 0,
  });
  await assert.rejects(() => validationWriter.post('/orders', { id:'bad-1' }, { strict:true }), /invalid data/);
  assert.strictEqual(calls, 1, 'Validation failures must never be retried');

  let unavailable = false;
  const softWriter = context.window.createPersistenceWriter({
    request: async () => { throw new Error('offline'); },
    isAvailable: () => true,
    markUnavailable: () => { unavailable = true; },
    logger: { warn: () => {} },
    retryDelayMs: 0,
  });
  assert.strictEqual(await softWriter.post('/orders', { id:'offline-1' }), null);
  assert.strictEqual(unavailable, true, 'Soft write failure must mark the backend unavailable');

  console.log('Persistence writer behavior checks passed.');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
