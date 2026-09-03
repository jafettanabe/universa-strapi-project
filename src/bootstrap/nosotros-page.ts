import type { Core } from '@strapi/strapi';
import { rt } from './programa-continuo-grupal-page';

const SLUG = 'nosotros';
const CONTENT_VERSION = 'nosotros-page-v1';
const VERSION_STORE_KEY = 'nosotros_page_content_version' as const;

export async function upsertNosotrosPage(strapi: Core.Strapi) {
  const store = strapi.store({ type: 'plugin', name: 'universa' });
  const appliedVersion = await store.get({ key: VERSION_STORE_KEY });

  if (appliedVersion === CONTENT_VERSION) {
    strapi.log.info(`[nosotros-page] Content already at version ${CONTENT_VERSION}; skipping.`);
    return;
  }

  const doc = strapi.documents.bind(strapi);

  const pageData = {
    title: 'Nosotros',
    slug: SLUG,
    pageType: 'institutional' as const,
    excerpt: 'Conoce el propósito, equipo y enfoque de Universa.',
    showInNavigation: true,
    navigationLabel: 'Nosotros',
    hero: {
      eyebrow: 'Quiénes somos',
      title: 'Un programa de inglés diseñado alrededor de ti, no al revés',
      subtitle: '',
      alignment: 'center' as const,
      variant: 'default' as const,
    },
    sections: [
      {
        __component: 'blocks.text-image' as const,
        eyebrow: 'Nuestra razón de ser',
        title: 'Nuestra razón de ser',
        body: rt(
          'La mayoría de programas de inglés fuerzan a sus estudiantes a encajar en un horario, un ritmo y un método únicos. En Universa hicimos lo contrario: construimos siete caminos distintos para aprender inglés, porque entendemos que un ejecutivo con agenda apretada, un adolescente que recién empieza y un profesional que necesita un resultado puntual en tres meses no pueden aprender de la misma forma.'
        ),
        imagePosition: 'right' as const,
      },
      {
        __component: 'blocks.feature-list' as const,
        eyebrow: 'Nuestro respaldo académico',
        title: 'Nuestro respaldo académico',
        subtitle: 'Cada programa de Universa está construido sobre dos pilares de respaldo internacional:',
        columns: 2,
        layout: 'standard' as const,
        items: [
          {
            title: 'National Geographic Learning',
            description: 'nuestro material didáctico está basado en historias reales, documentales y contenido audiovisual auténtico, no en diálogos artificiales de libro de texto.',
            iconName: 'book',
          },
          {
            title: 'British Council (Aptis)',
            description: 'al completar tu nivel, puedes certificar tu inglés con Aptis by British Council, reconocido internacionalmente bajo el Marco Común Europeo de Referencia (MCER).',
            iconName: 'award',
          },
        ],
      },
      {
        __component: 'blocks.text-image' as const,
        eyebrow: 'Nuestra comunidad',
        title: 'Nuestra comunidad',
        body: rt(
          'Creemos que las mejores historias de aprendizaje merecen ser contadas. Por eso creamos el Beneficio Comunidad Universa, un programa de embajadores para estudiantes que representan genuinamente el impacto de Universa en sus vidas.'
        ),
        cta: {
          label: 'Conoce el Beneficio Comunidad Universa →',
          url: '/blog/beneficio-comunidad-universa-embajadores',
          style: 'primary' as const,
        },
        imagePosition: 'right' as const,
      },
      {
        __component: 'blocks.cta-banner' as const,
        eyebrow: 'Únete',
        title: '¿Quieres conocer el programa que se adapta a ti?',
        overlayStrength: 'medium' as const,
        primaryCta: {
          label: 'Ver todos los programas →',
          url: '/programas',
          style: 'primary' as const,
        },
      },
    ],
    seo: {
      metaTitle: 'Nosotros | Universa',
      metaDescription: 'Conoce Universa: metodología natural, respaldo de National Geographic Learning y British Council, y un modelo de enseñanza hecho para adaptarse a ti.',
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
    strapi.log.info(`[nosotros-page] Page updated (${documentId}).`);
  } else {
    const created = await doc('api::page.page').create({
      data: pageData,
      status: 'published',
    });
    strapi.log.info(`[nosotros-page] Page created (${created.documentId}).`);
  }

  await store.set({ key: VERSION_STORE_KEY, value: CONTENT_VERSION });
}
