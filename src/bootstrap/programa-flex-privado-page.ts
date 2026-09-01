import type { Core } from '@strapi/strapi';

import { rt } from './programa-continuo-grupal-page';

const SLUG = 'programa-flex-privado';

export async function upsertProgramaFlexPrivadoPage(strapi: Core.Strapi) {
  const store = strapi.store({ type: 'plugin', name: 'universa' });
  const VERSION_STORE_KEY = 'programa_flex_privado_content_version' as const;
  const CONTENT_VERSION = 'program-content-prod-v2';

  const appliedVersion = await store.get({ key: VERSION_STORE_KEY });

  if (appliedVersion === CONTENT_VERSION) {
    strapi.log.info(
      `[programa-flex-privado] Content already at version ${CONTENT_VERSION}; skipping upsert.`,
    );
    return;
  }

  // 1. Find or create the image in files table
  let imageId: number | null = null;
  const existingFiles = await strapi.db.connection('files')
    .where('hash', 'Flex_eab0eb8eb4')
    .select('id')
    .first();

  if (existingFiles) {
    imageId = existingFiles.id;
    strapi.log.info(`[programa-flex-privado] Found existing image with ID: ${imageId}`);
  } else {
    const docId = 'media-flex-privado-' + Date.now();
    const hash = 'Flex_eab0eb8eb4';
    const filename = 'Flex_eab0eb8eb4.png';
    const alt = 'Un programa exclusivo, no una modalidad más - Programa Flex Signature Universa';

    const insertResult = await strapi.db.connection('files').insert({
      document_id: docId,
      name: filename,
      alternative_text: alt,
      caption: null,
      focal_point: null,
      width: 1024,
      height: 1024,
      formats: null,
      hash: hash,
      ext: '.png',
      mime: 'image/png',
      size: 115.0,
      url: `/uploads/${filename}`,
      preview_url: null,
      provider: 'local',
      provider_metadata: null,
      folder_path: '/',
      created_at: new Date(),
      updated_at: new Date()
    }).returning('id');

    if (insertResult && insertResult[0]) {
      imageId = typeof insertResult[0] === 'object' ? insertResult[0].id : insertResult[0];
      strapi.log.info(`[programa-flex-privado] Created image entry with ID: ${imageId}`);
    }
  }

  const doc = strapi.documents.bind(strapi);

  const pageData = {
    title: 'Programa Flex Privado',
    slug: SLUG,
    pageType: 'landing' as const,
    excerpt: 'Autonomía y flexibilidad total: clases 1:1 por horas, sin libros fijos ni avance tradicional. Tú decides cuándo, cómo y qué reforzar.',
    showInNavigation: true,
    navigationLabel: 'Programa Flex Privado',
    sections: [
      {
        __component: 'blocks.hero' as const,
        eyebrow: '1 a 1 personalizado',
        title: 'Flex Signature: el programa premium de Universa, diseñado alrededor de tu meta',
        subtitle: '',
        variant: 'gradient_organic' as const,
        alignment: 'center' as const,
        primaryCta: {
          label: 'Solicitar mi Diagnóstico de Nivel',
          url: '/placement-test',
          style: 'primary' as const,
        },
      },
      {
        __component: 'blocks.text-image' as const,
        eyebrow: 'Línea Premium',
        title: 'Un programa exclusivo, no una modalidad más',
        body: rt(
          'Flex Signature es nuestra línea premium: todas las sesiones son en vivo y estrictamente 1 a 1 con el docente, sin compartir espacio ni ritmo con otros estudiantes. El ingreso implica un proceso de admisión más riguroso, que inicia con un diagnóstico integral de tu nivel de inglés actual, tus objetivos específicos y tus necesidades reales frente al idioma.'
        ),
        imagePosition: 'right' as const,
        image: imageId,
      },
      {
        __component: 'blocks.text-image' as const,
        eyebrow: 'Metodología por Objetivos',
        title: 'Diseñado por objetivos, no por niveles',
        body: rt(
          'Flex Signature no utiliza el material de National Geographic Learning ni sigue necesariamente la estructura de niveles del programa continuo. Cada estudiante recibe un plan de estudios diseñado específicamente para sus metas, con duración variable y los paquetes de horas ajustados a la necesidad. Los horarios son completamente programables y la intensidad puede ajustarse semana a semana.'
        ),
        imagePosition: 'left' as const,
        cta: {
          label: '¿Quieres conocer el proceso de admisión completo y cómo se compara con nuestras sesiones On Demand?',
          url: '/blog/flex-signature-programa-premium',
          style: 'secondary' as const,
        }
      },
      {
        __component: 'blocks.cta-banner' as const,
        eyebrow: 'Inicia tu admisión',
        title: 'Empieza tu Programa Continuo Privado.',
        subtitle: 'Da el paso hacia un aprendizaje de inglés exclusivo y a tu propia medida.',
        overlayStrength: 'medium' as const,
        primaryCta: {
          label: 'Más Información',
          url: 'https://wa.me/51938403729?text=Hola%20%F0%9F%91%8B%20Vengo%20de%20la%20p%C3%A1gina%20del%20Programa%20Flex%20Signature%20en%20la%20web%20de%20Universa%20y%20quiero%20m%C3%A1s%20informaci%C3%B3n.%20Mi%20nombre%20es%20',
          style: 'primary' as const,
        },
      },
    ],
    seo: {
      metaTitle: 'Programa Flex Privado | Universa',
      metaDescription: 'Clases 1:1 flexibles por horas, sin libros ni SPARK. Diagnóstico académico y cotización personalizada.',
    },
  };

  const existing = await doc('api::page.page').findMany({
    filters: { slug: { $eq: SLUG } },
    limit: 1,
  });

  if (existing.length > 0) {
    const { documentId } = existing[0];
    await doc('api::page.page').update({
      documentId,
      data: pageData,
      status: 'published',
    });
    strapi.log.info(`[programa-flex-privado] Page updated (${documentId}).`);
  } else {
    const created = await doc('api::page.page').create({
      data: pageData,
      status: 'published',
    });
    strapi.log.info(`[programa-flex-privado] Page created (${created.documentId}).`);
  }

  await store.set({ key: VERSION_STORE_KEY, value: CONTENT_VERSION });
}
