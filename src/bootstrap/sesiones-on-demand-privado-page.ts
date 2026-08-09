import type { Core } from '@strapi/strapi';

import { rt } from './programa-continuo-grupal-page';

const SLUG = 'sesiones-on-demand-privado';

export function getSesionesOnDemandPrivadoPageData(faqIds: string[]) {
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
        __component: 'blocks.comparison-table',
        title: 'Banco de Actividades Dinámicas',
        description: 'Busca y filtra el temario del portafolio On Demand de Universa.',
        items: [
          { title: 'Clínica de Pronunciación (Natural Flow)', modality: 'Producción Oral y Fonética', groupSize: 'General', schedule: 'Niveles 1–10 (A1.1 – C1)', slugKey: '2' },
          { title: 'Roleplay de Situaciones Cotidianas', modality: 'Producción Oral y Fonética', groupSize: 'General', schedule: 'Niveles 1–4 (A1.1 – A2.2)', slugKey: '5' },
          { title: 'Storytelling Colaborativo', modality: 'Producción Oral y Fonética', groupSize: 'General', schedule: 'Niveles 3–7 (A2.1 – B1.3)', slugKey: '4' },
          { title: 'Speed Chatting', modality: 'Producción Oral y Fonética', groupSize: 'General', schedule: 'Niveles 5–8 (B1.1 – B2.1)', slugKey: '3' },
          { title: 'Debate de Actualidad', modality: 'Producción Oral y Fonética', groupSize: 'Profesional', schedule: 'Niveles 8–10 (B2.1 – C1)', slugKey: '1' },
          { title: 'Elevator Pitch Personal', modality: 'Producción Oral y Fonética', groupSize: 'Profesional', schedule: 'Niveles 8–10 (B2.1 – C1)', slugKey: '6' },
          { title: 'Deep Dive: Video Journals de NatGeo', modality: 'Comprensión Auditiva y Crítica', groupSize: 'General', schedule: 'Niveles 3–5 (A2.1 – B1.1)', slugKey: '7' },
          { title: 'Inmersión Documental', modality: 'Comprensión Auditiva y Crítica', groupSize: 'General', schedule: 'Niveles 5–7 (B1.1 – B1.3)', slugKey: '11' },
          { title: 'Podcast Breakdown', modality: 'Comprensión Auditiva y Crítica', groupSize: 'General', schedule: 'Niveles 6–8 (B1.2 – B2.1)', slugKey: '9' },
          { title: 'Decodificación de Acentos', modality: 'Comprensión Auditiva y Crítica', groupSize: 'Profesional', schedule: 'Niveles 7–10 (B1.3 – C1)', slugKey: '10' },
          { title: 'Business Meeting Breakdown', modality: 'Comprensión Auditiva y Crítica', groupSize: 'Profesional', schedule: 'Niveles 7–10 (B1.3 – C1)', slugKey: '12' },
          { title: 'Análisis de TED Talks', modality: 'Comprensión Auditiva y Crítica', groupSize: 'Profesional', schedule: 'Niveles 8–10 (B2.1 – C1)', slugKey: '8' },
          { title: 'Messaging & Social Media English', modality: 'Producción Escrita y Corrección', groupSize: 'General', schedule: 'Niveles 1–4 (A1.1 – A2.2)', slugKey: '15' },
          { title: 'Creative Writing Workshop', modality: 'Producción Escrita y Corrección', groupSize: 'General', schedule: 'Niveles 4–7 (A2.2 – B1.3)', slugKey: '14' },
          { title: 'Laboratorio de Corrección de Errores', modality: 'Producción Escrita y Corrección', groupSize: 'Profesional', schedule: 'Niveles 6–10 (B1.2 – C1)', slugKey: '13' },
          { title: 'Writing Clinic: Coherencia y Cohesión', modality: 'Producción Escrita y Corrección', groupSize: 'Profesional', schedule: 'Niveles 6–8 (B1.2 – B2.1)', slugKey: '17' },
          { title: 'Estructura de Ensayos Persuasivos', modality: 'Producción Escrita y Corrección', groupSize: 'Profesional', schedule: 'Niveles 8–10 (B2.1 – C1)', slugKey: '16' },
          { title: 'Skimming & Scanning Mastery', modality: 'Comprensión Lectora y Vocabulario', groupSize: 'Profesional', schedule: 'Niveles 5–8 (B1.1 – B2.1)', slugKey: '18' },
          { title: 'Análisis de Narrativas Reales', modality: 'Comprensión Lectora y Vocabulario', groupSize: 'General', schedule: 'Niveles 5–7 (B1.1 – B1.3)', slugKey: '20' },
          { title: 'Exploración de Vocabulario Académico', modality: 'Comprensión Lectora y Vocabulario', groupSize: 'Profesional', schedule: 'Niveles 8–10 (B2.1 – C1)', slugKey: '19' },
          { title: 'Lectura Crítica de Noticias', modality: 'Comprensión Lectora y Vocabulario', groupSize: 'Profesional', schedule: 'Niveles 9–10 (B2.2 – C1)', slugKey: '21' },
          { title: 'Grammar in Context (Uso Real)', modality: 'Soporte Lingüístico Estratégico', groupSize: 'General', schedule: 'Niveles 1–10 (A1.1 – C1)', slugKey: '22' },
          { title: 'Idioms & Phrasal Verbs Clinic', modality: 'Soporte Lingüístico Estratégico', groupSize: 'General', schedule: 'Niveles 5–10 (B1.1 – C1)', slugKey: '23' },
          { title: 'Games Night', modality: 'Sesiones Recreativas y de Inmersión Social', groupSize: 'Social / Recreativo', schedule: 'Niveles 1–10 (A1.1 – C1)', slugKey: '26' },
          { title: 'Music Time', modality: 'Sesiones Recreativas y de Inmersión Social', groupSize: 'Social / Recreativo', schedule: 'Niveles 3–10 (A2.1 – C1)', slugKey: '24' },
          { title: 'Movie Time', modality: 'Sesiones Recreativas y de Inmersión Social', groupSize: 'Social / Recreativo', schedule: 'Niveles 3–10 (A2.1 – C1)', slugKey: '25' },
          { title: 'Trivia Night: Pop Culture & Beyond', modality: 'Sesiones Recreativas y de Inmersión Social', groupSize: 'Social / Recreativo', schedule: 'Niveles 3–10 (A2.1 – C1)', slugKey: '27' },
          { title: 'Around the World: Cultural Exchange', modality: 'Sesiones Recreativas y de Inmersión Social', groupSize: 'Social / Recreativo', schedule: 'Niveles 4–10 (A2.2 – C1)', slugKey: '28' },
          { title: 'Comedy Club: Stand-Up & Memes', modality: 'Sesiones Recreativas y de Inmersión Social', groupSize: 'Social / Recreativo', schedule: 'Niveles 6–10 (B1.2 – C1)', slugKey: '29' }
        ]
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
          // PRIVADOS
          {
            planType: 'hourly_package',
            title: 'Privado · 1 mes (8h)',
            description: 'Horario flexible 1:1, ideal para reforzar temas puntuales.',
            hoursCount: 8,
            priceAmount: 576,
            currency: 'PEN',
            badgeText: 'S/. 72 / hora',
          },
          {
            planType: 'hourly_package',
            title: 'Privado · 1 mes (12h)',
            description: 'Sesiones 1:1 para mayor ritmo y práctica continua.',
            hoursCount: 12,
            priceAmount: 768,
            currency: 'PEN',
            badgeText: 'S/. 64 / hora',
          },
          {
            planType: 'hourly_package',
            title: 'Privado · 2 meses (16h)',
            description: 'Refuerzo intermedio con ahorro por hora.',
            hoursCount: 16,
            priceAmount: 896,
            currency: 'PEN',
            badgeText: 'S/. 56 / hora',
          },
          {
            planType: 'hourly_package',
            title: 'Privado · 2 meses (24h)',
            description: 'Preparación intensiva para metas específicas.',
            hoursCount: 24,
            priceAmount: 1152,
            currency: 'PEN',
            badgeText: 'S/. 48 / hora',
          },
          {
            planType: 'hourly_package',
            title: 'Privado · 3 meses (36h)',
            description: 'El mejor valor por hora para fluidez sostenida.',
            hoursCount: 36,
            priceAmount: 1584,
            currency: 'PEN',
            badgeText: 'S/. 44 / hora',
            isHighlighted: true,
          },
          // GRUPALES
          {
            planType: 'hourly_package',
            title: 'Grupal · 1 mes (8h)',
            description: 'Sesiones en grupo para inmersión y conversación.',
            hoursCount: 8,
            priceAmount: 416,
            currency: 'PEN',
            badgeText: 'S/. 52 / hora',
          },
          {
            planType: 'hourly_package',
            title: 'Grupal · 1 mes (12h)',
            description: 'Conversación grupal intensiva.',
            hoursCount: 12,
            priceAmount: 528,
            currency: 'PEN',
            badgeText: 'S/. 44 / hora',
          },
          {
            planType: 'hourly_package',
            title: 'Grupal · 2 meses (16h)',
            description: 'Socio-cultural y debates en grupo.',
            hoursCount: 16,
            priceAmount: 576,
            currency: 'PEN',
            badgeText: 'S/. 36 / hora',
          },
          {
            planType: 'hourly_package',
            title: 'Grupal · 2 meses (24h)',
            description: 'Mayor exposición y participación activa.',
            hoursCount: 24,
            priceAmount: 672,
            currency: 'PEN',
            badgeText: 'S/. 28 / hora',
          },
          {
            planType: 'hourly_package',
            title: 'Grupal · 3 meses (36h)',
            description: 'Sostenimiento de inmersión social a largo plazo.',
            hoursCount: 36,
            priceAmount: 864,
            currency: 'PEN',
            badgeText: 'S/. 24 / hora',
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
      {
        __component: 'blocks.faq',
        eyebrow: 'Preguntas Frecuentes',
        title: 'Preguntas Frecuentes',
        subtitle: 'Resuelve tus dudas sobre las Sesiones On Demand.',
        faqItems: faqIds,
      },
    ],
    seo: {
      metaTitle: 'Sesiones On Demand (Privado) | Universa',
      metaDescription:
        'Clases privadas 1:1 por horas: Speaking, Listening, Grammar y más. Paquetes desde S/. 80. Cotización personalizada con tu asesor.',
    },
  };
}

async function ensureSesionesOnDemandFaqs(strapi: Core.Strapi): Promise<string[]> {
  const doc = strapi.documents.bind(strapi);

  const questions = [
    {
      question: '¿Cómo programo mis sesiones?',
      answer: 'Una vez adquirido el paquete de horas, tu asesor de Universa se pondrá en contacto contigo para coordinar el horario de tus sesiones de acuerdo a tu disponibilidad.',
      category: 'general',
    },
    {
      question: '¿Puedo cancelar o reprogramar una sesión?',
      answer: 'Sí, puedes reprogramar tus sesiones con un mínimo de 24 horas de anticipación directamente con tu profesor asignado.',
      category: 'general',
    }
  ];

  const ids: string[] = [];

  for (const q of questions) {
    const existing = await doc('api::faq-item.faq-item').findMany({
      filters: { question: { $eq: q.question } },
      limit: 1,
    });

    if (existing.length > 0) {
      ids.push(existing[0].documentId);
    } else {
      const created = await doc('api::faq-item.faq-item').create({
        data: q,
        status: 'published',
      });
      ids.push(created.documentId);
    }
  }

  return ids;
}

const CONTENT_VERSION = 'program-content-no-promo-v6';
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
  const faqIds = await ensureSesionesOnDemandFaqs(strapi);
  const pageData = getSesionesOnDemandPrivadoPageData(faqIds);

  const existing = await doc('api::page.page').findMany({
    filters: { slug: { $eq: SLUG } },
    limit: 1,
  });

  if (existing.length > 0) {
    const { documentId } = existing[0];
    await doc('api::page.page').delete({
      documentId,
    });
    strapi.log.info(`[sesiones-on-demand-privado] Existing page deleted (${documentId}).`);
  }

  const created = await doc('api::page.page').create({
    data: pageData,
    status: 'published',
  });
  strapi.log.info(`[sesiones-on-demand-privado] Page created (${created.documentId}).`);
  await store.set({ key: VERSION_STORE_KEY, value: CONTENT_VERSION });
  return created.documentId;
}
