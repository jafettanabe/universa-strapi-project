const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync('d:\\universa\\universa-strapi-project\\.tmp\\data.db');

try {
  console.log("Restoring and setting up dynamic carousel and slides...");

  // 1. Create a new Carousel
  const insertCarousel = db.prepare(`
    INSERT INTO components_blocks_hero_carousels (autoplay_ms) VALUES (6000)
  `);
  const carouselId = insertCarousel.run().lastInsertRowid;
  console.log(`Created Carousel ID: ${carouselId}`);

  // 2. Insert Slide 1
  const insertSlide = db.prepare(`
    INSERT INTO components_blocks_hero_slides (
      title, subtitle, bg_color, text_tone, accent_label, accent_title, price_badge_text, price_value, price_suffix
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const slide1Id = insertSlide.run(
    'Aprende inglés online con el programa hecho para ti',
    'En Universa no creemos en "un programa para todos". Diseñamos siete formas distintas de aprender inglés, para que elijas la que se ajusta a tu ritmo, tu presupuesto y tus objetivos, con el respaldo de National Geographic Learning y certificación British Council.',
    '#febe85',
    'dark',
    null, null, null, null, null
  ).lastInsertRowid;

  // Insert Slide 2
  const slide2Id = insertSlide.run(
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
  console.log(`Created Slides - Slide 1: ${slide1Id}, Slide 2: ${slide2Id}`);

  // 3. Link Slides to Carousel
  const insertCarouselCmp = db.prepare(`
    INSERT INTO components_blocks_hero_carousels_cmps (entity_id, cmp_id, component_type, field, [order])
    VALUES (?, ?, 'blocks.hero-slide', 'slides', ?)
  `);
  insertCarouselCmp.run(carouselId, slide1Id, 1);
  insertCarouselCmp.run(carouselId, slide2Id, 2);

  // 4. Create CTAs for Slide 1
  const insertCta = db.prepare(`
    INSERT INTO components_shared_ctas (label, url, style) VALUES (?, ?, ?)
  `);
  const s1Cta1 = insertCta.run('Descubre tu programa ideal →', '/programas', 'primary').lastInsertRowid;
  const s1Cta2 = insertCta.run('Hacer mi Placement Test →', '/test', 'secondary').lastInsertRowid;

  // Create CTAs for Slide 2
  const s2Cta1 = insertCta.run('Descubre los beneficios', '/conversation-clubs', 'secondary').lastInsertRowid;
  const s2Cta2 = insertCta.run('Reserva ahora', '/reserva', 'primary').lastInsertRowid;
  console.log(`Created CTAs.`);

  // 5. Link CTAs to Slides
  const insertSlideCmp = db.prepare(`
    INSERT INTO components_blocks_hero_slides_cmps (entity_id, cmp_id, component_type, field, [order])
    VALUES (?, ?, 'shared.cta', ?, NULL)
  `);
  
  // Slide 1 Links
  insertSlideCmp.run(slide1Id, s1Cta1, 'primaryCta');
  insertSlideCmp.run(slide1Id, s1Cta2, 'secondaryCta');

  // Slide 2 Links
  insertSlideCmp.run(slide2Id, s2Cta1, 'primaryCta');
  insertSlideCmp.run(slide2Id, s2Cta2, 'priceCta');

  // 6. Update Homepage sections to point to the carousel
  db.prepare(`
    UPDATE homepages_cmps 
    SET component_type = 'blocks.hero-carousel', cmp_id = ? 
    WHERE field = 'sections' AND [order] = 1 AND (entity_id = 1 OR entity_id IN (SELECT id FROM homepages))
  `).run(carouselId);

  console.log("Database reset to hero-carousel with Slide 1 & Slide 2 successful!");
} catch (e) {
  console.error("Error resetting carousel:", e);
}
