import type { Core } from '@strapi/strapi';

export async function bootstrapTalleres(strapi: Core.Strapi) {
  const doc = strapi.documents.bind(strapi);

  // 1. Grant public permissions
  try {
    const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({
      where: { type: 'public' },
    });

    if (publicRole) {
      const actions = [
        'api::taller.taller.find',
        'api::taller.taller.findOne',
      ];

      for (const action of actions) {
        const hasPermission = await strapi.db.query('plugin::users-permissions.permission').findOne({
          where: {
            action,
            role: publicRole.id,
          },
        });

        if (!hasPermission) {
          await strapi.db.query('plugin::users-permissions.permission').create({
            data: {
              action,
              role: publicRole.id,
            },
          });
          strapi.log.info(`[talleres-seed] Granted public permission for: ${action}`);
        }
      }
    }
  } catch (error) {
    strapi.log.error(`[talleres-seed] Failed to grant permissions: ${String(error)}`);
  }

  // 2. Seed talleres if none exist
  try {
    const count = await doc('api::taller.taller').findMany({ limit: 1 });

    if (count.length === 0) {
      strapi.log.info('[talleres-seed] Seeding sample talleres...');

      await doc('api::taller.taller').create({
        data: {
          nombre: 'Taller de Business English & Presentation Skills',
          slug: 'business-english-presentation-skills',
          resumen: 'Domina las presentaciones, reuniones de negocios y el networking en inglés. Ideal para profesionales.',
          descripcion: 'Este taller intensivo está diseñado para profesionales que necesitan comunicarse de manera efectiva en el entorno laboral internacional. Aprenderás técnicas clave para estructurar tus ideas, modular tu tono y captar la atención de tu audiencia en inglés. Trabajaremos con casos prácticos, vocabulario corporativo y simulación de reuniones de negocios reales.',
          syllabus: '- Introducción al Business English y estructura de presentaciones\n- Vocabulario clave para reuniones de negocios y negociaciones\n- Técnicas de lenguaje corporal y modulación de voz en inglés\n- Práctica final: Presentación y retroalimentación personalizada de tu proyecto',
          alTerminarPodras: '- Presentar ideas comerciales con mayor convicción y estructura.\n- Utilizar vocabulario corporativo clave en inglés en negociaciones.\n- Dominar técnicas de lenguaje corporal y modulación de voz.\n- Recibir retroalimentación personalizada sobre tu proyecto de presentación.',
          precio: 120.00,
          precioConDescuento: 89.99,
        },
        status: 'published',
      });

      await doc('api::taller.taller').create({
        data: {
          nombre: 'Taller de Pronunciación y Fluidez (Accents & Intonation)',
          slug: 'pronunciacion-y-fluidez',
          resumen: 'Mejora tu entonación, conecta palabras de manera natural y reduce la fricción al hablar inglés.',
          descripcion: 'Supera el miedo a hablar y hazte entender con mayor claridad. En este taller dinámico de pronunciación nos enfocaremos en los sonidos más difíciles del inglés para hispanohablantes. Aprenderás reglas de entonación, reducción de vocales, unión de palabras (linking words) y ritmos conversacionales para que tu inglés suene mucho más natural y fluido.',
          syllabus: '- Fonética básica: Consonantes y vocales críticas del inglés\n- El ritmo del inglés: Palabras con acento y reducción vocálica (Schwa)\n- Linking words: Conexión de sonidos para una mayor fluidez\n- Práctica interactiva: Grabación de voz y feedback de entonación',
          alTerminarPodras: '- Pronunciar correctamente las consonantes y vocales críticas del inglés.\n- Aplicar el ritmo del inglés y la reducción vocálica (sonido Schwa).\n- Conectar palabras de manera fluida y natural al hablar (linking words).\n- Evaluar tu propia entonación y corregir desvíos comunes.',
          precio: 95.00,
        },
        status: 'published',
      });

      await doc('api::taller.taller').create({
        data: {
          nombre: 'Taller de Preparación para Entrevistas Laborales (Job Interview Prep)',
          slug: 'entrevistas-laborales-prep',
          resumen: 'Prepárate para responder preguntas difíciles, estructurar tus logros y negociar tu oferta en inglés.',
          descripcion: 'Consigue el trabajo que deseas en empresas multinacionales o internacionales. Este taller te brindará las herramientas y la confianza para afrontar cualquier entrevista de trabajo en inglés. Aprenderás la metodología STAR para responder preguntas de comportamiento, estructurar tu elevator pitch y hablar con seguridad sobre tu trayectoria académica y laboral.',
          syllabus: '- Elevator Pitch: Cómo presentarte en 60 segundos de forma impactante\n- Preguntas típicas de entrevista y cómo estructurar respuestas bajo el método STAR\n- Simulación de entrevistas en vivo (Mock interviews) con retroalimentación\n- Preguntas inteligentes para hacer al entrevistador y negociación básica',
          alTerminarPodras: '- Presentar un Elevator Pitch estructurado e de alto impacto.\n- Responder preguntas difíciles de comportamiento usando el método STAR.\n- Afrontar simulacros de entrevistas de trabajo en vivo con retroalimentación directa.\n- Negociar ofertas salariales iniciales con mayor seguridad y tacto.',
          precio: 150.00,
          precioConDescuento: 119.99,
        },
        status: 'published',
      });

      strapi.log.info('[talleres-seed] Sample talleres seeded successfully.');
    }
  } catch (error) {
    strapi.log.error(`[talleres-seed] Failed to seed talleres: ${String(error)}`);
  }
}
