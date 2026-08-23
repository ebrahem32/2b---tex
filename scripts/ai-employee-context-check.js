const assert = require('assert');
const createAiEmployee = require('../backend/aiEmployee');

async function main() {
  const employee = createAiEmployee({
    repairMissingCustomersFromReferences: async () => {},
    readableCustomerNameFromId: (value) => String(value || ''),
  });
  const context = await employee.buildAiEmployeeContext();
  assert.ok(context.businessKnowledge, 'ذاكرة قواعد العمل غير موجودة');
  assert.ok(context.a5Integration, 'سياق A5 غير موجود');
  assert.ok(Array.isArray(context.orders), 'طلبات 2B غير موجودة');
  assert.ok(context.orders.length > 0, 'لم تتم قراءة طلبات 2B');
  assert.ok(context.businessKnowledge.quantityRules.some((rule) => rule.includes('ليس هالكًا')));
  assert.strictEqual(context.businessKnowledge.a5Integration.categories.raw, 'منتج قماش');
  assert.strictEqual(context.businessKnowledge.a5Integration.categories.finished, 'منتج الوان');
  const contractAnswer = employee.buildBusinessKnowledgeCommandReport(context, 'اشرح الفرق بين المصنعية وبيع وشراء');
  assert.ok(contractAnswer?.keyFindings?.some((line) => line.includes('الخام ملك العميل')));
  const a5Answer = employee.buildBusinessKnowledgeCommandReport(context, 'اشرح قاعدة الربط مع A5');
  assert.ok(a5Answer?.keyFindings?.some((line) => line.includes('ربط')));
  console.log(JSON.stringify({
    ok: true,
    orders: context.orders.length,
    customers: context.factorySnapshot?.customersCount || 0,
    a5Available: context.a5Integration.available,
    a5LinkedOrders: context.a5Integration.linkedOrdersCount,
    a5PendingReview: context.a5Integration.sync?.pendingReview || 0,
  }));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
