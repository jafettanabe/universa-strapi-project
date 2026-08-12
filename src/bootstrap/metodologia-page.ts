import type { Core } from '@strapi/strapi';
import { rt } from './programa-continuo-grupal-page';

const SLUG = 'metodologia';
const CONTENT_VERSION = 'metodologia-page-v3';
const VERSION_STORE_KEY = 'metodologia_page_content_version' as const;

export async function upsertMetodologiaPage(strapi: Core.Strapi) {
  const store = strapi.store({ type: 'plugin', name: 'universa' });
  const appliedVersion = await store.get({ key: VERSION_STORE_KEY });

  if (appliedVersion === CONTENT_VERSION) {
    strapi.log.info(`[metodologia-page] Content already at version ${CONTENT_VERSION}; skipping.`);
    return;
  }

  const doc = strapi.documents.bind(strapi);

  // 1. Find or create the Hero image in files table
  let imageId: number | null = null;
  
  const existingFiles = await strapi.db.connection('files')
    .where('hash', 'metodologia-hero-clase-en-vivo')
    .select('id')
    .first();

  if (existingFiles) {
    imageId = existingFiles.id;
    strapi.log.info(`[metodologia-page] Found existing Hero image with ID: ${imageId}`);
  } else {
    // Register file entry in DB
    const docId = 'media-metodologia-hero-' + Date.now();
    const hash = 'metodologia-hero-clase-en-vivo';
    const filename = 'metodologia-hero-clase-en-vivo.png';
    const alt = 'Clase de inglés en vivo con metodología natural Universa';

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
      size: 150.0,
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
      strapi.log.info(`[metodologia-page] Registered Hero image in database with ID: ${imageId}`);
    }
  }

  const pageData = {
    title: 'Metodología',
    slug: SLUG,
    pageType: 'default' as const,
    excerpt: 'Metodología Universa: aprende a pensar en inglés, no a traducirlo. Vivir el idioma desde el primer día.',
    showInNavigation: true,
    navigationLabel: 'Metodología',
    hero: {
      eyebrow: 'Vivir el idioma desde el primer día',
      title: 'Metodología Universa: aprende a pensar en inglés, no a traducirlo',
      subtitle: 'Nuestra metodología Universa se enfoca en natural parte de una premisa simple: el inglés se aprende de la misma forma en que aprendiste tu lengua materna, a través del uso constante y contextualizado, no de la repetición mecánica de reglas. Desde tu primera clase, te sumerges en situaciones reales —presentarte, pedir información, resolver un problema cotidiano— y el idioma se convierte en una herramienta viva, no en una materia de examen.',
      alignment: 'left' as const,
      variant: 'default' as const,
      foregroundImage: imageId ? { id: imageId } : null,
    },
    sections: [
      {
        __component: 'blocks.text-image' as const,
        eyebrow: 'Enfoque natural',
        title: 'Por qué no enseñamos gramática primero',
        body: rt(
          'El método tradicional suele priorizar la memorización de estructuras antes que la comunicación efectiva. Esto genera estudiantes que pueden conjugar verbos a la perfección en un examen escrito, pero que dudan al pedir un café o participar en una reunión.',
          'Nuestro enfoque invierte ese orden: primero comunicas, después entiendes por qué funciona así. La gramática se internaliza de forma natural, como resultado del uso, no como un requisito previo.'
        ),
        imagePosition: 'right' as const,
      },
      {
        __component: 'blocks.feature-list' as const,
        eyebrow: 'Garantía de calidad',
        title: 'El respaldo de National Geographic Learning',
        subtitle: 'Todo nuestro material didáctico está sustentado por National Geographic Learning, a través de la plataforma Spark. Esto te expone a contextos culturales auténticos y ritmos de habla reales.',
        columns: 3,
        layout: 'standard' as const,
        items: [
          {
            title: 'Video Journals',
            description: 'Historias reales y documentales breves para conectar con el mundo real.',
            iconName: 'video'
          },
          {
            title: 'TED Talks',
            description: 'Charlas de alto impacto seleccionadas por nivel para exponerte a acentos variados.',
            iconName: 'presentation'
          },
          {
            title: 'Contextos Auténticos',
            description: 'Material diseñado para internalizar la gramática a través del uso práctico.',
            iconName: 'globe'
          }
        ],
        primaryCta: {
          label: 'Conoce a fondo nuestro material didáctico →',
          url: '/blog/respaldo-national-geographic-learning',
          style: 'primary' as const,
        }
      },
      {
        __component: 'blocks.quote' as const,
        eyebrow: 'Pensar en inglés: la verdadera meta',
        quote: 'El objetivo central de nuestra metodología es eliminar el paso invisible que más frena a los estudiantes: la traducción mental. Cuando pensar en inglés se vuelve tu forma habitual de comunicarte, las respuestas dejan de tardar segundos valiosos y la comunicación fluye con naturalidad.',
        attribution: 'Metodología Universa',
      },
      {
        __component: 'blocks.text-image' as const,
        eyebrow: 'Flexibilidad y consistencia',
        title: '¿Esta metodología es igual en todos los programas?',
        body: rt(
          'Sí: la metodología natural y el enfoque comunicativo son la base de todos nuestros programas.',
          'Lo que cambia entre programas no es el método, sino el formato: horario fijo o flexible, grupal o individual, estructurado por niveles o diseñado por objetivos puntuales y enfoques académicos.'
        ),
        imagePosition: 'left' as const,
        cta: {
          label: 'Compara todos los programas →',
          url: '/programas',
          style: 'primary' as const,
        }
      },
      {
        __component: 'blocks.cta-banner' as const,
        eyebrow: 'Únete a Universa',
        title: 'Empieza a hablar inglés con confianza hoy mismo',
        subtitle: 'Inscríbete en nuestros programas y vive el idioma desde el primer día.',
        overlayStrength: 'medium' as const,
        primaryCta: {
          label: 'Escríbenos por WhatsApp',
          url: 'https://wa.me/51945311934',
          style: 'primary' as const,
        }
      }
    ],
    seo: {
      metaTitle: 'Metodología | Universa',
      metaDescription: 'Conoce la metodología natural de Universa. Aprende a pensar en inglés, no a traducirlo, mediante el uso constante y contextualizado.',
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
    strapi.log.info(`[metodologia-page] Page updated (${documentId}).`);
  } else {
    const created = await doc('api::page.page').create({
      data: pageData,
      status: 'published',
    });
    strapi.log.info(`[metodologia-page] Page created (${created.documentId}).`);
  }

  await store.set({ key: VERSION_STORE_KEY, value: CONTENT_VERSION });
}
