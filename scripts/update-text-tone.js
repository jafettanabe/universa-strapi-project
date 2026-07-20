const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const db = new DatabaseSync(path.join(__dirname, '..', '.tmp', 'data.db'));

try {
  const result = db.prepare("UPDATE components_blocks_hero_slides SET text_tone = 'dark'").run();
  console.log(`Updated text_tone to 'dark' for ${result.changes} slides.`);
} catch (e) {
  console.error("Error:", e);
}
