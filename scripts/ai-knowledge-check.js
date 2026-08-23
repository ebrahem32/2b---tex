const assert = require('assert');
const { AI_BUSINESS_KNOWLEDGE, buildA5KnowledgeSnapshot } = require('../backend/aiKnowledge');

async function main() {
  assert.strictEqual(AI_BUSINESS_KNOWLEDGE.a5Integration.categories.raw, 'منتج قماش');
  assert.strictEqual(AI_BUSINESS_KNOWLEDGE.a5Integration.categories.finished, 'منتج الوان');
  assert.ok(AI_BUSINESS_KNOWLEDGE.quantityRules.some((rule) => rule.includes('ليس هالكًا')));
  assert.ok(AI_BUSINESS_KNOWLEDGE.accessories.some((rule) => rule.includes('نسبة مئوية أو كيلوجرامًا')));
  const snapshot = await buildA5KnowledgeSnapshot();
  assert.strictEqual(typeof snapshot.available, 'boolean');
  assert.ok(Array.isArray(snapshot.links));
  assert.ok(Array.isArray(snapshot.reviewItems));
  if (snapshot.available) {
    assert.ok(snapshot.linkedOrdersCount >= 1, 'A5 متصل لكن لا توجد روابط ظاهرة للمساعد');
    assert.ok(snapshot.links.every((link) => link.orderNumber && link.rawItem));
  }
  console.log(JSON.stringify({
    ok: true,
    a5Available: snapshot.available,
    linkedOrdersCount: snapshot.linkedOrdersCount,
    pendingReview: snapshot.sync?.pendingReview || 0,
  }));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
