const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
const crypto = require('crypto');

const brainDir = 'C:/Users/Jafet/.gemini/antigravity-ide/brain/5fb193e9-727b-48b8-803e-c5669e266054';
const uploadsDir = 'd:/universa/universa-strapi-project/public/uploads';

const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'strapi',
  user: 'postgres',
  password: 'Argos177',
});

// Helper to generate document id
function makeDocId() {
  return 'media-' + crypto.randomBytes(8).toString('hex');
}

async function main() {
  await client.connect();
  console.log('Connected to database');

  try {
    // Start Transaction
    await client.query('BEGIN');

    // 1. Find and copy Hero image from brain directory to public/uploads
    const filesInBrain = fs.readdirSync(brainDir);
    
    const imageMappings = [
      { key: 'metodologia_hero_clase_en_vivo', dest: 'metodologia-hero-clase-en-vivo.png', alt: 'Clase de inglés en vivo con metodología natural Universa' },
    ];

    const fileIds = {};

    for (const mapping of imageMappings) {
      const match = filesInBrain.find(f => f.startsWith(mapping.key) && f.endsWith('.png'));
      if (!match) {
        throw new Error(`Could not find image matching key ${mapping.key} in brain directory`);
      }
      const srcPath = path.join(brainDir, match);
      const destPath = path.join(uploadsDir, mapping.dest);
      
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied ${match} to public/uploads/${mapping.dest}`);

      const stats = fs.statSync(destPath);
      const sizeKb = stats.size / 1024;

      const hash = mapping.dest.replace('.png', '');
      const existing = await client.query('SELECT id FROM files WHERE hash = $1', [hash]);
      
      let fileId;
      if (existing.rows.length > 0) {
        fileId = existing.rows[0].id;
        console.log(`File ${mapping.dest} already registered with ID: ${fileId}`);
        await client.query(
          `UPDATE files SET name = $1, alternative_text = $2, width = 1024, height = 1024, size = $3, url = $4, updated_at = NOW() WHERE id = $5`,
          [mapping.dest, mapping.alt, sizeKb, `/uploads/${mapping.dest}`, fileId]
        );
      } else {
        const docId = makeDocId();
        const res = await client.query(
          `INSERT INTO files (
            document_id, name, alternative_text, caption, focal_point, 
            width, height, formats, hash, ext, mime, size, url, 
            preview_url, provider, provider_metadata, folder_path, 
            created_at, updated_at, published_at, locale
          ) VALUES ($1, $2, $3, null, null, 1024, 1024, null, $4, '.png', 'image/png', $5, $6, null, 'local', null, '/', NOW(), NOW(), NOW(), 'es') RETURNING id`,
          [docId, mapping.dest, mapping.alt, hash, sizeKb, `/uploads/${mapping.dest}`]
        );
        fileId = res.rows[0].id;
        console.log(`Registered file ${mapping.dest} with ID: ${fileId}`);
      }
      fileIds[hash] = fileId;
    }

    // 2. Clear old component relationships for page 93 (draft) and 94 (published)
    // We only preserve 'shared.seo' relations to keep SEO settings intact.
    console.log('Clearing old sections on Metodología pages (IDs 93, 94)...');
    await client.query(
      `DELETE FROM pages_cmps WHERE entity_id IN (93, 94) AND component_type != 'shared.seo'`
    );

    // Helper function to insert components for a specific page
    async function createPageComponents(pageId) {
      console.log(`Creating components for page ID ${pageId}...`);

      // A. HERO BLOCK (blocks.hero)
      const heroRes = await client.query(
        `INSERT INTO components_blocks_heroes (eyebrow, title, subtitle, alignment, variant)
         VALUES ($1, $2, $3, 'left', 'default') RETURNING id`,
        [
          'Vivir el idioma desde el primer día',
          'Metodología Universa: aprende a pensar en inglés, no a traducirlo',
          'Nuestra metodología Universa se enfoca en natural parte de una premisa simple: el inglés se aprende de la misma forma en que aprendiste tu lengua materna, a través del uso constante and contextualizado, no de la repetición mecánica de reglas. Desde tu primera clase, te sumerges en situaciones reales —presentarte, pedir información, resolver un problema cotidiano— y el idioma se convierte en una herramienta viva, no en una materia de examen.'
        ]
      );
      const heroId = heroRes.rows[0].id;
      
      await client.query(
        `INSERT INTO files_related_mph (file_id, related_id, related_type, field, "order")
         VALUES ($1, $2, 'blocks.hero', 'foregroundImage', 1)`,
        [fileIds['metodologia-hero-clase-en-vivo'], heroId]
      );

      await client.query(
        `INSERT INTO pages_cmps (entity_id, cmp_id, component_type, field, "order")
         VALUES ($1, $2, 'blocks.hero', 'hero', 1)`,
        [pageId, heroId]
      );

      // B. SECTION 1: Gramática (blocks.text-image)
      const sec1Res = await client.query(
        `INSERT INTO components_blocks_text_images (eyebrow, title, body, image_position)
         VALUES ($1, $2, $3, 'right') RETURNING id`,
        [
          'Enfoque natural',
          'Por qué no enseñamos gramática primero',
          'El método tradicional suele priorizar la memorización de estructuras antes que la comunicación efectiva. Esto genera estudiantes que pueden conjugar verbos a la perfección en un examen escrito, pero que dudan al pedir un café o participar en una reunión.\n\nNuestro enfoque invierte ese orden: **primero comunicas, después entiendes por qué funciona así**. La gramática se internaliza de forma natural, como resultado del uso, no como un requisito previo.'
        ]
      );
      const sec1Id = sec1Res.rows[0].id;

      await client.query(
        `INSERT INTO pages_cmps (entity_id, cmp_id, component_type, field, "order")
         VALUES ($1, $2, 'blocks.text-image', 'sections', 1)`,
        [pageId, sec1Id]
      );

      // C. SECTION 2: NatGeo Learning (blocks.feature-list)
      const sec2Res = await client.query(
        `INSERT INTO components_blocks_feature_lists (eyebrow, title, subtitle, columns, layout)
         VALUES ($1, $2, $3, 3, 'standard') RETURNING id`,
        [
          'Garantía de calidad',
          'El respaldo de National Geographic Learning',
          'Todo nuestro material didáctico está sustentado por National Geographic Learning, a través de la plataforma Spark. Esto te expone a contextos culturales auténticos y ritmos de habla reales.'
        ]
      );
      const sec2Id = sec2Res.rows[0].id;

      // Create 3 sub-features
      const features = [
        { title: 'Video Journals', desc: 'Historias reales y documentales breves para conectar con el mundo real.', icon: 'video' },
        { title: 'TED Talks', desc: 'Charlas de alto impacto seleccionadas por nivel para exponerte a acentos variados.', icon: 'presentation' },
        { title: 'Contextos Auténticos', desc: 'Material diseñado para internalizar la gramática a través del uso práctico.', icon: 'globe' },
      ];

      for (let i = 0; i < features.length; i++) {
        const itemRes = await client.query(
          `INSERT INTO components_shared_feature_items (title, description, icon_name)
           VALUES ($1, $2, $3) RETURNING id`,
          [features[i].title, features[i].desc, features[i].icon]
        );
        const itemId = itemRes.rows[0].id;

        await client.query(
          `INSERT INTO components_blocks_feature_lists_cmps (entity_id, cmp_id, component_type, field, "order")
           VALUES ($1, $2, 'shared.feature-item', 'items', $3)`,
          [sec2Id, itemId, i + 1]
        );
      }

      // Link NatGeo CTA
      const cta2Res = await client.query(
        `INSERT INTO components_shared_ctas (label, url, style)
         VALUES ($1, $2, 'primary') RETURNING id`,
        ['Conoce a fondo nuestro material didáctico →', '/blog/respaldo-national-geographic-learning']
      );
      const cta2Id = cta2Res.rows[0].id;

      await client.query(
        `INSERT INTO components_blocks_feature_lists_cmps (entity_id, cmp_id, component_type, field, "order")
         VALUES ($1, $2, 'shared.cta', 'primaryCta', 1)`,
        [sec2Id, cta2Id]
      );

      await client.query(
        `INSERT INTO pages_cmps (entity_id, cmp_id, component_type, field, "order")
         VALUES ($1, $2, 'blocks.feature-list', 'sections', 2)`,
        [pageId, sec2Id]
      );

      // D. SECTION 3: Pensar en Inglés (blocks.quote)
      const sec3Res = await client.query(
        `INSERT INTO components_blocks_quotes (eyebrow, quote, attribution)
         VALUES ($1, $2, $3) RETURNING id`,
        [
          'Pensar en inglés: la verdadera meta',
          'El objetivo central de nuestra metodología es eliminar el paso invisible que más frena a los estudiantes: la traducción mental. Cuando pensar en inglés se vuelve tu forma habitual de comunicarte, las respuestas dejan de tardar segundos valiosos y la comunicación fluye con naturalidad.',
          'Metodología Universa'
        ]
      );
      const sec3Id = sec3Res.rows[0].id;

      await client.query(
        `INSERT INTO pages_cmps (entity_id, cmp_id, component_type, field, "order")
         VALUES ($1, $2, 'blocks.quote', 'sections', 3)`,
        [pageId, sec3Id]
      );

      // E. SECTION 4: Programas (blocks.text-image)
      const sec4Res = await client.query(
        `INSERT INTO components_blocks_text_images (eyebrow, title, body, image_position)
         VALUES ($1, $2, $3, 'left') RETURNING id`,
        [
          'Flexibilidad y consistencia',
          '¿Esta metodología es igual en todos los programas?',
          'Sí: la metodología natural y el enfoque comunicativo son la base de todos nuestros programas.\n\nLo que cambia entre programas no es el método, sino el formato: horario fijo o flexible, grupal o individual, estructurado por niveles o diseñado por objetivos puntuales y enfoques académicos.'
        ]
      );
      const sec4Id = sec4Res.rows[0].id;

      const cta4Res = await client.query(
        `INSERT INTO components_shared_ctas (label, url, style)
         VALUES ($1, $2, 'primary') RETURNING id`,
        ['Compara todos los programas →', '/programas']
      );
      const cta4Id = cta4Res.rows[0].id;

      await client.query(
        `INSERT INTO components_blocks_text_images_cmps (entity_id, cmp_id, component_type, field, "order")
         VALUES ($1, $2, 'shared.cta', 'cta', 1)`,
        [sec4Id, cta4Id]
      );

      await client.query(
        `INSERT INTO pages_cmps (entity_id, cmp_id, component_type, field, "order")
         VALUES ($1, $2, 'blocks.text-image', 'sections', 4)`,
        [pageId, sec4Id]
      );

      // F. SECTION 5: CTA Final (blocks.cta-banner)
      const sec5Res = await client.query(
        `INSERT INTO components_blocks_cta_banners (eyebrow, title, subtitle, overlay_strength)
         VALUES ($1, $2, $3, 'medium') RETURNING id`,
        [
          'Únete a Universa',
          'Empieza a hablar inglés con confianza hoy mismo',
          'Inscríbete en nuestros programas y vive el idioma desde el primer día.'
        ]
      );
      const sec5Id = sec5Res.rows[0].id;

      const cta5Res = await client.query(
        `INSERT INTO components_shared_ctas (label, url, style)
         VALUES ($1, $2, 'primary') RETURNING id`,
        ['Escríbenos por WhatsApp', 'https://wa.me/51945311934']
      );
      const cta5Id = cta5Res.rows[0].id;

      await client.query(
        `INSERT INTO components_blocks_cta_banners_cmps (entity_id, cmp_id, component_type, field, "order")
         VALUES ($1, $2, 'shared.cta', 'primaryCta', 1)`,
        [sec5Id, cta5Id]
      );

      await client.query(
        `INSERT INTO pages_cmps (entity_id, cmp_id, component_type, field, "order")
         VALUES ($1, $2, 'blocks.cta-banner', 'sections', 5)`,
        [pageId, sec5Id]
      );

      console.log(`Successfully set up page ID ${pageId}.`);
    }

    // Run for both Draft (93) and Published (94) page records
    await createPageComponents(93);
    await createPageComponents(94);

    // Commit Transaction
    await client.query('COMMIT');
    console.log('Transaction committed successfully! Page Metodología updated.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error during transaction, rolled back:', err);
  } finally {
    await client.end();
  }
}

main();
