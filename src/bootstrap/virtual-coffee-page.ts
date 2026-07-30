import type { Core } from '@strapi/strapi';

const SLUG = 'virtual-coffee';
const CONTENT_VERSION = 'virtual-coffee-page-v1';
const VERSION_STORE_KEY = 'virtual_coffee_page_content_version' as const;

export async function upsertVirtualCoffeePage(strapi: Core.Strapi) {
  const store = strapi.store({ type: 'plugin', name: 'universa' });
  const appliedVersion = await store.get({ key: VERSION_STORE_KEY });

  if (appliedVersion === CONTENT_VERSION) {
    strapi.log.info(`[virtual-coffee-page] Content already at version ${CONTENT_VERSION}; skipping.`);
    return;
  }

  const doc = strapi.documents.bind(strapi);

  // 1. Create or Find the FAQ items
  let faq1Id: string | null = null;
  let faq2Id: string | null = null;

  const existingFaqs = await doc('api::faq-item.faq-item').findMany({
    filters: {
      question: {
        $in: ['¿Cómo funciona y qué impacto tiene?', 'Beneficios por cantidad de cafés'],
      },
    },
  });

  const f1 = existingFaqs.find(f => f.question === '¿Cómo funciona y qué impacto tiene?');
  if (f1) {
    faq1Id = f1.documentId;
  } else {
    const createdF1 = await doc('api::faq-item.faq-item').create({
      data: {
        question: '¿Cómo funciona y qué impacto tiene?',
        answer: 'En UNIVERSA, estamos comprometidos con construir un ecosistema educativo de inglés exigente, humano y accesible. Gran parte de nuestros clubes de conversación informales son mantenidos por la dedicación de nuestros coaches y voluntarios.\n\nEl Café Virtual es un canal directo para apoyar este esfuerzo:\n\n* **Financiamiento de Becas:** El 40% de cada café se destina al fondo de becas de impacto de UNIVERSA para alumnos de escasos recursos.\n* **Acceso a Conversation Clubs:** Por cada café que agregues, te regalamos un pase digital para ingresar a una sesión guiada de conversación en vivo.\n* **Sostenimiento de la Comunidad:** Ayudas a costear las herramientas técnicas y servidores que mantienen viva la plataforma Spark.',
        category: 'general',
      },
      status: 'published',
    });
    faq1Id = createdF1.documentId;
  }

  const f2 = existingFaqs.find(f => f.question === 'Beneficios por cantidad de cafés');
  if (f2) {
    faq2Id = f2.documentId;
  } else {
    const createdF2 = await doc('api::faq-item.faq-item').create({
      data: {
        question: 'Beneficios por cantidad de cafés',
        answer: '* **01 Café:** 1 pase para el Club de Conversación informal + mención de agradecimiento.\n* **03 Cafés:** 3 pases para el Club de Conversación + participación automática en sorteos de libros digitales y materiales premium.\n* **05 Cafés o más:** Pases ilimitados para los clubes durante el mes en curso + acceso prioritario a grabaciones de talleres anteriores.',
        category: 'general',
      },
      status: 'published',
    });
    faq2Id = createdF2.documentId;
  }

  const pageData = {
    title: 'Café Virtual (Virtual Coffee)',
    slug: SLUG,
    pageType: 'default' as const,
    excerpt: 'Apoya la sostenibilidad de la comunidad de UNIVERSA invitando un café virtual a nuestro equipo. Por cada café, recibes pases extra para participar en nuestros Conversation Clubs.',
    showInNavigation: false,
    navigationLabel: 'Café Virtual',
    sections: [
      {
        __component: 'blocks.hero' as const,
        eyebrow: '☕ Ecosistema Universa',
        title: 'Café Virtual (Virtual Coffee)',
        subtitle: 'Apoya la sostenibilidad de la comunidad de UNIVERSA invitando un café virtual a nuestro equipo. Por cada café, recibes pases extra para participar en nuestros Conversation Clubs.',
        alignment: 'left' as const,
        variant: 'default' as const,
      },
      {
        __component: 'blocks.faq' as const,
        eyebrow: 'Detalles',
        title: 'Preguntas y beneficios del Café Virtual',
        subtitle: 'Conoce cómo funciona y cómo retribuimos tu apoyo.',
        faqItems: {
          set: [faq1Id, faq2Id].filter((id): id is string => id !== null),
        },
      }
    ],
    seo: {
      metaTitle: 'Café Virtual (Virtual Coffee) | UNIVERSA',
      metaDescription: 'Apoya la sostenibilidad de la comunidad de UNIVERSA invitando un café virtual a nuestro equipo. Recibe pases extra para Conversation Clubs.',
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
    strapi.log.info(`[virtual-coffee-page] Page updated (${documentId}).`);
  } else {
    const created = await doc('api::page.page').create({
      data: pageData,
      status: 'published',
    });
    strapi.log.info(`[virtual-coffee-page] Page created (${created.documentId}).`);
  }

  await store.set({ key: VERSION_STORE_KEY, value: CONTENT_VERSION });
}
