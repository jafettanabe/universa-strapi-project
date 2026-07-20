import type { Core } from '@strapi/strapi';

import {
  getProgramaContinuoGrupalPageData,
  rt,
  upsertProgramaContinuoGrupalPage,
} from './programa-continuo-grupal-page';
import { PROGRAMAS_NAV_CHILDREN } from './header-programas-nav';
import { buildProgramasPageSections } from './programas-page';

export { upsertProgramaContinuoGrupalPage };

const SEED_STORE_TYPE = 'plugin' as const;
const SEED_STORE_NAME = 'universa' as const;
const SEED_KEY = 'bootstrap_seed_v1' as const;

export async function runUniversaSeed(strapi: Core.Strapi) {
  const store = strapi.store({ type: SEED_STORE_TYPE, name: SEED_STORE_NAME });
  const already = await store.get({ key: SEED_KEY });
  if (already) {
    strapi.log.info('[universa-seed] Skipping: seed already applied (reset DB or clear plugin store key universa / bootstrap_seed_v1 to re-run).');
    return;
  }

  strapi.log.info('[universa-seed] Applying initial content…');

  const doc = strapi.documents.bind(strapi);

  const programAdultos = await doc('api::program.program').create({
    data: {
      title: 'Universa Adultos',
      slug: 'universa-adultos',
      shortDescription:
        'Inglés para adultos con enfoque comunicativo, flexible y adaptado a tus objetivos, ritmo y contexto.',
      longDescription: rt(
        'Programa pensado para quienes buscan avanzar con acompañamiento cercano, práctica real y rutas claras de progreso.',
        'Incluye conversación guiada, materiales de National Geographic Learning y práctica en nuestra plataforma Spark.'
      ),
      programType: 'adultos',
      modality: 'online',
      durationText: 'Según plan y nivel',
      scheduleText: 'Horarios flexibles (según grupo / modalidad)',
      classSizeText: 'Grupos reducidos',
      ctaLabel: 'Agendar asesoría',
      ctaUrl: '/contacto',
      isFeatured: true,
      displayOrder: 10,
      benefits: [
        {
          title: 'Enfoque comunicativo',
          description: 'Priorizamos hablar, escuchar y usar el idioma en contextos reales.',
          iconName: 'message-circle',
        },
        {
          title: 'Acompañamiento 1:1',
          description: 'Seguimiento personalizado para sostener hábitos y resolver dudas.',
          iconName: 'user-check',
        },
        {
          title: 'Study from anywhere',
          description: 'Aprende online con una experiencia estructurada y humana.',
          iconName: 'globe',
        },
      ],
      features: [
        {
          title: 'Conversation clubs',
          description: 'Espacios para practicar fluidez con otros estudiantes.',
          iconName: 'users',
        },
        {
          title: 'Support partner',
          description: 'Acompañamiento para resolver fricciones y mantener constancia.',
          iconName: 'life-buoy',
        },
      ],
    },
    status: 'published',
  });

  const programJuniors = await doc('api::program.program').create({
    data: {
      title: 'Universa Juniors',
      slug: 'universa-juniors',
      shortDescription:
        'Inglés para niños y adolescentes con metodología activa, seguimiento y motivación constante.',
      longDescription: rt(
        'Progresión por etapas, actividades dinámicas y foco en confianza al hablar.',
        'Integra práctica digital responsable y conversación en grupos afines.'
      ),
      programType: 'juniors',
      modality: 'online',
      ageRange: 'Niños y adolescentes',
      durationText: 'Por nivel',
      scheduleText: 'Según grupo',
      classSizeText: 'Grupos reducidos',
      ctaLabel: 'Conocer el programa',
      ctaUrl: '/contacto',
      isFeatured: true,
      displayOrder: 20,
      benefits: [
        {
          title: 'Aprendizaje activo',
          description: 'Clases participativas con énfasis en uso real del idioma.',
          iconName: 'sparkles',
        },
        {
          title: 'Seguimiento cercano',
          description: 'Comunicación con familias y ajustes según ritmo.',
          iconName: 'heart-handshake',
        },
      ],
      features: [
        {
          title: 'Clubes y retos',
          description: 'Dinámicas para practicar fuera de clase con guía.',
          iconName: 'trophy',
        },
      ],
    },
    status: 'published',
  });

  const programEmpresas = await doc('api::program.program').create({
    data: {
      title: 'Universa Empresas',
      slug: 'universa-empresas',
      shortDescription:
        'Capacitación en inglés para equipos: diagnóstico, rutas por rol y medición de avance.',
      longDescription: rt(
        'Diseñamos itinerarios por objetivos de negocio: reuniones, presentaciones, email y trabajo remoto.',
        'Modalidades online, presencial o híbrido según necesidad operativa.'
      ),
      programType: 'empresas',
      modality: 'hibrido',
      durationText: 'Por proyecto',
      scheduleText: 'A convenir',
      classSizeText: 'Grupos corporativos',
      ctaLabel: 'Hablar con un asesor',
      ctaUrl: '/contacto',
      isFeatured: true,
      displayOrder: 30,
      benefits: [
        {
          title: 'Alineación a objetivos',
          description: 'Contenidos y KPIs de práctica acordes a tu operación.',
          iconName: 'target',
        },
        {
          title: 'Escalabilidad',
          description: 'Estructura para crecer por equipos y sedes.',
          iconName: 'building-2',
        },
      ],
      features: [
        {
          title: 'Reporting',
          description: 'Seguimiento de asistencia, desempeño y próximos pasos.',
          iconName: 'line-chart',
        },
      ],
    },
    status: 'published',
  });

  const certCambridge = await doc('api::certification.certification').create({
    data: {
      name: 'Cambridge English Qualifications',
      slug: 'cambridge-english-qualifications',
      description:
        'Certificaciones reconocidas internacionalmente para validar nivel y progreso con estándares globales.',
      issuer: 'Cambridge University Press & Assessment',
      externalUrl: 'https://www.cambridgeenglish.org/',
    },
    status: 'published',
  });

  const certTrinity = await doc('api::certification.certification').create({
    data: {
      name: 'Trinity College London',
      slug: 'trinity-college-london',
      description:
        'Evaluación oral y comunicativa para evidenciar competencias reales de speaking y listening.',
      issuer: 'Trinity College London',
      externalUrl: 'https://www.trinitycollege.com/',
    },
    status: 'published',
  });

  await doc('api::certification.certification').update({
    documentId: certCambridge.documentId,
    data: {
      programs: {
        set: [programAdultos.documentId, programJuniors.documentId],
      },
    },
    status: 'published',
  });

  await doc('api::certification.certification').update({
    documentId: certTrinity.documentId,
    data: {
      programs: {
        set: [programAdultos.documentId],
      },
    },
    status: 'published',
  });

  const faq1 = await doc('api::faq-item.faq-item').create({
    data: {
      question: '¿Las clases son 100% online?',
      answer: rt(
        'Sí, puedes estudiar online con una experiencia guiada. También tenemos alternativas presenciales/híbridas según programa y sede/disponibilidad.'
      ),
      category: 'general',
      displayOrder: 10,
      featured: true,
    },
    status: 'published',
  });

  const faq2 = await doc('api::faq-item.faq-item').create({
    data: {
      question: '¿Qué materiales utilizan?',
      answer: rt(
        'Trabajamos con materiales de National Geographic Learning y práctica estructurada en nuestra plataforma Spark.'
      ),
      category: 'metodologia',
      displayOrder: 20,
      featured: true,
    },
    status: 'published',
  });

  const faq3 = await doc('api::faq-item.faq-item').create({
    data: {
      question: '¿Cómo sé qué programa me conviene?',
      answer: rt(
        'Te recomendamos una asesoría corta para entender tu nivel, objetivos y disponibilidad. También puedes guiarte con el test de recomendación en la web.'
      ),
      category: 'programas',
      displayOrder: 30,
      featured: false,
    },
    status: 'published',
  });

  const faq4 = await doc('api::faq-item.faq-item').create({
    data: {
      question: '¿Puedo certificarme?',
      answer: rt(
        'Sí. Acompañamos rutas hacia certificaciones con validez internacional, según tu meta y cronograma.'
      ),
      category: 'certificacion',
      displayOrder: 40,
      featured: false,
    },
    status: 'published',
  });

  const faq5 = await doc('api::faq-item.faq-item').create({
    data: {
      question: '¿Universa Empresas incluye reportes para RR.HH.?',
      answer: rt(
        'Podemos estructurar seguimiento por cohorte/equipo con indicadores operativos acordados (según alcance del proyecto).'
      ),
      category: 'empresas',
      displayOrder: 50,
      featured: false,
    },
    status: 'published',
  });

  for (const f of [faq1, faq2, faq3, faq4, faq5]) {
    await doc('api::faq-item.faq-item').update({
      documentId: f.documentId,
      data: {
        relatedPrograms: {
          connect: [programAdultos.documentId, programEmpresas.documentId],
        },
      },
      status: 'published',
    });
  }

  const testimonial = await doc('api::testimonial.testimonial').create({
    data: {
      name: 'Mariana G.',
      role: 'Estudiante Universa Adultos',
      location: 'Latinoamérica',
      quote:
        'Pasé de “entiendo pero no me animo” a sostener reuniones en inglés. El acompañamiento y la práctica constante marcaron la diferencia.',
      featured: true,
      rating: 5,
    },
    status: 'published',
  });

  await doc('api::testimonial.testimonial').update({
    documentId: testimonial.documentId,
    data: {
      relatedPrograms: {
        connect: [programAdultos.documentId],
      },
    },
    status: 'published',
  });

  await doc('api::impact-initiative.impact-initiative').create({
    data: {
      title: 'Impacto Universa: becas y comunidad',
      slug: 'impacto-universa-becas',
      summary:
        'Iniciativas para ampliar oportunidades de aprendizaje y conectar talento con propósito.',
      description: rt(
        'Alineamos aprendizaje de idiomas con impacto social: mentorías, alianzas y proyectos colaborativos.',
        'Esta entrada es representativa; puedes sustituirla por iniciativas reales publicadas en el sitio.'
      ),
      ctaLabel: 'Ver Impacto Universa',
      ctaUrl: '/impacto-universa',
      featured: true,
    },
    status: 'published',
  });

  await doc('api::community-opportunity.community-opportunity').create({
    data: {
      title: 'Comunidad Universa: conecta y practica',
      slug: 'comunidad-universa',
      summary: 'Conversation clubs, eventos y espacios para practicar con otros estudiantes.',
      description: rt(
        'La comunidad refuerza hábitos: encuentros guiados, retos semanales y networking con propósito.'
      ),
      ctaLabel: 'Explorar comunidad',
      ctaUrl: '/comunidad-universa',
      featured: true,
    },
    status: 'published',
  });

  await doc('api::job-opening.job-opening').create({
    data: {
      title: 'Academic Coach (Inglés)',
      slug: 'academic-coach-ingles',
      department: 'Académico',
      modality: 'remoto',
      location: 'LATAM (según país)',
      description: rt(
        'Buscamos personas obsesionadas con el progreso real de los estudiantes: feedback accionable, empatía y excelencia operativa.'
      ),
      requirements: rt(
        'Inglés avanzado, experiencia en enseñanza o acompañamiento educativo, y cultura de trabajo remota.'
      ),
      applyUrl: '/contacto',
      isActive: true,
    },
    status: 'published',
  });

  await doc('api::site-settings.site-setting').create({
    data: {
      siteName: 'Universa',
      siteTagline: 'Aprende inglés. Transforma tu futuro.',
      siteDescription:
        'Somos un ecosistema de aprendizaje de inglés: programas para adultos, juniors y empresas, con metodología comunicativa, acompañamiento humano y tecnología a tu servicio.',
      contactEmail: 'hola@somosuniversa.com',
      contactPhone: '+57 (1) 000 0000',
      whatsappNumber: '+573000000000',
      address: 'Colombia / Online',
      socialLinks: [
        { platform: 'instagram', label: 'Instagram', url: 'https://instagram.com/' },
        { platform: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/' },
        { platform: 'youtube', label: 'YouTube', url: 'https://www.youtube.com/' },
      ],
      defaultSeo: {
        metaTitle: 'Universa | Aprende inglés. Transforma tu futuro.',
        metaDescription:
          'Programas de inglés para adultos, juniors y empresas. Metodología comunicativa, materiales National Geographic Learning y plataforma Spark.',
        noIndex: false,
      },
      announcementBarEnabled: false,
      announcementBarText: '',
    },
    status: 'published',
  });

  await doc('api::header.header').create({
    data: {
      primaryNavigation: [
        { label: 'Inicio', url: '/', openInNewTab: false },
        { label: 'Nosotros', url: '/nosotros', openInNewTab: false },
        { label: 'Metodología', url: '/metodologia', openInNewTab: false },
        {
          label: 'Programas',
          url: '/programas',
          openInNewTab: false,
          children: [...PROGRAMAS_NAV_CHILDREN],
        },
        { label: 'Idiomas', url: '/idiomas', openInNewTab: false },
        { label: 'Comunidad Universa', url: '/comunidad-universa', openInNewTab: false },
        { label: 'Impacto Universa', url: '/impacto-universa', openInNewTab: false },
        { label: 'Blog', url: '/blog', openInNewTab: false },
        { label: 'Clases Programadas', url: '/clases', openInNewTab: false },
        { label: 'FAQs', url: '/faqs', openInNewTab: false },
        { label: 'Noticias', url: '/noticias', openInNewTab: false },
        { label: 'Contacto', url: '/contacto', openInNewTab: false },
      ],
      ctaLabel: 'Agendar asesoría',
      ctaUrl: '/contacto',
      secondaryLinkLabel: 'Recomiéndame un programa',
      secondaryLinkUrl: '/#recomendacion',
    },
    status: 'published',
  });

  await doc('api::footer.footer').create({
    data: {
      footerNavigation: [
        { label: 'Nosotros', url: '/nosotros', openInNewTab: false },
        { label: 'Metodología', url: '/metodologia', openInNewTab: false },
        {
          label: 'Programas',
          url: '/programas',
          openInNewTab: false,
          children: [...PROGRAMAS_NAV_CHILDREN],
        },
        { label: 'Blog', url: '/blog', openInNewTab: false },
        { label: 'Contacto', url: '/contacto', openInNewTab: false },
      ],
      legalLinks: [
        { label: 'Política de Privacidad', url: '/privacidad', openInNewTab: false },
        { label: 'Términos y Condiciones', url: '/terminos', openInNewTab: false },
      ],
      socialLinks: [
        { platform: 'instagram', label: 'Instagram', url: 'https://instagram.com/' },
        { platform: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/' },
        { platform: 'whatsapp', label: 'WhatsApp', url: 'https://wa.me/' },
      ],
      copyrightText: `© ${new Date().getFullYear()} Universa. Todos los derechos reservados.`,
      contactBlockTitle: 'Hablemos',
      contactBlockText: 'Escríbenos y te ayudamos a elegir el mejor camino para tu objetivo.',
    },
    status: 'published',
  });

  await doc('api::homepage.homepage').create({
    data: {
      title: 'Universa — Inicio',
      slug: 'home',
      seo: {
        metaTitle: 'Universa | Aprende inglés. Transforma tu futuro.',
        metaDescription:
          'Programas para adultos, juniors y empresas. Ecosistema Aprende / Conecta / Impacta. Metodología comunicativa y plataforma Spark.',
        noIndex: false,
      },
      sections: [
        {
          __component: 'blocks.hero-carousel',
          autoplayMs: 6000,
          slides: [
            {
              title: 'Aprende inglés online con el programa hecho para ti',
              subtitle:
                'En Universa no creemos en "un programa para todos". Diseñamos siete formas distintas de aprender inglés, para que elijas la que se ajusta a tu ritmo, tu presupuesto y tus objetivos, con el respaldo de National Geographic Learning y certificación British Council.',
              textTone: 'dark',
              primaryCta: { label: 'Descubre tu programa ideal →', url: '/programas', style: 'primary' },
              secondaryCta: { label: 'Hacer mi Placement Test →', url: '/test', style: 'secondary' },
            },
            {
              title: 'Aprende inglés. Transforma tu futuro.',
              subtitle: 'Programas que se adaptan al ritmo, objetivos y contexto de cada estudiante.',
              textTone: 'dark',
              pillLabel: 'Hablemos',
              pillCta: { label: 'Habla con un asesor', url: '/contacto', style: 'secondary' },
            },
          ],
        },
        {
          __component: 'blocks.text-image',
          eyebrow: 'Conócenos',
          title: 'Un equipo obsesionado con tu progreso',
          imagePosition: 'right',
          body: rt(
            'En Universa creemos que aprender inglés es una habilidad estratégica: abre trabajo, estudios, cultura y confianza.',
            'Combinamos método, comunidad y acompañamiento para que avances con constancia — no solo con “clases sueltas”.'
          ),
          cta: { label: 'Saber más', url: '/nosotros', style: 'ghost' },
        },
        {
          __component: 'blocks.card-grid',
          eyebrow: 'Recomendación',
          title: '¿No sabes por dónde empezar?',
          subtitle: 'Haz el test rápido y te sugerimos un programa inicial según tu nivel y objetivo.',
          items: [
            {
              title: 'Test: programa ideal',
              description: '2–3 minutos. Sin compromiso.',
              ctaLabel: 'Hacer el test',
              ctaUrl: '/#recomendacion',
            },
            {
              title: 'Agendar asesoría',
              description: 'Habla con un asesor y define tu ruta.',
              ctaLabel: 'Agendar',
              ctaUrl: '/contacto',
            },
          ],
        },
        {
          __component: 'blocks.program-highlights',
          eyebrow: 'Programas principales',
          title: 'Elige tu camino',
          subtitle: 'Tres propuestas claras para distintas etapas y contextos.',
          programs: {
            set: [programAdultos.documentId, programJuniors.documentId, programEmpresas.documentId],
          },
        },
        {
          __component: 'blocks.feature-list',
          eyebrow: 'Por qué Universa',
          title: 'Diseñado para resultados reales',
          subtitle: 'Lo que nos diferencia no es “más contenido”, sino mejor práctica y mejor acompañamiento.',
          columns: 3,
          items: [
            {
              title: 'Metodología comunicativa',
              description: 'Menos teoría abstracta y más uso del idioma desde el día uno.',
              iconName: 'message-square',
            },
            {
              title: 'Certificaciones con proyección',
              description: 'Rutas hacia certificaciones reconocidas internacionalmente.',
              iconName: 'badge-check',
            },
            {
              title: 'Materiales premium',
              description: 'National Geographic Learning como base de aprendizaje significativo.',
              iconName: 'book-open',
            },
            {
              title: 'Plataforma Spark',
              description: 'Práctica estructurada, seguimiento y recursos en un solo lugar.',
              iconName: 'monitor',
            },
            {
              title: 'Comunidad y clubes',
              description: 'Conversation clubs y dinámicas para ganar fluidez.',
              iconName: 'users',
            },
          ],
        },
        {
          __component: 'blocks.rich-text',
          eyebrow: 'Método',
          title: 'Aprender haciendo — con guía experta',
          content: rt(
            'Tu progreso se construye con micro-hábitos: speaking guiado, feedback accionable y retos semanales.',
            'Medimos avance con criterios claros para que siempre sepas “qué sigue” y por qué.'
          ),
        },
        {
          __component: 'blocks.ecosystem',
          eyebrow: 'Ecosistema Universa',
          title: 'Aprende · Conecta · Impacta',
          subtitle: 'Un ciclo que convierte el inglés en una ventaja sostenible.',
          items: [
            {
              phase: 'Aprende',
              title: 'Domina el idioma con método',
              description: 'Rutas por nivel, práctica constante y recursos de clase mundial.',
            },
            {
              phase: 'Conecta',
              title: 'Ponlo a prueba en la vida real',
              description: 'Comunidad, clubes y desafíos para ganar confianza.',
            },
            {
              phase: 'Impacta',
              title: 'Multiplica oportunidades',
              description: 'Mejor empleabilidad, estudios y relaciones globales.',
            },
          ],
        },
        {
          __component: 'blocks.feature-list',
          eyebrow: 'Servicio',
          title: 'Todo lo que necesitas para avanzar',
          subtitle: 'Un stack completo para aprender, practicar y sostenerte en el tiempo.',
          columns: 2,
          items: [
            {
              title: 'Acompañamiento cercano',
              description: 'Humanos + procesos: para que no te quedes solo/a en el camino.',
              iconName: 'handshake',
            },
            {
              title: 'Evaluación y claridad',
              description: 'Sabrás en qué estás fuerte y qué entrenar próximo.',
              iconName: 'clipboard-check',
            },
          ],
        },
        {
          __component: 'blocks.text-image',
          eyebrow: 'Materiales y plataforma',
          title: 'National Geographic Learning + Spark',
          imagePosition: 'left',
          body: rt(
            'Materiales que conectan cultura, curiosidad y lenguaje — con progresión pedagógica sólida.',
            'Spark concentra tu práctica, tareas y seguimiento para que estudies con claridad (aunque tu calendario sea exigente).'
          ),
          cta: { label: 'Ver programas', url: '/programas', style: 'primary' },
        },
        {
          __component: 'blocks.testimonials',
          eyebrow: 'Testimonios',
          title: 'Historias de transformación',
          subtitle: 'Resultados de personas que decidieron invertir en su futuro.',
          testimonials: {
            set: [testimonial.documentId],
          },
        },
        {
          __component: 'blocks.text-image',
          eyebrow: 'Cultura',
          title: 'Aprender en serio, sin perder lo humano',
          imagePosition: 'right',
          body: rt(
            'Cuidamos la experiencia: feedback honesto, motivación realista y un ambiente donde equivocarse es parte del proceso.'
          ),
          cta: { label: 'Trabaja con nosotros', url: '/trabaja-con-nosotros', style: 'secondary' },
        },
        {
          __component: 'blocks.step-list',
          eyebrow: 'Proceso',
          title: 'Así empezamos juntos',
          subtitle: 'Pasos típicos del journey comercial (ajústalos a tu operación real).',
          steps: [
            { stepNumber: '01', title: 'Diagnóstico rápido', description: 'Nivel, objetivos y disponibilidad.' },
            { stepNumber: '02', title: 'Recomendación', description: 'Te proponemos programa, ritmo y plan.' },
            { stepNumber: '03', title: 'Onboarding', description: 'Accesos, materiales y primeras metas.' },
            { stepNumber: '04', title: 'Acompañamiento', description: 'Práctica semanal + seguimiento.' },
          ],
        },
        {
          __component: 'blocks.contact-form',
          eyebrow: 'Contacto',
          title: 'Cuéntanos tu objetivo',
          subtitle: 'Te respondemos con una recomendación clara y próximos pasos.',
          successMessage: '¡Listo! Revisaremos tu mensaje y te contactaremos pronto.',
          subjectOptions: [
            { value: 'general', label: 'Consulta general' },
            { value: 'programas', label: 'Programas (Adultos / Juniors)' },
            { value: 'empresas', label: 'Universa Empresas' },
            { value: 'certificaciones', label: 'Certificaciones' },
            { value: 'otro', label: 'Otro' },
          ],
        },
        {
          __component: 'blocks.faq',
          eyebrow: 'FAQs',
          title: 'Preguntas frecuentes',
          subtitle: 'Lo esencial antes de empezar.',
          faqItems: {
            set: [faq1.documentId, faq2.documentId, faq3.documentId, faq4.documentId, faq5.documentId],
          },
        },
      ],
    },
    status: 'published',
  });

  const languageEnglish = await doc('api::language.language').create({
    data: {
      name: 'Inglés',
      slug: 'ingles',
      description: 'Idioma principal de los programas Universa.',
    },
    status: 'published',
  });

  await doc('api::language.language').update({
    documentId: languageEnglish.documentId,
    data: {
      programs: {
        set: [programAdultos.documentId, programJuniors.documentId, programEmpresas.documentId],
      },
    },
    status: 'published',
  });

  await doc('api::blog-post.blog-post').create({
    data: {
      title: 'Cómo mantener constancia al aprender inglés',
      slug: 'constancia-aprender-ingles',
      excerpt: 'Una guía práctica para sostener hábitos con trabajo, estudio y vida personal.',
      content: rt(
        'La constancia no depende de la motivación diaria: depende de un sistema simple que te acompañe semana a semana.',
        'En Universa proponemos metas cortas, feedback frecuente y práctica con propósito.'
      ),
      authorName: 'Equipo Universa',
      category: 'Metodología',
      tags: ['ingles', 'habitos', 'metodologia'],
      featured: true,
      seo: {
        metaTitle: 'Constancia para aprender inglés | Universa',
        metaDescription: 'Estrategias para mantener el avance en inglés con una rutina sostenible.',
      },
    },
    status: 'published',
  });

  await doc('api::blog-post.blog-post').create({
    data: {
      title: 'Conversation Clubs: por qué aceleran tu speaking',
      slug: 'conversation-clubs-speaking',
      excerpt: 'Practicar en comunidad reduce el miedo y acelera la fluidez.',
      content: rt(
        'Los clubes de conversación crean contexto real, ritmo y confianza para participar.',
        'La práctica social complementa el trabajo técnico de clase.'
      ),
      authorName: 'Academic Team',
      category: 'Comunidad',
      tags: ['speaking', 'comunidad', 'conversation-clubs'],
      featured: false,
    },
    status: 'published',
  });

  await doc('api::news-article.news-article').create({
    data: {
      title: 'Universa lanza nuevos espacios de práctica guiada',
      slug: 'nuevos-espacios-practica-guiada',
      excerpt: 'Se amplía la oferta de espacios para fortalecer fluidez y seguimiento.',
      content: rt(
        'Los nuevos espacios combinan conversación, retroalimentación y objetivos por sesión.',
        'La iniciativa busca mejorar la retención y los resultados medibles de speaking.'
      ),
      publishedDate: '2026-03-20',
      featured: true,
      seo: {
        metaTitle: 'Nuevos espacios de práctica | Universa',
        metaDescription: 'Noticias sobre la expansión de experiencias de práctica guiada.',
      },
    },
    status: 'published',
  });

  await doc('api::news-article.news-article').create({
    data: {
      title: 'Alianzas para certificaciones con validez internacional',
      slug: 'alianzas-certificaciones-internacionales',
      excerpt: 'Universa fortalece rutas de certificación para estudiantes y equipos.',
      content: rt(
        'Las alianzas amplían opciones de certificación para distintos perfiles y objetivos.',
        'Los planes se integran con acompañamiento académico y de preparación.'
      ),
      publishedDate: '2026-02-10',
      featured: false,
    },
    status: 'published',
  });

  const basePages = [
    {
      title: 'Nosotros',
      slug: 'nosotros',
      pageType: 'institutional' as const,
      excerpt: 'Conoce el propósito, equipo y enfoque de Universa.',
      showInNavigation: true,
      navigationLabel: 'Nosotros',
      hero: {
        eyebrow: 'Quiénes somos',
        title: 'Somos Universa',
        subtitle: 'Aprendizaje de inglés con enfoque humano, comunicativo y orientado a resultados reales.',
        alignment: 'left',
      },
      sections: [
        {
          __component: 'blocks.rich-text',
          title: 'Nuestra misión',
          content: rt(
            'Acompañar procesos de transformación personal y profesional a través del inglés.',
            'Creemos en experiencias exigentes, cercanas y sostenibles.'
          ),
        },
        {
          __component: 'blocks.stats',
          title: 'Universa en cifras',
          items: [
            { value: '+10', label: 'Años en educación', description: 'Experiencia acumulada en formación.' },
            { value: '+1000', label: 'Estudiantes acompañados', description: 'En distintos perfiles y contextos.' },
            { value: '95%', label: 'Satisfacción', description: 'Promedio de experiencia reportada.' },
          ],
        },
      ],
    },
    {
      title: 'Metodología',
      slug: 'metodologia',
      pageType: 'institutional' as const,
      excerpt: 'Cómo enseñamos y por qué funciona.',
      showInNavigation: true,
      navigationLabel: 'Metodología',
      sections: [
        {
          __component: 'blocks.feature-list',
          title: 'Pilares metodológicos',
          columns: 3,
          items: [
            { title: 'Enfoque comunicativo', description: 'Uso real del idioma desde etapas tempranas.' },
            { title: 'Aprendizaje activo', description: 'Participación, práctica y feedback continuo.' },
            { title: 'Seguimiento personalizado', description: 'Ritmo y recomendaciones según progreso.' },
          ],
        },
      ],
    },
    {
      title: 'Programas',
      slug: 'programas',
      pageType: 'landing' as const,
      excerpt: 'Explora nuestras rutas de aprendizaje.',
      showInNavigation: true,
      navigationLabel: 'Programas',
      sections: buildProgramasPageSections([
        programAdultos.documentId,
        programJuniors.documentId,
        programEmpresas.documentId,
      ]),
    },
    {
      title: 'Adultos',
      slug: 'adultos',
      pageType: 'landing' as const,
      excerpt: 'Programa para adultos que quieren avanzar con claridad.',
      showInNavigation: true,
      navigationLabel: 'Adultos',
      sections: [
        {
          __component: 'blocks.program-highlights',
          title: 'Universa Adultos',
          programs: { set: [programAdultos.documentId] },
        },
      ],
    },
    {
      title: 'Idiomas',
      slug: 'idiomas',
      pageType: 'default' as const,
      excerpt: 'Oferta de idiomas y rutas actuales.',
      showInNavigation: true,
      navigationLabel: 'Idiomas',
      sections: [
        {
          __component: 'blocks.card-grid',
          title: 'Idiomas disponibles',
          items: [
            {
              title: 'Inglés',
              description: 'Ruta completa para adultos, juniors y empresas.',
              ctaLabel: 'Ver programas',
              ctaUrl: '/programas',
            },
          ],
        },
      ],
    },
    getProgramaContinuoGrupalPageData(),
    {
      title: 'Cursos',
      slug: 'cursos',
      pageType: 'landing' as const,
      excerpt: 'Cursos por objetivo y nivel.',
      showInNavigation: true,
      navigationLabel: 'Cursos',
      sections: [
        {
          __component: 'blocks.card-grid',
          title: 'Cursos destacados',
          items: [
            { title: 'Speaking Intensivo', description: 'Curso corto para fluidez.', ctaLabel: 'Más info', ctaUrl: '/contacto' },
            { title: 'Inglés para entrevistas', description: 'Preparación práctica para procesos laborales.', ctaLabel: 'Más info', ctaUrl: '/contacto' },
          ],
        },
      ],
    },
    {
      title: 'Servicios',
      slug: 'servicios',
      pageType: 'landing' as const,
      excerpt: 'Servicios complementarios y soporte.',
      showInNavigation: true,
      navigationLabel: 'Servicios',
      sections: [
        {
          __component: 'blocks.feature-list',
          title: 'Servicios disponibles',
          columns: 2,
          items: [
            { title: 'Asesoría académica', description: 'Definición de ruta y objetivos.' },
            { title: 'Support Partner', description: 'Acompañamiento operativo y motivacional.' },
            { title: 'Conversation Clubs', description: 'Práctica social guiada.' },
            { title: 'Preparación certificaciones', description: 'Rutas enfocadas a exámenes internacionales.' },
          ],
        },
      ],
    },
    {
      title: 'Comunidad Universa',
      slug: 'comunidad-universa',
      pageType: 'community' as const,
      excerpt: 'Espacios para conectar, practicar e impulsar tu proceso.',
      showInNavigation: true,
      navigationLabel: 'Comunidad Universa',
      sections: [
        {
          __component: 'blocks.rich-text',
          title: 'Una comunidad que te sostiene',
          content: rt(
            'Conversation clubs, retos y encuentros para practicar con propósito.',
            'La comunidad acelera la confianza y la constancia.'
          ),
        },
      ],
    },
    {
      title: 'Impacto Universa',
      slug: 'impacto-universa',
      pageType: 'impact' as const,
      excerpt: 'Iniciativas con propósito y oportunidades de impacto.',
      showInNavigation: true,
      navigationLabel: 'Impacto Universa',
      sections: [
        {
          __component: 'blocks.rich-text',
          title: 'Aprender para transformar',
          content: rt(
            'Impulsamos proyectos que conectan aprendizaje de idiomas con desarrollo social y profesional.'
          ),
        },
      ],
    },
    {
      title: 'FAQs',
      slug: 'faqs',
      pageType: 'default' as const,
      excerpt: 'Preguntas frecuentes sobre programas, metodología y operación.',
      showInNavigation: true,
      navigationLabel: 'FAQs',
      sections: [
        {
          __component: 'blocks.faq',
          title: 'Resolvemos tus dudas',
          faqItems: {
            set: [faq1.documentId, faq2.documentId, faq3.documentId, faq4.documentId, faq5.documentId],
          },
        },
      ],
    },
    {
      title: 'Noticias',
      slug: 'noticias',
      pageType: 'default' as const,
      excerpt: 'Novedades de Universa y su ecosistema.',
      showInNavigation: true,
      navigationLabel: 'Noticias',
      sections: [
        {
          __component: 'blocks.rich-text',
          title: 'Actualidad Universa',
          content: rt('Consulta aquí novedades, lanzamientos y anuncios de la comunidad Universa.'),
        },
      ],
    },
    {
      title: 'Blog',
      slug: 'blog',
      pageType: 'default' as const,
      excerpt: 'Contenido editorial sobre aprendizaje de idiomas.',
      showInNavigation: true,
      navigationLabel: 'Blog',
      sections: [
        {
          __component: 'blocks.rich-text',
          title: 'Ideas para avanzar mejor',
          content: rt('Publicamos guías prácticas, recursos y recomendaciones para tu progreso en inglés.'),
        },
      ],
    },
    {
      title: 'Contacto',
      slug: 'contacto',
      pageType: 'contact' as const,
      excerpt: 'Ponte en contacto con el equipo Universa.',
      showInNavigation: true,
      navigationLabel: 'Contacto',
      sections: [
        {
          __component: 'blocks.contact-form',
          title: 'Hablemos de tu objetivo',
          subtitle: 'Completa el formulario y te contactamos.',
          successMessage: 'Gracias por escribirnos. Te responderemos pronto.',
          subjectOptions: [
            { value: 'programas', label: 'Programas' },
            { value: 'empresas', label: 'Empresas' },
            { value: 'certificaciones', label: 'Certificaciones' },
            { value: 'otro', label: 'Otro' },
          ],
        },
      ],
    },
    {
      title: 'Trabaja con Nosotros',
      slug: 'trabaja-con-nosotros',
      pageType: 'institutional' as const,
      excerpt: 'Vacantes y cultura de trabajo en Universa.',
      showInNavigation: false,
      navigationLabel: 'Trabaja con Nosotros',
      sections: [
        {
          __component: 'blocks.rich-text',
          title: 'Únete al equipo',
          content: rt(
            'Buscamos personas con mentalidad de servicio, pasión por la educación y foco en impacto real.'
          ),
        },
      ],
    },
  ];

  for (const page of basePages) {
    await doc('api::page.page').create({
      data: {
        title: page.title,
        slug: page.slug,
        pageType: page.pageType,
        excerpt: page.excerpt,
        showInNavigation: page.showInNavigation,
        navigationLabel: page.navigationLabel,
        ...('hero' in page && page.hero ? { hero: page.hero } : {}),
        sections: page.sections,
        seo:
          'seo' in page && page.seo
            ? page.seo
            : {
                metaTitle: `${page.title} | Universa`,
                metaDescription: page.excerpt,
              },
      },
      status: 'published',
    });
  }

  await store.set({ key: SEED_KEY, value: { version: 1, appliedAt: new Date().toISOString() } });
  strapi.log.info('[universa-seed] Seed applied successfully.');
}
