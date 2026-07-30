import type { Core } from '@strapi/strapi';

const SLUG = 'professional-mastery-lab';
const CONTENT_VERSION = 'professional-mastery-lab-page-v2';
const VERSION_STORE_KEY = 'professional_mastery_lab_page_content_version' as const;

export async function upsertProfessionalMasteryLabPage(strapi: Core.Strapi) {
  const store = strapi.store({ type: 'plugin', name: 'universa' });
  const appliedVersion = await store.get({ key: VERSION_STORE_KEY });

  if (appliedVersion === CONTENT_VERSION) {
    strapi.log.info(`[professional-mastery-lab-page] Content already at version ${CONTENT_VERSION}; skipping.`);
    return;
  }

  const doc = strapi.documents.bind(strapi);
  const pageData = {
    title: 'Professional Mastery Lab',
    slug: SLUG,
    pageType: 'default' as const,
    excerpt: 'Talleres prácticos intensivos enfocados en habilidades de negocio específicas. Desarrolla las destrezas de comunicación necesarias para destacar en entornos corporativos internacionales.',
    showInNavigation: true,
    navigationLabel: 'Talleres',
    hero: {
      eyebrow: 'Especialidades Focalizadas',
      title: 'Nuestros Talleres de Inglés',
      subtitle: 'Entrena habilidades específicas del idioma de forma dinámica, práctica e intensiva. Elige tu taller, agrégalo al carrito e inscríbete de manera directa por WhatsApp.',
      alignment: 'center' as const,
      variant: 'default' as const,
    },
    sections: [
      {
        __component: 'blocks.hero' as const,
        eyebrow: '',
        title: 'Talleres Disponibles',
        subtitle: 'Haz clic en cualquier taller para ver el syllabus completo y los detalles detallados de aprendizaje.',
        alignment: 'left' as const,
        variant: 'default' as const,
      }
    ],
    seo: {
      metaTitle: 'Talleres de Inglés | UNIVERSA',
      metaDescription: 'Desarrolla habilidades clave del inglés de manera interactiva con talleres intensivos de pronunciación, entrevistas y negocios.',
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
    strapi.log.info(`[professional-mastery-lab-page] Page updated (${documentId}).`);
  } else {
    const created = await doc('api::page.page').create({
      data: pageData,
      status: 'published',
    });
    strapi.log.info(`[professional-mastery-lab-page] Page created (${created.documentId}).`);
  }

  await store.set({ key: VERSION_STORE_KEY, value: CONTENT_VERSION });
}
