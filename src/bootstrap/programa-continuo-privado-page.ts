import type { Core } from '@strapi/strapi';

import { rt } from './programa-continuo-grupal-page';

const SLUG = 'programa-continuo-privado';

const CERT_DEFS = [
  {
    slug: 'certificado-aptis',
    name: 'Certificado APTIS',
    issuer: 'APTIS',
    description:
      'Certificación internacional de inglés reconocida globalmente para acreditar tu nivel.',
    externalUrl: 'https://www.britishcouncil.pe/examen/aptis',
  },
  {
    slug: 'certificado-english-score',
    name: 'Certificado English Score',
    issuer: 'English Score',
    description:
      'Certificación digital que valida tu competencia comunicativa en entornos profesionales.',
    externalUrl: 'https://www.englishscore.com/',
  },
  {
    slug: 'certificate-completion-universa',
    name: 'Certificate of Completion Universa',
    issuer: 'Universa',
    description:
      'Certificado de finalización oficial que acredita tu progreso en el programa privado.',
  },
] as const;

async function ensurePrivadoCertifications(strapi: Core.Strapi) {
  const doc = strapi.documents.bind(strapi);
  const documentIds: string[] = [];

  for (const cert of CERT_DEFS) {
    const existing = await doc('api::certification.certification').findMany({
      filters: { slug: { $eq: cert.slug } },
      limit: 1,
    });

    if (existing.length > 0) {
      await doc('api::certification.certification').update({
        documentId: existing[0].documentId,
        data: {
          name: cert.name,
          issuer: cert.issuer,
          description: cert.description,
          externalUrl: 'externalUrl' in cert ? cert.externalUrl : undefined,
        },
        status: 'published',
      });
      documentIds.push(existing[0].documentId);
      continue;
    }

    const created = await doc('api::certification.certification').create({
      data: {
        name: cert.name,
        slug: cert.slug,
        issuer: cert.issuer,
        description: cert.description,
        externalUrl: 'externalUrl' in cert ? cert.externalUrl : undefined,
      },
      status: 'published',
    });
    documentIds.push(created.documentId);
  }

  return documentIds;
}

export function getProgramaContinuoPrivadoPageData(certificationIds: string[], imageId: number | null) {
  return {
    title: 'Programa Continuo Privado',
    slug: SLUG,
    pageType: 'landing' as const,
    excerpt:
      'Aprende inglés a tu propio ritmo con sesiones exclusivas 1 a 1, horario adaptable y la atención enfocada de un profesor particular.',
    showInNavigation: true,
    navigationLabel: 'Programa Continuo Privado',
    hero: {
      eyebrow: 'Individual 1 a 1',
      title: 'Programa Continuo Privado: tu ritmo, tu horario, toda la atención para ti',
      subtitle:
        'El estándar académico más alto con la exclusividad y flexibilidad de un tutor personal. Diseñado para optimizar tu tiempo de práctica y lograr fluidez real.',
      variant: 'gradient_organic',
      alignment: 'left',
      audienceTags: [
        { label: 'Adolescentes', ageRange: '14 - 17 años' },
        { label: 'Adultos', ageRange: '18 - 49 años' },
        { label: 'Seniors', ageRange: '50+ años' },
      ],
      primaryCta: {
        label: 'Empieza tu Programa Continuo Privado',
        url: 'https://wa.me/51945311934?text=Hola,%20quiero%20más%20información%20sobre%20el%20Programa%20Continuo%20Privado',
        style: 'primary',
      },
    },
    sections: [
      {
        __component: 'blocks.text-image',
        eyebrow: 'Introducción',
        title: '¿Qué es el Programa Continuo Privado?',
        body: rt(
          'El Programa Continuo Privado es la versión individual de nuestro programa estructurado por niveles que guarda correlación con el Marco Común Europeo de Referencia para las lenguas (MCER): mismo estándar académico de 120 horas por nivel, mismo material de National Geographic Learning, pero en sesiones exclusivas 1 a 1 con horario preestablecido y/o programable.',
        ),
        imagePosition: 'right',
        image: imageId,
      },
      {
        __component: 'blocks.feature-list',
        eyebrow: 'Ventajas de la atención individual',
        title: 'Beneficios de la atención individual',
        subtitle: 'Atención 100% dedicada a potenciar tus habilidades.',
        columns: 3,
        layout: 'standard',
        items: [
          {
            title: 'Ritmo Adaptado',
            description: 'Ritmo 100% adaptado a la velocidad de aprendizaje del estudiante.',
            iconName: 'clock',
          },
          {
            title: 'Mayor conversación',
            description: 'Mayor tiempo de práctica oral por sesión, sin compartir tiempo con compañeros.',
            iconName: 'message-circle',
          },
          {
            title: 'Docente enfocado',
            description: 'Docente enfocado exclusivamente en las fortalezas y áreas de mejora del estudiante.',
            iconName: 'user-check',
          },
        ],
      },
      {
        __component: 'blocks.quote',
        eyebrow: '¿Para quién es ideal?',
        quote:
          'Este programa es ideal para estudiantes que valoran la constancia de una estructura clara y un inglés integral (General English), pero prefieren una atención personalizada del profesor.',
        attribution: 'Programa Continuo Privado · Universa',
      },
      {
        __component: 'blocks.text-image',
        eyebrow: 'Comparativa',
        title: 'Diferencia con Flex Signature',
        body: rt(
          'El Programa Continuo Privado sigue la estructura por niveles, con 120 horas académicas como estándar. Flex Signature, en cambio, es nuestro programa premium: no tiene niveles fijos, y se diseña por completo alrededor de un objetivo puntual.',
        ),
        imagePosition: 'left',
        cta: {
          label: 'Conoce Flex Signature, nuestra línea premium →',
          url: '/programa-flex-privado',
          style: 'secondary',
        },
      },
      {
        __component: 'blocks.cta-banner',
        title: 'Empieza tu Programa Continuo Privado.',
        subtitle: 'Da el paso hacia un aprendizaje de inglés exclusivo y a tu propia medida.',
        overlayStrength: 'medium',
        primaryCta: {
          label: 'Contactar por WhatsApp',
          url: 'https://wa.me/51945311934?text=Hola,%20quiero%20más%20información%20sobre%20el%20Programa%20Continuo%20Privado',
          style: 'primary',
        },
      },
    ],
    seo: {
      metaTitle: 'Programa Continuo Privado | Universa',
      metaDescription:
        'Aprende inglés a tu propio ritmo con sesiones exclusivas 1 a 1, horario adaptable y la atención enfocada de un profesor particular.',
    },
  };
}

const CONTENT_VERSION = 'program-content-prod-v1';
const VERSION_STORE_KEY = 'programa_privado_content_version' as const;

/** Crea certificaciones y la página /programa-continuo-privado. */
export async function upsertProgramaContinuoPrivadoPage(strapi: Core.Strapi) {
  const store = strapi.store({ type: 'plugin', name: 'universa' });
  const appliedVersion = await store.get({ key: VERSION_STORE_KEY });

  if (appliedVersion === CONTENT_VERSION) {
    strapi.log.info(
      `[programa-continuo-privado] Content already at version ${CONTENT_VERSION}; skipping upsert.`,
    );
    return;
  }

  // 1. Find or create the image in files table
  let imageId: number | null = null;
  const existingFiles = await strapi.db.connection('files')
    .where('hash', 'continuo_privado_hero_7d76a5e61e')
    .select('id')
    .first();

  if (existingFiles) {
    imageId = existingFiles.id;
    strapi.log.info(`[programa-continuo-privado] Found existing image with ID: ${imageId}`);
  } else {
    const docId = 'media-continuo-privado-' + Date.now();
    const hash = 'continuo_privado_hero_7d76a5e61e';
    const filename = 'continuo_privado_hero_7d76a5e61e.webp';
    const alt = '¿Qué es el Programa Continuo Privado?';

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
      ext: '.webp',
      mime: 'image/webp',
      size: 51.0,
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
      strapi.log.info(`[programa-continuo-privado] Created image entry with ID: ${imageId}`);
    }
  }

  const doc = strapi.documents.bind(strapi);
  const certificationIds = await ensurePrivadoCertifications(strapi);
  const pageData = getProgramaContinuoPrivadoPageData(certificationIds, imageId);

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
    strapi.log.info(`[programa-continuo-privado] Page updated (${documentId}).`);
    await store.set({ key: VERSION_STORE_KEY, value: CONTENT_VERSION });
    return documentId;
  }

  const created = await doc('api::page.page').create({
    data: pageData,
    status: 'published',
  });
  strapi.log.info(`[programa-continuo-privado] Page created (${created.documentId}).`);
  await store.set({ key: VERSION_STORE_KEY, value: CONTENT_VERSION });
  return created.documentId;
}
