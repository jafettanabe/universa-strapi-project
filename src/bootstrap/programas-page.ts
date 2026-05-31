import type { Core } from '@strapi/strapi';

const SLUG = 'programas';

export const PROGRAM_OFFERING_CARDS = [
  {
    title: 'Programa Continuo Grupal',
    description:
      'Clases en vivo en grupos reducidos con horarios estructurados, Course Advance y beneficios Comunidad Universa.',
    ctaLabel: 'Ver programa',
    ctaUrl: '/programa-continuo-grupal',
  },
  {
    title: 'Programa Continuo Privado',
    description:
      'Ruta 1:1 personalizada con avance acelerado, horarios flexibles y certificaciones internacionales.',
    ctaLabel: 'Ver programa',
    ctaUrl: '/programa-continuo-privado',
  },
  {
    title: 'Programa Flex Privado',
    description:
      'Autonomía total: clases por horas, sin libro fijo ni plataforma SPARK. Tú defines qué reforzar.',
    ctaLabel: 'Ver programa',
    ctaUrl: '/programa-flex-privado',
  },
  {
    title: 'Sesiones On Demand',
    description:
      'Refuerzo privado por horas en Speaking, Listening, Grammar y más. Paquetes desde S/. 80.',
    ctaLabel: 'Ver programa',
    ctaUrl: '/sesiones-on-demand-privado',
  },
] as const;

const AUDIENCE_PROGRAM_SLUGS = [
  'universa-adultos',
  'universa-juniors',
  'universa-empresas',
] as const;

export function buildProgramasPageSections(programDocumentIds: string[]) {
  return [
    {
      __component: 'blocks.card-grid' as const,
      title: 'Nuestros programas de inglés',
      subtitle:
        'Cuatro modalidades para distintos ritmos, objetivos y niveles de acompañamiento.',
      items: PROGRAM_OFFERING_CARDS.map((card) => ({ ...card })),
    },
    {
      __component: 'blocks.program-highlights' as const,
      eyebrow: 'Por audiencia',
      title: 'Oferta principal',
      subtitle: 'Adultos, Juniors y Empresas.',
      programs: { set: programDocumentIds },
    },
  ];
}

async function resolveAudienceProgramIds(strapi: Core.Strapi): Promise<string[]> {
  const doc = strapi.documents.bind(strapi);
  const ids: string[] = [];

  for (const programSlug of AUDIENCE_PROGRAM_SLUGS) {
    const found = await doc('api::program.program').findMany({
      filters: { slug: { $eq: programSlug } },
      limit: 1,
    });
    if (found[0]?.documentId) {
      ids.push(found[0].documentId);
    } else {
      strapi.log.warn(`[programas-page] Program "${programSlug}" not found.`);
    }
  }

  return ids;
}

const CONTENT_VERSION = 'programas-four-programs-v3';
const VERSION_STORE_KEY = 'programas_page_content_version' as const;

export async function upsertProgramasPage(strapi: Core.Strapi) {
  const store = strapi.store({ type: 'plugin', name: 'universa' });
  const appliedVersion = await store.get({ key: VERSION_STORE_KEY });

  if (appliedVersion === CONTENT_VERSION) {
    strapi.log.info(`[programas-page] Content already at version ${CONTENT_VERSION}; skipping.`);
    return;
  }

  const programIds = await resolveAudienceProgramIds(strapi);
  if (programIds.length === 0) {
    strapi.log.warn('[programas-page] No audience programs found; skipping upsert.');
    return;
  }

  const doc = strapi.documents.bind(strapi);
  const pageData = {
    title: 'Programas',
    slug: SLUG,
    pageType: 'landing' as const,
    excerpt: 'Explora nuestras rutas de aprendizaje: programas por modalidad y propuestas por audiencia.',
    showInNavigation: true,
    navigationLabel: 'Programas',
    sections: buildProgramasPageSections(programIds),
    seo: {
      metaTitle: 'Programas | Universa',
      metaDescription:
        'Programa Continuo Grupal, Privado, Flex y Sesiones On Demand. También rutas para Adultos, Juniors y Empresas.',
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
    strapi.log.info(`[programas-page] Page updated (${documentId}).`);
  } else {
    const created = await doc('api::page.page').create({
      data: pageData,
      status: 'published',
    });
    strapi.log.info(`[programas-page] Page created (${created.documentId}).`);
  }

  await store.set({ key: VERSION_STORE_KEY, value: CONTENT_VERSION });
}
