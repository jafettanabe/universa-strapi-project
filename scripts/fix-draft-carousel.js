const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync('d:\\universa\\universa-strapi-project\\.tmp\\data.db');

try {
  // Let's update draft homepage (entity_id = 1) order 1 component mapping to point to the active carousel ID 2
  const result = db.prepare(`
    UPDATE homepages_cmps 
    SET cmp_id = 2 
    WHERE entity_id = 1 AND field = 'sections' AND [order] = 1
  `).run();
  
  console.log(`Successfully fixed draft homepage mapping. Rows affected: ${result.changes}`);
} catch (e) {
  console.error("Error:", e);
}
