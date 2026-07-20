const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync('d:\\universa\\universa-strapi-project\\.tmp\\data.db');

try {
  console.log("Adding second slide to database dynamically...");

  // 1. Get the actual existing Carousel ID from the database
  const activeCarousel = db.prepare("SELECT id FROM components_blocks_hero_carousels ORDER BY id DESC LIMIT 1").get();
  if (!activeCarousel) {
    console.error("Error: No carousels found in components_blocks_hero_carousels!");
    process.exit(1);
  }
  const carouselId = activeCarousel.id;
  console.log(`Active Carousel ID: ${carouselId}`);

  // 2. Sync homepage mappings (both draft and published) to point to this active carousel
  db.prepare(`
    UPDATE homepages_cmps 
    SET cmp_id = ? 
    WHERE field = 'sections' AND [order] = 1 AND (entity_id = 1 OR entity_id IN (SELECT id FROM homepages))
  `).run(carouselId);
  console.log("Synchronized homepage mappings to active carousel.");

  // 3. Check if we already added Slide 2 in this carousel to avoid duplicates
  const existingSlides = db.prepare(`
    SELECT * FROM components_blocks_hero_carousels_cmps 
    WHERE entity_id = ? AND [order] = 2
  `).all(carouselId);

  if (existingSlides.length > 0) {
    console.log("Slide 2 is already present in this carousel. Skipping insert.");
    process.exit(0);
  }

  // 4. Insert Slide 2 in components_blocks_hero_slides
  const insertSlide = db.prepare(`
    INSERT INTO components_blocks_hero_slides (
      title, subtitle, bg_color, text_tone, accent_label, accent_title, price_badge_text, price_value, price_suffix
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const slideId = insertSlide.run(
    'Conversation Clubs Membership',
    'Practica inglés cada semana y mantén tu fluidez viva.',
    '#2b0970',
    'light',
    'O reserva',
    'Conversation Clubs On Demand',
    'Acceso a Conversation Clubs desde',
    '$1',
    '¡Con instructores moderadores en vivo!'
  ).lastInsertRowid;
  console.log(`Created Slide ID: ${slideId}`);

  // 5. Link Slide 2 to Carousel in components_blocks_hero_carousels_cmps
  db.prepare(`
    INSERT INTO components_blocks_hero_carousels_cmps (entity_id, cmp_id, component_type, field, [order])
    VALUES (?, ?, 'blocks.hero-slide', 'slides', 2)
  `).run(carouselId, slideId);

  // 6. Create CTAs in components_shared_ctas
  const insertCta = db.prepare(`
    INSERT INTO components_shared_ctas (label, url, style) VALUES (?, ?, ?)
  `);
  const cta1Id = insertCta.run('Descubre los beneficios', '/conversation-clubs', 'secondary').lastInsertRowid;
  const cta2Id = insertCta.run('Reserva ahora', '/reserva', 'primary').lastInsertRowid;
  console.log(`Created CTAs - Primary: ${cta1Id}, Price: ${cta2Id}`);

  // 7. Link CTAs to Slide 2 in components_blocks_hero_slides_cmps
  const insertSlideCmp = db.prepare(`
    INSERT INTO components_blocks_hero_slides_cmps (entity_id, cmp_id, component_type, field, [order])
    VALUES (?, ?, 'shared.cta', ?, NULL)
  `);
  insertSlideCmp.run(slideId, cta1Id, 'primaryCta');
  insertSlideCmp.run(slideId, cta2Id, 'priceCta');

  console.log("Successfully added slide 2 structure to the database!");
} catch (e) {
  console.error("Error adding slide 2:", e);
}
