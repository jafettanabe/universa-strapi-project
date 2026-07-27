import type { Core } from '@strapi/strapi';

const SLUG = 'servicios';

export const SERVICIOS_TABLE_ITEMS = [
  {
    title: "Programa Continuo Privado",
    modality: "1 a 1",
    groupSize: "Individual",
    schedule: "Preestablecido y/o programable",
    idealFor: "Quienes buscan ritmo constante con atención exclusiva",
    cardDescription: "Aprende a tu propio ritmo con la guía exclusiva de un profesor particular. Diseñado para maximizar tu tiempo de habla y enfocarse directamente en tus fortalezas y oportunidades de mejora.",
    ctaLabel: "Ver detalles del programa",
    ctaUrl: "/programa-continuo-privado",
    slugKey: "programa-continuo-privado"
  },
  {
    title: "Programa Continuo Grupal",
    modality: "Grupal",
    groupSize: "4 a 8 personas",
    schedule: "Preestablecido, sincrónico",
    idealFor: "Quienes prefieren aprender en comunidad, con horario estable",
    cardDescription: "Aprende inglés interactuando en grupos reducidos. Practica con dinámicas participativas y debates, manteniendo un horario de clases fijo para asegurar constancia.",
    ctaLabel: "Ver detalles del programa",
    ctaUrl: "/programa-continuo-grupal",
    slugKey: "programa-continuo-grupal"
  },
  {
    title: "Programa Dynamic",
    modality: "Grupal reducido",
    groupSize: "1 a 6 personas",
    schedule: "Preestablecidos, programable, reprogramable, rotativo cambia cada semana",
    idealFor: "Quienes necesitan flexibilidad pero con ritmo de estudio autónomo (aula invertida)",
    cardDescription: "El formato ideal para agendas exigentes. Cambia tus horarios semana a semana mientras avanzas con nuestro moderno modelo híbrido de aprendizaje activo.",
    ctaLabel: "Ver detalles del programa",
    ctaUrl: "/programa-dynamic",
    slugKey: "programa-dynamic"
  },
  {
    title: "Flex Signature",
    modality: "1 a 1 (premium)",
    groupSize: "Individual",
    schedule: "100% programable",
    idealFor: "Objetivos y requerimientos específicos, plazos definidos, máxima personalización",
    cardDescription: "El servicio premium de Universa. Diseñado a medida para ti, con reprogramación ilimitada de clases y un currículo desarrollado exclusivamente para tus metas profesionales o académicas.",
    ctaLabel: "Ver detalles del programa",
    ctaUrl: "/flex-signature",
    slugKey: "flex-signature"
  },
  {
    title: "Sesiones On Demand",
    modality: "Actividad suelta",
    groupSize: "Individual",
    schedule: "A demanda",
    idealFor: "Reforzar una habilidad específica sin compromiso de programa",
    cardDescription: "Sesiones individuales programables a la carta. Prepárate para una entrevista de trabajo, un viaje importante o una presentación específica sin atarte a un ciclo completo.",
    ctaLabel: "Ver detalles del programa",
    ctaUrl: "/sesiones-on-demand",
    slugKey: "sesiones-on-demand"
  },
  {
    title: "Conversation Clubs",
    modality: "Taller grupal",
    groupSize: "Grupo pequeño",
    schedule: "Preestablecido, agendable",
    idealFor: "Practicar conversación de forma recurrente",
    cardDescription: "Clubs de conversación guiados por un tutor para soltar la lengua, ganar fluidez y expandir tu vocabulario social y profesional en un ambiente de apoyo y debate.",
    ctaLabel: "Ver detalles del programa",
    ctaUrl: "/conversation-clubs",
    slugKey: "conversation-clubs"
  },
  {
    title: "Professional Mastery Lab",
    modality: "Taller especializado",
    groupSize: "Grupal o privado",
    schedule: "Según taller",
    idealFor: "Necesidades profesionales puntuales (negociación, entrevistas, presentaciones)",
    cardDescription: "Talleres prácticos intensivos enfocados en habilidades de negocio específicas. Desarrolla las destrezas de comunicación necesarias para destacar en entornos corporativos internacionales.",
    ctaLabel: "Ver detalles del programa",
    ctaUrl: "/Professional-Mastery-Lab",
    slugKey: "professional-mastery-lab"
  }
];

export function buildServiciosPageSections() {
  return [
    {
      __component: 'blocks.hero' as const,
      eyebrow: 'Nuestros Servicios',
      title: '¿Cuál es tu programa de inglés ideal?',
      subtitle: 'Cada estudiante llega con una necesidad distinta: algunos buscan estructura y ritmo grupal, otros necesitan flexibilidad total, y otros solo quieren reforzar una habilidad puntual. Por eso Universa ofrece siete formatos distintos, todos con la misma base de metodología natural y enfoque comunicativo para sincronizarnos con tu objetivo de aprendizaje.',
      alignment: 'center' as const,
      variant: 'default' as const,
    },
    {
      __component: 'blocks.cta-banner' as const,
      title: '¿Aún no sabes qué programa elegir?',
      subtitle: 'Antes de comparar, conoce tu nivel real de inglés con nuestro Placement Test gratuito. En minutos tendrás una base clara para saber qué programa se ajusta mejor a ti.',
      primaryCta: {
        label: 'Tomar Placement Test',
        url: '/placement-test',
        variant: 'default' as const,
      }
    },
    {
      __component: 'blocks.levels-chart' as const,
      title: 'Niveles Universa',
      description: 'Para garantizar la calidad y tus estándares académicos todos nuestros niveles y cursos guardan correlación con el Marco Común Europeo de Referencia para las Lenguas (MCER). Nuestros niveles se encuentran divididos en un rango de Ciclos de 0 al 12.',
      eyebrow: 'Alineados con Estándares Internacionales',
    },
    {
      __component: 'blocks.comparison-table' as const,
      title: 'Tabla comparativa de programas',
      description: 'Compara nuestros siete formatos disponibles y elige el que mejor se adapte a tus ritmos diarios y necesidades de aprendizaje.',
      cardsTitle: 'Explora nuestros programas individuales',
      cardsDescription: 'Conoce más sobre las ventajas exclusivas y el enfoque de cada uno de los formatos que hemos desarrollado para ti.',
      items: SERVICIOS_TABLE_ITEMS,
    }
  ];
}

const CONTENT_VERSION = 'servicios-page-v1';
const VERSION_STORE_KEY = 'servicios_page_content_version' as const;

export async function upsertServiciosPage(strapi: Core.Strapi) {
  const store = strapi.store({ type: 'plugin', name: 'universa' });
  const appliedVersion = await store.get({ key: VERSION_STORE_KEY });

  if (appliedVersion === CONTENT_VERSION) {
    strapi.log.info(`[servicios-page] Content already at version ${CONTENT_VERSION}; skipping.`);
    return;
  }

  const doc = strapi.documents.bind(strapi);
  const pageData = {
    title: 'Servicios',
    slug: SLUG,
    pageType: 'landing' as const,
    excerpt: 'Compara nuestros siete formatos disponibles y conoce tu nivel real de inglés con nuestro Placement Test.',
    showInNavigation: true,
    navigationLabel: 'Servicios',
    sections: buildServiciosPageSections(),
    seo: {
      metaTitle: 'Servicios de Inglés | Universa',
      metaDescription: 'Compara nuestros formatos de aprendizaje grupal, individual y especializado para encontrar el programa ideal para ti.',
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
    strapi.log.info(`[servicios-page] Page updated (${documentId}).`);
  } else {
    const created = await doc('api::page.page').create({
      data: pageData,
      status: 'published',
    });
    strapi.log.info(`[servicios-page] Page created (${created.documentId}).`);
  }

  await store.set({ key: VERSION_STORE_KEY, value: CONTENT_VERSION });
}
