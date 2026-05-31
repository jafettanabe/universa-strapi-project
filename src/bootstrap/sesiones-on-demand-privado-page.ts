import type { Core } from '@strapi/strapi';

import { rt } from './programa-continuo-grupal-page';

const SLUG = 'sesiones-on-demand-privado';

export function getSesionesOnDemandPrivadoPageData() {
  return {
    title: 'Sesiones On Demand (Privado)',
    slug: SLUG,
    pageType: 'landing' as const,
    excerpt:
      'Clases privadas 1:1 por horas para reforzar habilidades específicas. Diagnóstico previo, tutoring virtual y paquetes desde S/. 80.',
    showInNavigation: true,
    navigationLabel: 'Sesiones On Demand',
    sections: [
      {
        __component: 'blocks.hero',
        eyebrow: 'Universa English Program · ON DEMAND · 1 TO 1',
        title: 'Sesiones On Demand (Privado)',
        subtitle:
          'Clases privadas 1 a 1 adaptadas 100% a tus necesidades. Revisa temas puntuales y vocabulario en contextos reales con un profesor certificado — tú eliges qué reforzar y cuándo.',
        variant: 'gradient_organic',
        alignment: 'left',
        primaryCta: {
          label: 'Ver paquetes',
          url: '#precios',
          style: 'primary',
        },
        secondaryCta: {
          label: 'Cotización personalizada',
          url: '#cotizar',
          style: 'secondary',
        },
      },
      {
        __component: 'blocks.feature-list',
        eyebrow: 'Áreas de reforzamiento',
        title: '¿Qué habilidad quieres potenciar?',
        subtitle:
          'Sesiones focalizadas según tu objetivo: speaking, listening, gramática, fonética y más.',
        columns: 4,
        layout: 'icon_grid',
        items: [
          { title: 'Speaking', description: 'Fluidez oral y confianza al hablar.', iconName: 'mic' },
          { title: 'Listening', description: 'Comprensión auditiva en contextos reales.', iconName: 'headphones' },
          {
            title: 'Reading & Writing',
            description: 'Lectura crítica y redacción efectiva.',
            iconName: 'book-open',
          },
          { title: 'Grammar', description: 'Estructuras y precisión gramatical.', iconName: 'list-checks' },
          { title: 'Phonetics', description: 'Pronunciación y entonación natural.', iconName: 'audio-lines' },
          { title: 'Vocabulary', description: 'Lexicon especializado y uso contextual.', iconName: 'library' },
          {
            title: 'English in context',
            description: 'Inglés aplicado a situaciones reales.',
            iconName: 'globe',
          },
          {
            title: 'Critical thinking',
            description: 'Análisis y argumentación en inglés.',
            iconName: 'lightbulb',
          },
        ],
      },
      {
        __component: 'blocks.feature-list',
        eyebrow: 'Metodología y plan',
        title: 'Un servicio diseñado a tu medida',
        subtitle:
          'Cada sesión parte de un diagnóstico y un plan alineado a tus objetivos concretos.',
        columns: 3,
        layout: 'standard',
        items: [
          {
            title: 'Diagnóstico previo',
            description:
              'Evaluamos tu nivel y metas para establecer un plan personalizado acorde a lo que necesitas reforzar.',
            iconName: 'clipboard-check',
          },
          {
            title: 'Virtual Tutoring',
            description:
              'Tutoría 1:1 en vivo por Zoom con un profesor certificado dedicado a tu progreso.',
            iconName: 'video',
          },
          {
            title: 'Vocabulario especializado',
            description:
              'Revisión de vocabulario técnico o contextual según tu área: laboral, académica o personal.',
            iconName: 'sparkles',
          },
        ],
      },
      {
        __component: 'blocks.pricing-section',
        eyebrow: 'Inversión por horas',
        title: 'Paquetes de sesiones On Demand',
        subtitle:
          'Precios fijos por paquete de horas. Ideal para reforzar antes de una entrevista, examen o presentación.',
        layout: 'hourly',
        plans: [
          {
            planType: 'hourly_package',
            title: '01 hora suelta',
            description: 'Una sesión privada para un tema puntual.',
            hoursCount: 1,
            priceAmount: 80,
            currency: 'PEN',
          },
          {
            planType: 'hourly_package',
            title: 'Paquete 4 horas',
            description: 'Cuatro sesiones para profundizar en un área.',
            hoursCount: 4,
            priceAmount: 280,
            currency: 'PEN',
            badgeText: 'S/. 70 / hora',
          },
          {
            planType: 'hourly_package',
            title: 'Paquete 6 horas',
            description: 'Seis sesiones con ahorro progresivo.',
            hoursCount: 6,
            priceAmount: 360,
            currency: 'PEN',
            badgeText: 'S/. 60 / hora',
          },
          {
            planType: 'hourly_package',
            title: 'Paquete 12 horas',
            description: 'El mejor valor por hora para un plan de refuerzo sostenido.',
            hoursCount: 12,
            priceAmount: 540,
            currency: 'PEN',
            isHighlighted: true,
            badgeText: 'Mejor valor · S/. 45 / hora',
          },
        ],
        customQuoteText:
          'Si deseas un paquete diferente de horas, solicita una cotización personalizada con tu Asesor Universa.',
        customQuoteCta: {
          label: 'WhatsApp con un Asesor',
          url: 'https://wa.me/51945311934',
          style: 'primary',
        },
        primaryCta: {
          label: 'Reservar sesión',
          url: '#cotizar',
          style: 'primary',
        },
      },
      {
        __component: 'blocks.text-image',
        eyebrow: 'Modalidad',
        title: '100% online, 1:1 y a tu ritmo',
        body: rt(
          'Sesiones privadas en vivo por Zoom con horarios acordados según tu disponibilidad.',
          'Sin curso fijo: cada hora se invierte en lo que tú necesitas reforzar.',
          'Profesores certificados con experiencia en tutoring personalizado.',
        ),
        imagePosition: 'right',
      },
      {
        __component: 'blocks.contact-form',
        eyebrow: 'Cotización especial',
        title: '¿Necesitas un paquete de horas a medida?',
        subtitle:
          'Cuéntanos cuántas horas buscas y qué habilidades quieres reforzar. Un asesor te enviará una cotización personalizada.',
        variant: 'advisor',
        successMessage:
          'Gracias. Un asesor Universa te contactará con tu cotización personalizada.',
        subjectOptions: [
          { value: 'sesiones-on-demand', label: 'Sesiones On Demand' },
          { value: 'paquete-personalizado', label: 'Paquete de horas personalizado' },
          { value: 'refuerzo-habilidades', label: 'Reforzamiento de habilidades' },
        ],
      },
      {
        __component: 'blocks.cta-banner',
        title: 'Refuerza lo que necesitas, cuando lo necesitas',
        subtitle: 'Paquetes personalizados disponibles vía WhatsApp.',
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
      metaTitle: 'Sesiones On Demand (Privado) | Universa',
      metaDescription:
        'Clases privadas 1:1 por horas: Speaking, Listening, Grammar y más. Paquetes desde S/. 80. Cotización personalizada con tu asesor.',
    },
  };
}

const CONTENT_VERSION = 'program-content-no-promo-v3';
const VERSION_STORE_KEY = 'sesiones_on_demand_privado_content_version' as const;

export async function upsertSesionesOnDemandPrivadoPage(strapi: Core.Strapi) {
  const store = strapi.store({ type: 'plugin', name: 'universa' });
  const appliedVersion = await store.get({ key: VERSION_STORE_KEY });

  if (appliedVersion === CONTENT_VERSION) {
    strapi.log.info(
      `[sesiones-on-demand-privado] Content already at version ${CONTENT_VERSION}; skipping upsert.`,
    );
    return;
  }

  const doc = strapi.documents.bind(strapi);
  const pageData = getSesionesOnDemandPrivadoPageData();

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
    strapi.log.info(`[sesiones-on-demand-privado] Page updated (${documentId}).`);
    await store.set({ key: VERSION_STORE_KEY, value: CONTENT_VERSION });
    return documentId;
  }

  const created = await doc('api::page.page').create({
    data: pageData,
    status: 'published',
  });
  strapi.log.info(`[sesiones-on-demand-privado] Page created (${created.documentId}).`);
  await store.set({ key: VERSION_STORE_KEY, value: CONTENT_VERSION });
  return created.documentId;
}
