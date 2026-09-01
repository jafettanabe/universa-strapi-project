import type { Core } from '@strapi/strapi';
import { rt } from './programa-continuo-grupal-page';

const SLUG = 'programa-dynamic';

export async function upsertProgramaDynamicPage(strapi: Core.Strapi) {
  const store = strapi.store({ type: 'plugin', name: 'universa' });
  const VERSION_STORE_KEY = 'programa_dynamic_page_content_version' as const;
  const CONTENT_VERSION = 'programa-dynamic-prod-v1';

  const appliedVersion = await store.get({ key: VERSION_STORE_KEY });

  if (appliedVersion === CONTENT_VERSION) {
    strapi.log.info(
      `[programa-dynamic-page] Content already at version ${CONTENT_VERSION}; skipping.`
    );
    return;
  }

  // 1. Find or create the image in files table
  let imageId: number | null = null;
  const existingFiles = await strapi.db.connection('files')
    .where('hash', 'Dynamic_dc67f3190d')
    .select('id')
    .first();

  if (existingFiles) {
    imageId = existingFiles.id;
    strapi.log.info(`[programa-dynamic-page] Found existing image with ID: ${imageId}`);
  } else {
    const docId = 'media-dynamic-' + Date.now();
    const hash = 'Dynamic_dc67f3190d';
    const filename = 'Dynamic_dc67f3190d.png';
    const alt = 'Clases de inglés flexibles - Programa Dynamic Universa';

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
      size: 120.0,
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
      strapi.log.info(`[programa-dynamic-page] Created image entry with ID: ${imageId}`);
    }
  }

  const doc = strapi.documents.bind(strapi);

  const pageData = {
    title: 'Programa Dynamic',
    slug: SLUG,
    pageType: 'landing' as const,
    excerpt: 'El formato ideal para agendas exigentes y cambiantes. Horarios rotativos y aula invertida.',
    showInNavigation: true,
    navigationLabel: 'Programa Dynamic',
    sections: [
      {
        __component: 'blocks.hero' as const,
        eyebrow: 'Grupal reducido',
        title: 'Programa Dynamic: tu horario cambia cada semana, tu constancia no',
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
        title: '¿Qué es el Programa Dynamic?',
        body: rt(
          'El Programa Dynamic funciona bajo el modelo de aula invertida (flipped classroom): antes de cada sesión en vivo, el estudiante revisa material y contenido de forma autónoma; la sesión sincrónica se enfoca en practicar, resolver dudas y aplicar lo aprendido con el docente y el grupo.',
          'A diferencia del Programa Continuo, el horario no es fijo: los días y horarios de las sesiones se programan de forma distinta cada semana, según la disponibilidad real del estudiante.'
        ),
        imagePosition: 'right' as const,
        image: imageId,
      },
      {
        __component: 'blocks.feature-list' as const,
        eyebrow: 'Ventajas Exclusivas',
        title: 'Modelo de aula invertida',
        subtitle: 'Un programa diseñado para adaptarse a tu estilo de vida profesional o académico sin interrupciones.',
        columns: 4,
        layout: 'standard' as const,
        items: [
          {
            title: 'Ritmo 100% adaptado',
            description: 'Ritmo 100% adaptado a la velocidad de aprendizaje del estudiante.',
            iconName: 'clock',
          },
          {
            title: 'Actividades ',
            description: 'Actividades complementarias ilimitadas.',
            iconName: 'message-circle',
          },
          {
            title: 'Grupos reducidos',
            description: 'Grupos reducidos de 1 a 6 estudiantes, lo que mantiene una atención cercana sin llegar al formato 1 a 1.',
            iconName: 'user-check',
          },
          {
            title: 'Horarios variables',
            description: 'Ideal para quienes tienen una agenda cambiante semana a semana: freelancers, estudiantes con horarios variables, profesionales con turnos rotativos.',
            iconName: 'clock',
          },
        ],
      },
      {
        __component: 'blocks.text-image' as const,
        eyebrow: 'Aula invertida ',
        title: 'Aula invertida: ¿por qué funciona?',
        body: rt(
          'El modelo de aula invertida maximiza el tiempo en vivo con el docente para práctica activa, en vez de usarlo para exposición pasiva de contenido. Esto acelera resultados frente a un formato tradicional con la misma cantidad de horas.'
        ),
        imagePosition: 'left' as const,
        cta: {
          label: 'Conoce Flex Signature, nuestra línea premium',
          url: '/programa-flex-privado',
          style: 'secondary' as const,
        }
      },
      {
        __component: 'blocks.text-image' as const,
        eyebrow: 'Público Objetivo',
        title: '¿Para quién es ideal?',
        body: rt(
          'Para estudiantes que necesitan más estructura que Flex Signature (premium, sin niveles fijos) pero más flexibilidad que el Programa Continuó (horario fijo).'
        ),
        imagePosition: 'right' as const,
      },
      {
        __component: 'blocks.cta-banner' as const,
        eyebrow: 'Inicia tu programa',
        title: 'Empieza tu Programa Dynamic.',
        subtitle: 'Aprende con un horario que se adapta a tu semana.',
        overlayStrength: 'medium' as const,
        primaryCta: {
          label: 'Más Información',
          url: 'https://wa.me/51938403729?text=Hola%20%F0%9F%91%8B%20Vengo%20de%20la%20p%C3%A1gina%20del%20Programa%20Dynamic%20en%20la%20web%20de%20Universa%20y%20quiero%20m%C3%A1s%20informaci%C3%B3n.%20Mi%20nombre%20es%20',
          style: 'primary' as const,
        },
      },
    ],
    seo: {
      metaTitle: 'Programa Dynamic | Universa',
      metaDescription: 'Aprende inglés con flexibilidad total. Horarios rotativos, grupos pequeños y aula invertida para avanzar con consistencia.',
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
    strapi.log.info(`[programa-dynamic-page] Page updated (${documentId}).`);
  } else {
    const created = await doc('api::page.page').create({
      data: pageData,
      status: 'published',
    });
    strapi.log.info(`[programa-dynamic-page] Page created (${created.documentId}).`);
  }

  await store.set({ key: VERSION_STORE_KEY, value: CONTENT_VERSION });
}
