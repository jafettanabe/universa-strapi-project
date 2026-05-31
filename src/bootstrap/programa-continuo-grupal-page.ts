import type { Core } from '@strapi/strapi';

const SLUG = 'programa-continuo-grupal';

/** Strapi stores Rich Text (Blocks) as a JSON string in the database layer. */
export const rt = (...lines: string[]) =>
  JSON.stringify(
    lines.map((text) => ({
      type: 'paragraph',
      children: [{ type: 'text', text }],
    })),
  );

export function getProgramaContinuoGrupalPageData() {
  return {
    title: 'Programa Continuo Grupal',
    slug: SLUG,
    pageType: 'landing' as const,
    excerpt: 'Clases de inglés en tiempo real con grupos pequeños de 5 a 8 personas.',
    showInNavigation: true,
    navigationLabel: 'Programa Continuo Grupal',
    sections: [
      {
        __component: 'blocks.hero',
        eyebrow: 'Universa English Program · GROUP SESSIONS',
        title: 'Programa Continuo Grupal',
        subtitle:
          'Clases de inglés en tiempo real a través de videoconferencias en vivo. Interactúa con tu profesor y con tus compañeros viviendo el idioma con enfoque comunicativo.',
        variant: 'gradient_organic',
        alignment: 'left',
        audienceTags: [
          { label: 'Adolescentes', ageRange: '14 - 17 años' },
          { label: 'Adultos', ageRange: '18 - 49 años' },
          { label: 'Seniors', ageRange: '50+ años' },
        ],
        primaryCta: {
          label: 'Inscríbete ahora',
          url: '/contacto',
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
          'Un enfoque formativo y práctico en comunicación integral.',
        ),
        imagePosition: 'right',
      },
      {
        __component: 'blocks.feature-list',
        eyebrow: 'Características',
        title: 'Todo lo que incluye tu programa',
        subtitle:
          'Grupos pequeños de 5 a 8 personas · Todos los niveles desde Functional (A1) hasta Proficient (C1)',
        columns: 3,
        layout: 'standard',
        items: [
          {
            title: 'Grupos de 5 a 8 estudiantes',
            description: 'Atención personalizada en un entorno colaborativo y dinámico.',
            iconName: 'users',
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
            description: 'Simula conversaciones reales en inglés y pierde el miedo a hablar.',
            iconName: 'message-circle',
          },
          {
            title: 'Currículas acordes con el MCER',
            description: 'Estructura alineada al Marco Común Europeo de Referencia (A1 a C1/C2).',
            iconName: 'award',
          },
          {
            title: 'Course Advance',
            description:
              'Avance aproximadamente 2x más rápido que métodos tradicionales. Cada nivel ≈ 120 horas.',
            iconName: 'zap',
          },
          {
            title: 'Amplio rango horario',
            description: 'Clases desde las 7:00 am hasta las 11:00 pm (GMT-5), hora Perú.',
            iconName: 'clock',
          },
          {
            title: 'Enfoque comunicativo',
            description: 'Clases conversacionales y prácticas con estándares internacionales.',
            iconName: 'mic',
          },
        ],
      },
      {
        __component: 'blocks.stats',
        eyebrow: 'Niveles Universa',
        title: 'Aprende inglés 2x más rápido',
        subtitle: 'Nuestro Course Advance permite un avance aproximadamente el doble de veloz.',
        items: [
          { value: 'A1', label: 'Functional', description: 'Nivel inicial' },
          { value: 'A2-B1', label: 'Intermediate', description: 'Progresión media' },
          { value: 'B2', label: 'Upper Intermediate', description: 'Fluidez avanzada' },
          { value: 'C1', label: 'Proficient', description: 'Dominio del idioma' },
        ],
      },
      {
        __component: 'blocks.schedule-tabs',
        title: 'Estructura de Frecuencias Horarias',
        subtitle: 'Próximos inicios de clases — elige la intensidad que se adapte a tu ritmo.',
        footnote:
          '*Inicio de clases tentativo acorde a disponibilidad de cupos y apertura de grupos. Pregunta a tu asesor por nuevos horarios disponibles.',
        intensities: [
          {
            name: 'Superintensivo',
            tabKey: 'superintensivo',
            description: 'Avance acelerado con la mayor carga horaria semanal.',
            offerings: [
              {
                level: 'Básico',
                cycleLabel: 'Ciclo 02',
                days: 'Lunes, miércoles y viernes',
                frequency: 'Interdiario 2',
                weeklyHours: '9 horas',
                levelDuration: '3.5 meses',
                timeSlot: '07:00 pm a 10:00 pm',
                shift: 'nocturno',
                startDateLabel: '18 de Mayo',
              },
            ],
          },
          {
            name: 'Semi intensivo',
            tabKey: 'semiintensivo',
            description: 'Equilibrio entre ritmo y flexibilidad para avanzar de forma constante.',
            offerings: [
              {
                level: 'Básico',
                cycleLabel: 'Ciclo 02',
                days: 'Lunes, miércoles y viernes',
                frequency: 'Interdiario 6',
                weeklyHours: '4.5 horas',
                levelDuration: '7 meses',
                timeSlot: '07:30 pm a 09:00 pm',
                shift: 'nocturno',
                startDateLabel: '18 de Mayo',
              },
              {
                level: 'Pre-Intermedio',
                cycleLabel: 'Ciclo 03',
                days: 'Lunes, miércoles y viernes',
                frequency: 'Interdiario 6',
                weeklyHours: '4.5 horas',
                levelDuration: '7 meses',
                timeSlot: '08:00 pm a 09:30 pm',
                shift: 'nocturno',
                startDateLabel: '20 de Mayo',
              },
            ],
          },
        ],
      },
      {
        __component: 'blocks.pricing-section',
        eyebrow: 'Inversión',
        title: 'Elige la forma de pago que prefieras',
        subtitle: 'Beneficio Comunidad Universa — cupos limitados en el programa.',
        regularPriceAmount: 16000,
        regularPriceCurrency: 'PEN',
        financingBaseAmount: 12000,
        plans: [
          {
            planType: 'promo_2x1',
            title: 'Promoción 2x1',
            description: 'Aprende con un amigo — dos inscripciones al precio de una.',
            discountLabel: '2x1',
            isHighlighted: true,
            badgeText: 'CUPOS LIMITADOS',
            benefits: [
              { title: 'Conversation Club', description: 'Práctica guiada en grupos.' },
              { title: 'Reviewcamps', description: 'Sesiones de refuerzo intensivo.' },
              { title: 'Sesiones On Demand', description: 'Clases privadas por horas.' },
            ],
          },
          {
            planType: 'contado',
            title: 'Pago al contado',
            description: '50% de descuento pagando el monto total de una sola vez.',
            priceAmount: 8000,
            currency: 'PEN',
            discountLabel: '50%',
            isHighlighted: true,
            badgeText: 'MEJOR PRECIO',
            benefits: [
              {
                title: 'Válido para todas las frecuencias',
                description: 'Incluye Inmersivo, Superintensivo, Semiintensivo y Regular.',
              },
            ],
          },
          {
            planType: 'financiamiento',
            title: 'Financiamiento',
            description: '25% de descuento con pago en cuotas según la frecuencia elegida.',
            priceAmount: 12000,
            currency: 'PEN',
            discountLabel: '25%',
            benefits: [
              {
                title: 'Válido para todas las frecuencias',
                description: 'Excepto Inmersivo Fast.',
              },
              { title: 'Mensualidades', description: 'Intensivo, Semiintensivo y Regular.' },
            ],
          },
          {
            planType: 'regular',
            title: 'Precio regular',
            description: 'Inversión estándar por nivel completo.',
            priceAmount: 16000,
            currency: 'PEN',
            benefits: [
              {
                title: 'Nivel completo',
                description: 'Acceso a todas las sesiones y contenidos del nivel.',
              },
              {
                title: 'Grupos reducidos',
                description: 'Clases en vivo con profesor certificado.',
              },
              {
                title: 'Plataforma digital',
                description: 'Material y seguimiento incluidos en la matrícula.',
              },
            ],
          },
        ],
        financingRules: [
          {
            frequencyKey: 'superintensivo',
            frequencyLabel: 'Superintensivo',
            maxInstallments: 4,
            durationMonths: 3.5,
            notes:
              'El plazo máximo de cuotas es la duración del nivel (ej. 3.5 meses → hasta 4 cuotas).',
          },
          {
            frequencyKey: 'intensivo',
            frequencyLabel: 'Intensivo',
            maxInstallments: 4,
            durationMonths: 4,
          },
          {
            frequencyKey: 'semiintensivo',
            frequencyLabel: 'Semi intensivo',
            maxInstallments: 7,
            durationMonths: 7,
          },
          {
            frequencyKey: 'regular',
            frequencyLabel: 'Regular',
            maxInstallments: 12,
            durationMonths: 12,
          },
        ],
        paymentMethods: [
          {
            title: 'Transferencia bancaria',
            description: 'Transferencia e interbancaria.',
            iconName: 'landmark',
          },
          {
            title: 'Billetera digital',
            description: 'Yape, Plin y similares.',
            iconName: 'smartphone',
          },
          {
            title: 'Pasarela de pagos',
            description: 'Tarjetas débito/crédito nacionales e internacionales.',
            iconName: 'credit-card',
          },
        ],
        primaryCta: {
          label: 'Consultar con un asesor',
          url: '/contacto',
          style: 'primary',
        },
      },
      {
        __component: 'blocks.cta-banner',
        title: 'Un nuevo idioma, un universo de oportunidades',
        subtitle: 'Todos nuestros programas aplican Términos y Condiciones.',
        overlayStrength: 'medium',
        primaryCta: {
          label: 'Escríbenos',
          url: 'mailto:contacto@somosuniversa.com',
          style: 'primary',
        },
        secondaryCta: {
          label: 'WhatsApp +51 945 311 934',
          url: 'https://wa.me/51945311934',
          style: 'secondary',
        },
      },
    ],
    seo: {
      metaTitle: 'Programa Continuo Grupal | Universa',
      metaDescription:
        'Clases de inglés en tiempo real con grupos pequeños de 5 a 8 personas.',
    },
  };
}

/** Versión del contenido — incrementar al actualizar copy en código. */
const CONTENT_VERSION = 'program-content-no-promo-v5';
const VERSION_STORE_KEY = 'programa_grupal_content_version' as const;

/** Crea o actualiza la página /programa-continuo-grupal. */
export async function upsertProgramaContinuoGrupalPage(strapi: Core.Strapi) {
  const store = strapi.store({ type: 'plugin', name: 'universa' });
  const appliedVersion = await store.get({ key: VERSION_STORE_KEY });

  if (appliedVersion === CONTENT_VERSION) {
    strapi.log.info(
      `[programa-continuo-grupal] Content already at version ${CONTENT_VERSION}; skipping upsert.`,
    );
    return;
  }

  const doc = strapi.documents.bind(strapi);
  const pageData = getProgramaContinuoGrupalPageData();

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
    strapi.log.info(`[programa-continuo-grupal] Page updated (${documentId}).`);
    await store.set({ key: VERSION_STORE_KEY, value: CONTENT_VERSION });
    return documentId;
  }

  const created = await doc('api::page.page').create({
    data: pageData,
    status: 'published',
  });
  strapi.log.info(`[programa-continuo-grupal] Page created (${created.documentId}).`);
  await store.set({ key: VERSION_STORE_KEY, value: CONTENT_VERSION });
  return created.documentId;
}
