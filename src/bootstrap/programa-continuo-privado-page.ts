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

export function getProgramaContinuoPrivadoPageData(certificationIds: string[]) {
  return {
    title: 'Programa Continuo Privado',
    slug: SLUG,
    pageType: 'landing' as const,
    excerpt:
      'Clases 1 a 1 con tu profesor en tiempo real. Atención exclusiva, horarios flexibles y certificación internacional.',
    showInNavigation: true,
    navigationLabel: 'Programa Continuo Privado',
    sections: [
      {
        __component: 'blocks.hero',
        eyebrow: 'Universa English Program · 1 TO 1 SESSIONS',
        title: 'Programa Continuo Privado',
        subtitle:
          'Clases de inglés en tiempo real a través de videoconferencias en vivo. Interactúa directamente con tu profesor en un entorno 100% personalizado, con enfoque comunicativo y atención exclusiva.',
        variant: 'gradient_organic',
        alignment: 'left',
        audienceTags: [
          { label: 'Adolescentes', ageRange: '14 - 17 años' },
          { label: 'Adultos', ageRange: '18 - 49 años' },
          { label: 'Seniors', ageRange: '50+ años' },
        ],
        primaryCta: {
          label: 'Cotizar con un asesor',
          url: '#cotizar',
          style: 'primary',
        },
      },
      {
        __component: 'blocks.text-image',
        eyebrow: 'Descripción',
        title: '¿Qué desarrollamos con el Programa?',
        body: rt(
          'Desarrollo de habilidades lingüísticas fundamentales: expresión oral, expresión escrita, comprensión auditiva y comprensión lectora.',
          'Competencias que perfeccionan el uso del lenguaje: gramatical, léxica, pragmática, discursiva y fonética.',
          'Un enfoque formativo y práctico en comunicación integral, adaptado 100% a tus objetivos.',
        ),
        imagePosition: 'right',
      },
      {
        __component: 'blocks.feature-list',
        eyebrow: 'Exclusividad Universa',
        title: 'Características del programa privado',
        subtitle:
          '1 to 1 con el profesor · Todos los niveles desde Functional (A1) hasta Proficient (C1)',
        columns: 3,
        layout: 'standard',
        items: [
          {
            title: 'Clases 1 to 1 con el profesor',
            description:
              'Atención 100% exclusiva con un docente dedicado a tu ritmo, objetivos y estilo de aprendizaje.',
            iconName: 'user-check',
          },
          {
            title: 'Horarios flexibles',
            description:
              'Horarios preestablecidos, programables y/o reprogramables según tu disponibilidad.',
            iconName: 'calendar-clock',
          },
          {
            title: 'SFA: Study From Anywhere',
            description: 'Estudia desde cualquier parte del mundo con laptop e internet.',
            iconName: 'globe',
          },
          {
            title: 'Material National Geographic Learning',
            description: 'Material online y físico con envíos a nivel nacional (Perú) y online mundial.',
            iconName: 'book-open',
          },
          {
            title: 'Plataforma Online Practice Spark',
            description: 'Plataforma interactiva de National Geographic Learning.',
            iconName: 'laptop',
          },
          {
            title: 'Conversation Clubs Universa',
            description: 'Practica conversaciones reales en inglés y gana confianza al hablar.',
            iconName: 'message-circle',
          },
          {
            title: 'Course Advance',
            description:
              'Avance hasta 2x más rápido que métodos tradicionales. Cada nivel ≈ 120 horas cronológicas.',
            iconName: 'zap',
          },
          {
            title: 'Currículas acordes con el MCER',
            description: 'Alineación internacional con el Marco Común Europeo (A1 a C1/C2).',
            iconName: 'award',
          },
          {
            title: 'Amplio rango horario',
            description: 'Clases desde las 7:00 am hasta las 11:00 pm (GMT-5), hora Perú.',
            iconName: 'clock',
          },
        ],
      },
      {
        __component: 'blocks.stats',
        eyebrow: 'Niveles Universa',
        title: 'Aprende inglés 2x más rápido',
        subtitle:
          'Programas de Regular a Superintensivo con avance acelerado mediante nuestro Course Advance.',
        items: [
          { value: 'A1', label: 'Functional', description: 'Nivel inicial' },
          { value: 'A2-B1', label: 'Intermediate', description: 'Progresión media' },
          { value: 'B2', label: 'Upper Intermediate', description: 'Fluidez avanzada' },
          { value: 'C1', label: 'Proficient', description: 'Dominio del idioma' },
        ],
      },
      {
        __component: 'blocks.quote',
        eyebrow: 'Flexibilidad total',
        quote:
          'Horarios preestablecidos, programables y/o reprogramables. Válido también para Programa Continuo Grupal.',
        attribution: 'Programa Continuo Privado · Universa',
      },
      {
        __component: 'blocks.certifications',
        eyebrow: 'Certificaciones',
        title: 'Hasta doble certificación internacional',
        subtitle: '+ certificación de finalización Universa',
        body: 'Ten opción de obtener hasta doble certificación internacional más tu certificado de completion al finalizar tu nivel.',
        layout: 'badges',
        certifications: { set: certificationIds },
        primaryCta: {
          label: 'Consultar requisitos',
          url: '#cotizar',
          style: 'primary',
        },
      },
      {
        __component: 'blocks.contact-form',
        eyebrow: 'Inversión',
        title: 'Solicita información de inversión con tu asesor',
        subtitle:
          'Cada plan privado se cotiza según tu nivel, frecuencia y objetivos. Déjanos tus datos y un asesor Universa te contactará con una propuesta personalizada.',
        variant: 'advisor',
        successMessage:
          'Gracias. Un asesor Universa te contactará pronto con la información de inversión.',
        subjectOptions: [
          { value: 'programa-continuo-privado', label: 'Programa Continuo Privado' },
          { value: 'horarios-flexibles', label: 'Horarios flexibles' },
          { value: 'certificaciones', label: 'Certificaciones internacionales' },
        ],
      },
      {
        __component: 'blocks.cta-banner',
        title: 'Tu inglés, a tu ritmo, con un profesor solo para ti',
        subtitle: 'Solicita tu cotización personalizada hoy.',
        overlayStrength: 'medium',
        primaryCta: {
          label: 'WhatsApp +51 945 311 934',
          url: 'https://wa.me/51945311934',
          style: 'primary',
        },
        secondaryCta: {
          label: 'Escríbenos',
          url: 'mailto:contacto@somosuniversa.com',
          style: 'secondary',
        },
      },
    ],
    seo: {
      metaTitle: 'Programa Continuo Privado | Universa',
      metaDescription:
        'Clases 1 a 1 en vivo con horarios flexibles, Course Advance y opción de doble certificación internacional.',
    },
  };
}

const CONTENT_VERSION = 'program-content-no-promo-v3';
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

  const doc = strapi.documents.bind(strapi);
  const certificationIds = await ensurePrivadoCertifications(strapi);
  const pageData = getProgramaContinuoPrivadoPageData(certificationIds);

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
