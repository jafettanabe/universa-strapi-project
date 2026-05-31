import type { Core } from '@strapi/strapi';

import { rt } from './programa-continuo-grupal-page';

const SLUG = 'programa-flex-privado';

export function getProgramaFlexPrivadoPageData() {
  return {
    title: 'Programa Flex Privado',
    slug: SLUG,
    pageType: 'landing' as const,
    excerpt:
      'Autonomía y flexibilidad total: clases 1:1 por horas, sin libros fijos ni avance tradicional. Tú decides cuándo, cómo y qué reforzar.',
    showInNavigation: true,
    navigationLabel: 'Programa Flex Privado',
    sections: [
      {
        __component: 'blocks.hero',
        eyebrow: 'Universa English Program · FLEX · 1 TO 1',
        title: 'Programa Flex Privado',
        subtitle:
          'Diseñado para quienes buscan autonomía y flexibilidad total. Tú decides cuándo, cómo y qué reforzar, con clases personalizadas por horas y un profesor que guía tu progreso según tus necesidades. Sin libro fijo: tu curso se adapta 100% a ti.',
        variant: 'gradient_organic',
        alignment: 'left',
        primaryCta: {
          label: 'Solicitar diagnóstico',
          url: '#diagnostico',
          style: 'primary',
        },
      },
      {
        __component: 'blocks.card-grid',
        eyebrow: '¿Para quién es ideal?',
        title: 'Objetivos y casos de uso',
        subtitle:
          'Perfecto si buscas resultados concretos con un plan hecho a tu medida, no un curso genérico.',
        items: [
          {
            title: 'Entrevistas laborales',
            description: 'Prepara respuestas, vocabulario y confianza para procesos de selección.',
            ctaLabel: 'Quiero esto',
            ctaUrl: '#diagnostico',
          },
          {
            title: 'Certificaciones',
            description: 'Ruta focalizada para exámenes internacionales según tu nivel y fecha objetivo.',
            ctaLabel: 'Quiero esto',
            ctaUrl: '#diagnostico',
          },
          {
            title: 'Presentaciones profesionales',
            description: 'Domina el idioma para exposiciones, pitches y comunicación ejecutiva.',
            ctaLabel: 'Quiero esto',
            ctaUrl: '#diagnostico',
          },
          {
            title: 'Fluidez y confianza',
            description: 'Mejora tu speaking y seguridad al hablar en contextos reales del día a día.',
            ctaLabel: 'Quiero esto',
            ctaUrl: '#diagnostico',
          },
        ],
      },
      {
        __component: 'blocks.feature-list',
        eyebrow: 'Metodología',
        title: 'Cómo aprendes en Flex',
        subtitle: 'Lenguaje real, método adaptativo y medición continua con práctica activa.',
        columns: 3,
        layout: 'standard',
        items: [
          {
            title: 'Enfoque Comunicativo',
            description:
              'Aplicamos lo aprendido a la vida real: situaciones auténticas, interacción y objetivos comunicativos concretos.',
            iconName: 'message-circle',
          },
          {
            title: 'Método Natural',
            description:
              'Pensar directamente en inglés asociando imágenes y videos — interpretar, no traducir.',
            iconName: 'brain',
          },
          {
            title: 'Medición continua',
            description:
              'Acompañamiento docente constante con ajustes según tu avance y metas específicas.',
            iconName: 'line-chart',
          },
        ],
      },
      {
        __component: 'blocks.flex-differentiators',
        eyebrow: 'Sin ataduras tradicionales',
        title: 'Flex vs. curso tradicional',
        subtitle:
          'La diferencia clave: libertad total de contenido y ritmo, con materiales seleccionados por tu profesor.',
        items: [
          {
            title: 'No sigue un Course Advance tradicional',
            description: 'Tu avance responde a tus metas, no a un libro lineal.',
            iconName: 'ban',
            tone: 'negative',
          },
          {
            title: 'No requiere compra de libro',
            description: 'Sin inversión en material fijo ni paquetes editoriales obligatorios.',
            iconName: 'book-x',
            tone: 'negative',
          },
          {
            title: 'No usa la plataforma SPARK',
            description: 'Sin dependencia de una plataforma estructurada: contenido 100% a tu medida.',
            iconName: 'monitor-x',
            tone: 'negative',
          },
          {
            title: 'Materiales seleccionados por tu profesor',
            description: 'Actividades, lecturas y dinámicas centradas en tus necesidades reales.',
            iconName: 'sparkles',
            tone: 'positive',
          },
          {
            title: 'Videos e imágenes interactivas',
            description: 'Recursos visuales para interpretar el idioma en contexto, estilo Método Natural.',
            iconName: 'play-circle',
            tone: 'positive',
          },
          {
            title: 'Reserva horas según tu disponibilidad',
            description: 'Programa y reprograma tus sesiones semanales cuando lo necesites.',
            iconName: 'calendar-plus',
            tone: 'positive',
          },
        ],
      },
      {
        __component: 'blocks.feature-list',
        eyebrow: 'Modalidad',
        title: 'Clases online, flexibles y 1:1',
        subtitle: '100% en vivo por Zoom con profesores certificados.',
        columns: 2,
        layout: 'standard',
        items: [
          {
            title: '100% online en vivo',
            description: 'Sesiones por Zoom con interacción real y feedback inmediato.',
            iconName: 'video',
          },
          {
            title: 'Horarios totalmente flexibles',
            description: 'Según tu disponibilidad semanal — tú defines cuándo estudiar.',
            iconName: 'clock',
          },
          {
            title: 'Clases individuales 1:1',
            description: 'Profesores certificados dedicados exclusivamente a tus objetivos.',
            iconName: 'user-check',
          },
          {
            title: 'Sin material fijo',
            description: 'El contenido se adapta a tus metas en cada sesión.',
            iconName: 'shuffle',
          },
        ],
      },
      {
        __component: 'blocks.text-image',
        eyebrow: 'Objetivo del programa',
        title: 'Una experiencia personalizada, práctica y dinámica',
        body: rt(
          'Brindarte una experiencia personalizada, práctica y dinámica para avanzar según tus metas específicas.',
          'Acompañamiento docente constante sin estar sujeto a un curso tradicional.',
          'Puedes reservar tus horas semanales según tu disponibilidad.',
        ),
        imagePosition: 'left',
      },
      {
        __component: 'blocks.contact-form',
        eyebrow: 'Diagnóstico + cotización',
        title: 'Solicita tu diagnóstico académico y cotización personalizada',
        subtitle:
          'Un asesor Universa evaluará tu nivel y objetivos para diseñar un plan Flex a tu medida. Sin compromiso.',
        variant: 'diagnostic',
        successMessage:
          'Gracias. Te contactaremos para agendar tu diagnóstico académico y enviarte una cotización personalizada.',
        subjectOptions: [
          { value: 'programa-flex-privado', label: 'Programa Flex Privado' },
          { value: 'diagnostico-nivel', label: 'Diagnóstico de nivel' },
          { value: 'cotizacion-horas', label: 'Cotización por horas' },
        ],
      },
      {
        __component: 'blocks.cta-banner',
        title: 'Tu inglés, en tus términos',
        subtitle: 'Flexibilidad total para alcanzar tus metas.',
        overlayStrength: 'medium',
        primaryCta: {
          label: 'WhatsApp +51 945 311 934',
          url: 'https://wa.me/51945311934',
          style: 'primary',
        },
        secondaryCta: {
          label: 'contacto@somosuniversa.com',
          url: 'mailto:contacto@somosuniversa.com',
          style: 'secondary',
        },
      },
    ],
    seo: {
      metaTitle: 'Programa Flex Privado | Universa',
      metaDescription:
        'Clases 1:1 flexibles por horas, sin libros ni SPARK. Diagnóstico académico y cotización personalizada.',
    },
  };
}

const CONTENT_VERSION = 'program-content-no-promo-v3';
const VERSION_STORE_KEY = 'programa_flex_privado_content_version' as const;

export async function upsertProgramaFlexPrivadoPage(strapi: Core.Strapi) {
  const store = strapi.store({ type: 'plugin', name: 'universa' });
  const appliedVersion = await store.get({ key: VERSION_STORE_KEY });

  if (appliedVersion === CONTENT_VERSION) {
    strapi.log.info(
      `[programa-flex-privado] Content already at version ${CONTENT_VERSION}; skipping upsert.`,
    );
    return;
  }

  const doc = strapi.documents.bind(strapi);
  const pageData = getProgramaFlexPrivadoPageData();

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
    await store.set({ key: VERSION_STORE_KEY, value: CONTENT_VERSION });
    return documentId;
  }

  const created = await doc('api::page.page').create({
    data: pageData,
    status: 'published',
  });
  strapi.log.info(`[programa-flex-privado] Page created (${created.documentId}).`);
  await store.set({ key: VERSION_STORE_KEY, value: CONTENT_VERSION });
  return created.documentId;
}
