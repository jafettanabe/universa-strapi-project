const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const db = new DatabaseSync(path.join(__dirname, '..', '.tmp', 'data.db'));

try {
  console.log("Starting homepage slider database update...");

  // 1. Insert file metadata for homepage_hero_student.png
  const fileCheck = db.prepare("SELECT id FROM files WHERE hash = 'homepage_hero_student'").get();
  let fileId = fileCheck ? fileCheck.id : null;
  if (!fileId) {
    const insertFile = db.prepare(`
      INSERT INTO files (
        document_id, name, alternative_text, caption, focal_point, 
        width, height, formats, hash, ext, mime, size, url, 
        preview_url, provider, provider_metadata, folder_path, 
        created_at, updated_at, published_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'), datetime('now'))
    `);
    const result = insertFile.run(
      'homepage-hero-student-doc-id', 
      'homepage_hero_student.png', 
      'Estudiante Universa', 
      null, 
      null, 
      1024, 
      1024, 
      null, 
      'homepage_hero_student', 
      '.png', 
      'image/png', 
      150.0, 
      '/uploads/homepage_hero_student.png', 
      null, 
      'local', 
      null, 
      '/'
    );
    fileId = result.lastInsertRowid;
    console.log(`Inserted file metadata with ID: ${fileId}`);
  } else {
    console.log(`File metadata already exists with ID: ${fileId}`);
  }

  // 2. Insert CTAs for Slide 1 & 2
  const insertCta = db.prepare(`
    INSERT INTO components_shared_ctas (label, url, style) VALUES (?, ?, ?)
  `);
  
  const cta1 = insertCta.run('Descubre tu programa ideal →', '/programas', 'primary').lastInsertRowid;
  const cta2 = insertCta.run('Hacer mi Placement Test →', '/test', 'secondary').lastInsertRowid;
  const cta3 = insertCta.run('Conoce Nuestros Programas', '/programas', 'primary').lastInsertRowid;
  const cta4 = insertCta.run('Habla con un asesor', '/contacto', 'secondary').lastInsertRowid;
  
  console.log(`Inserted CTAs. IDs: cta1=${cta1}, cta2=${cta2}, cta3=${cta3}, cta4=${cta4}`);

  // 3. Insert Slides in components_blocks_hero_slides
  const insertSlide = db.prepare(`
    INSERT INTO components_blocks_hero_slides (title, subtitle, text_tone, bg_color, pill_label) VALUES (?, ?, ?, ?, ?)
  `);

  const slide1 = insertSlide.run(
    'Aprende inglés online con el programa hecho para ti',
    'En Universa no creemos en "un programa para todos". Diseñamos siete formas distintas de aprender inglés, para que elijas la que se ajusta a tu ritmo, tu presupuesto y tus objetivos, con el respaldo de National Geographic Learning y certificación British Council.',
    'light',
    '#febe85',
    null
  ).lastInsertRowid;

  const slide2 = insertSlide.run(
    'Aprende inglés. Transforma tu futuro.',
    'Programas que se adaptan al ritmo, objetivos y contexto de cada estudiante.',
    'light',
    '#febe85',
    'Hablemos'
  ).lastInsertRowid;

  console.log(`Inserted Slides. IDs: slide1=${slide1}, slide2=${slide2}`);

  // 4. Map CTAs to slides in components_blocks_hero_slides_cmps
  const insertSlideCmp = db.prepare(`
    INSERT INTO components_blocks_hero_slides_cmps (entity_id, cmp_id, component_type, field, [order]) VALUES (?, ?, ?, ?, ?)
  `);

  insertSlideCmp.run(slide1, cta1, 'shared.cta', 'primaryCta', 1);
  insertSlideCmp.run(slide1, cta2, 'shared.cta', 'secondaryCta', 2);
  insertSlideCmp.run(slide2, cta3, 'shared.cta', 'primaryCta', 1);
  insertSlideCmp.run(slide2, cta4, 'shared.cta', 'pillCta', 2);

  console.log("Mapped CTAs to slides.");

  // 5. Associate foreground images with both slides in files_related_mph
  const insertFileMorph = db.prepare(`
    INSERT INTO files_related_mph (file_id, related_id, related_type, field, [order]) VALUES (?, ?, ?, ?, ?)
  `);

  insertFileMorph.run(fileId, slide1, 'blocks.hero-slide', 'foregroundImage', 1);
  insertFileMorph.run(fileId, slide2, 'blocks.hero-slide', 'foregroundImage', 1);

  console.log("Associated images with slides.");

  // 6. Insert Carousel in components_blocks_hero_carousels
  const insertCarousel = db.prepare(`
    INSERT INTO components_blocks_hero_carousels (autoplay_ms) VALUES (?)
  `);
  const carouselId = insertCarousel.run(6000).lastInsertRowid;
  console.log(`Inserted Hero Carousel with ID: ${carouselId}`);

  // 7. Link slides to carousel in components_blocks_hero_carousels_cmps
  const insertCarouselCmp = db.prepare(`
    INSERT INTO components_blocks_hero_carousels_cmps (entity_id, cmp_id, component_type, field, [order]) VALUES (?, ?, ?, ?, ?)
  `);
  insertCarouselCmp.run(carouselId, slide1, 'blocks.hero-slide', 'slides', 1);
  insertCarouselCmp.run(carouselId, slide2, 'blocks.hero-slide', 'slides', 2);

  console.log("Linked slides to carousel.");

  // 8. Replace the first section of the homepage with the carousel in homepages_cmps
  // We do it for both entity_id = 1 (draft) and entity_id = 5 (published)
  const updateHomepage = db.prepare(`
    UPDATE homepages_cmps 
    SET component_type = 'blocks.hero-carousel', cmp_id = ? 
    WHERE field = 'sections' AND [order] = 1 AND entity_id IN (1, 5)
  `);
  const updateResult = updateHomepage.run(carouselId);
  console.log(`Updated homepage sections. Rows affected: ${updateResult.changes}`);

  console.log("Database update completed successfully!");
} catch (e) {
  console.error("Error updating database:", e);
}
