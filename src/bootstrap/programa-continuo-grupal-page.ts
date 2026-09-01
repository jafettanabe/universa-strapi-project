import type { Core } from '@strapi/strapi';

const SLUG = 'programa-continuo-grupal';

/** Strapi stores Rich Text (Blocks) as a JSON string in the database layer. */
export const rt = (...lines: string[]) =>
  JSON.stringify(
    lines.map((text) => ({
      type: 'paragraph',
      children: [{ type: 'text', text }],
    })),
  );

export async function upsertProgramaContinuoGrupalPage(strapi: Core.Strapi) {
  const store = strapi.store({ type: 'plugin', name: 'universa' });
  const VERSION_STORE_KEY = 'programa_grupal_content_version' as const;
  const CONTENT_VERSION = 'program-content-prod-v1';

  const appliedVersion = await store.get({ key: VERSION_STORE_KEY });

  if (appliedVersion === CONTENT_VERSION) {
    strapi.log.info(
      `[programa-continuo-grupal] Content already at version ${CONTENT_VERSION}; skipping upsert.`,
    );
    return;
  }

  // 1. Find or create the image in files table
  let imageId: number | null = null;
  const existingFiles = await strapi.db.connection('files')
    .where('hash', 'Continuo_Grupal_b38f5c6c07')
    .select('id')
    .first();

  if (existingFiles) {
    imageId = existingFiles.id;
    strapi.log.info(`[programa-continuo-grupal] Found existing image with ID: ${imageId}`);
  } else {
    const docId = 'media-continuo-grupal-' + Date.now();
    const hash = 'Continuo_Grupal_b38f5c6c07';
    const filename = 'Continuo_Grupal_b38f5c6c07.png';
    const alt = 'Clases de inglés en grupo - Programa Continuo Grupal Universa';

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
      size: 93.0,
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
      strapi.log.info(`[programa-continuo-grupal] Created image entry with ID: ${imageId}`);
    }
  }

  const doc = strapi.documents.bind(strapi);

  const pageData = {
    title: 'Programa Continuo Grupal',
    slug: SLUG,
    pageType: 'landing' as const,
    excerpt: 'Aprende inglés en grupos pequeños de 4 a 8 personas, con horarios fijos sincrónicos.',
    showInNavigation: true,
    navigationLabel: 'Programa Continuo Grupal',
    sections: [
      {
        __component: 'blocks.hero' as const,
        eyebrow: 'Grupal reducido',
        title: 'Programa Continuo Grupal: aprende inglés en comunidad',
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
        eyebrow: 'Introducción',
        title: '¿Qué es el Programa Continuo Grupal?',
        body: rt(
          'Son clases sincrónicas en vivo, en horarios fijos, con grupos reducidos de 4 a 8 estudiantes. Mismo estándar de 120 horas académicas por nivel y mismo material de National Geographic Learning que el resto del programa continuo.'
        ),
        imagePosition: 'right' as const,
        image: imageId,
      },
      {
        __component: 'blocks.feature-list' as const,
        eyebrow: 'Ventajas Exclusivas',
        title: 'El valor de aprender en grupo',
        subtitle: 'Aprender con otros acelera tus habilidades comunicativas y te mantiene motivado.',
        columns: 3,
        layout: 'standard' as const,
        items: [
          {
            title: 'Práctica',
            description: 'Práctica de conversación real con distintos compañeros, simulando contextos sociales diversos.',
            iconName: 'message-circle',
          },
          {
            title: 'Motivación y constancia',
            description: 'Motivación y constancia reforzadas por la dinámica grupal.',
            iconName: 'users',
          },
          {
            title: 'Mejor relación',
            description: 'Mejor relación costo-beneficio frente a las modalidades privadas.',
            iconName: 'zap',
          },
        ],
      },
      {
        __component: 'blocks.text-image' as const,
        eyebrow: 'Público Objetivo',
        title: '¿Para quién es ideal?',
        body: rt(
          'Ideal para estudiantes que disfrutan del intercambio social como parte del aprendizaje, y que pueden comprometerse con un horario fijo semanal.'
        ),
        imagePosition: 'left' as const,
      },
      {
        __component: 'blocks.cta-banner' as const,
        eyebrow: 'Únete a nosotros',
        title: 'Empieza tu Programa Continuo Grupal.',
        subtitle: 'Únete a un grupo y empieza tu proceso.',
        overlayStrength: 'medium' as const,
        primaryCta: {
          label: 'Más Información',
          url: 'https://wa.me/51938403729?text=Hola%20%F0%9F%91%8B%20Vengo%20de%20la%20p%C3%A1gina%20del%20Programa%20Continuo%20Grupal%20en%20la%20web%20de%20Universa%20y%20quiero%20m%C3%A1s%20informaci%C3%B3n.%20Mi%20nombre%20es%20',
          style: 'primary' as const,
        },
      },
    ],
    seo: {
      metaTitle: 'Programa Continuo Grupal | Universa',
      metaDescription: 'Aprende inglés en grupos pequeños de 4 a 8 personas, con horarios fijos sincrónicos. Aprende en comunidad con el respaldo de National Geographic Learning.',
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
    strapi.log.info(`[programa-continuo-grupal] Page updated (${documentId}).`);
  } else {
    const created = await doc('api::page.page').create({
      data: pageData,
      status: 'published',
    });
    strapi.log.info(`[programa-continuo-grupal] Page created (${created.documentId}).`);
  }

  await store.set({ key: VERSION_STORE_KEY, value: CONTENT_VERSION });
}

export function getProgramaContinuoGrupalPageData() {
  return {
    title: 'Programa Continuo Grupal',
    slug: SLUG,
    pageType: 'landing' as const,
    excerpt: 'Aprende inglés en grupos pequeños de 4 a 8 personas, con horarios fijos sincrónicos.',
    showInNavigation: true,
    navigationLabel: 'Programa Continuo Grupal',
    sections: []
  };
}
