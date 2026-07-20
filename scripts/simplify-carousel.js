const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync('d:\\universa\\universa-strapi-project\\.tmp\\data.db');

try {
  console.log("Analyzing homepage sections for draft...");

  // 1. Get the current Carousel ID mapped to order 1 on the draft homepage
  const draftHeroCmp = db.prepare(`
    SELECT cmp_id, component_type FROM homepages_cmps 
    WHERE field = 'sections' AND [order] = 1 AND entity_id = 1
  `).get();

  if (!draftHeroCmp || draftHeroCmp.component_type !== 'blocks.hero-carousel') {
    console.error("Error: Order 1 section on draft homepage is not a hero-carousel!");
    process.exit(1);
  }

  const carouselId = draftHeroCmp.cmp_id;
  console.log(`Active Draft Carousel ID: ${carouselId}`);

  // Ensure components_blocks_hero_carousels table actually has this ID
  const carouselRow = db.prepare("SELECT id FROM components_blocks_hero_carousels WHERE id = ?").get(carouselId);
  if (!carouselRow) {
    console.log(`Warning: Carousel ID ${carouselId} not found in components_blocks_hero_carousels, checking if another exists...`);
    const anyCarousel = db.prepare("SELECT id FROM components_blocks_hero_carousels ORDER BY id DESC LIMIT 1").get();
    if (anyCarousel) {
      console.log(`Found another carousel with ID ${anyCarousel.id}, updating draft homepage to point to it.`);
      db.prepare("UPDATE homepages_cmps SET cmp_id = ? WHERE entity_id = 1 AND field = 'sections' AND [order] = 1").run(anyCarousel.id);
      process.exit(0);
    } else {
      console.error("Error: No carousels found in components_blocks_hero_carousels!");
      process.exit(1);
    }
  }

  // 2. Find slides associated with the active carousel
  const slides = db.prepare(`
    SELECT * FROM components_blocks_hero_carousels_cmps 
    WHERE entity_id = ? AND component_type = 'blocks.hero-slide'
    ORDER BY [order] ASC
  `).all(carouselId);

  console.log(`Found ${slides.length} slides in active carousel.`);

  if (slides.length > 0) {
    const keepSlide = slides[0];
    const keepSlideId = keepSlide.cmp_id;
    console.log(`Keeping Slide ID: ${keepSlideId}`);

    // Delete other slides mappings
    for (let i = 1; i < slides.length; i++) {
      const deleteSlideId = slides[i].cmp_id;
      console.log(`Deleting Slide ID: ${deleteSlideId}`);

      // Delete slide mapping from carousel
      db.prepare("DELETE FROM components_blocks_hero_carousels_cmps WHERE entity_id = ? AND cmp_id = ?").run(carouselId, deleteSlideId);
      
      // Delete slide CTAs
      db.prepare("DELETE FROM components_blocks_hero_slides_cmps WHERE entity_id = ?").run(deleteSlideId);
      
      // Delete slide image morph
      db.prepare("DELETE FROM files_related_mph WHERE related_id = ? AND related_type = 'blocks.hero-slide'").run(deleteSlideId);
      
      // Delete slide row
      db.prepare("DELETE FROM components_blocks_hero_slides WHERE id = ?").run(deleteSlideId);
    }

    // 3. For the kept slide, ensure it only has primaryCta
    db.prepare(`
      DELETE FROM components_blocks_hero_slides_cmps 
      WHERE entity_id = ? AND field != 'primaryCta'
    `).run(keepSlideId);
    console.log(`Cleaned up non-primary CTAs from kept slide ${keepSlideId}`);
  }

  // 4. Update the published homepage (entity_id = 6) mapping to point to the same carousel
  const publishedHomepage = db.prepare("SELECT id FROM homepages WHERE published_at IS NOT NULL").get();
  if (publishedHomepage) {
    db.prepare(`
      UPDATE homepages_cmps 
      SET component_type = 'blocks.hero-carousel', cmp_id = ? 
      WHERE field = 'sections' AND [order] = 1 AND entity_id = ?
    `).run(carouselId, publishedHomepage.id);
    console.log(`Updated published homepage (entity_id = ${publishedHomepage.id}) mapping to point to carousel ID ${carouselId}`);
  }

  console.log("Database carousel simplification complete!");
} catch (e) {
  console.error("Error:", e);
}
