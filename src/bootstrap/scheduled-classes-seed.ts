import type { Core } from '@strapi/strapi';

export async function bootstrapScheduledClasses(strapi: Core.Strapi) {
  const doc = strapi.documents.bind(strapi);

  // 1. Grant public permissions
  try {
    const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({
      where: { type: 'public' },
    });

    if (publicRole) {
      const actions = [
        'api::scheduled-class.scheduled-class.find',
        'api::scheduled-class.scheduled-class.findOne',
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
          strapi.log.info(`[scheduled-classes-seed] Granted public permission for: ${action}`);
        }
      }
    }
  } catch (error) {
    strapi.log.error(`[scheduled-classes-seed] Failed to grant permissions: ${String(error)}`);
  }

  // 2. Seed scheduled classes if none exist
  try {
    const classCount = await doc('api::scheduled-class.scheduled-class').findMany({ limit: 1 });
    
    if (classCount.length === 0) {
      strapi.log.info('[scheduled-classes-seed] Seeding sample scheduled classes...');
      
      // Find programs
      const pAdultos = await doc('api::program.program').findMany({ filters: { slug: 'universa-adultos' } });
      const pJuniors = await doc('api::program.program').findMany({ filters: { slug: 'universa-juniors' } });
      const pEmpresas = await doc('api::program.program').findMany({ filters: { slug: 'universa-empresas' } });

      const docIdAdultos = pAdultos[0]?.documentId;
      const docIdJuniors = pJuniors[0]?.documentId;
      const docIdEmpresas = pEmpresas[0]?.documentId;

      if (docIdAdultos) {
        await doc('api::scheduled-class.scheduled-class').create({
          data: {
            schedule: 'Lunes y Miércoles 19:00 - 20:30 (Noche)',
            teacher: 'Prof. Ana Martínez',
            program: docIdAdultos,
            whatsappNumber: '+51945311934',
          },
          status: 'published',
        });

        await doc('api::scheduled-class.scheduled-class').create({
          data: {
            schedule: 'Martes y Jueves 08:00 - 09:30 (Mañana)',
            teacher: 'Prof. John Doe',
            program: docIdAdultos,
            whatsappNumber: '+51945311934',
          },
          status: 'published',
        });
      }

      if (docIdJuniors) {
        await doc('api::scheduled-class.scheduled-class').create({
          data: {
            schedule: 'Sábados 09:00 - 13:00 (Mañana)',
            teacher: 'Prof. Carlos Ruíz',
            program: docIdJuniors,
            whatsappNumber: '+51945311934',
          },
          status: 'published',
        });
      }

      if (docIdEmpresas) {
        await doc('api::scheduled-class.scheduled-class').create({
          data: {
            schedule: 'Lunes a Viernes 18:00 - 19:00 (Tarde)',
            teacher: 'Prof. Sarah Smith',
            program: docIdEmpresas,
            whatsappNumber: '+51945311934',
          },
          status: 'published',
        });
      }

      strapi.log.info('[scheduled-classes-seed] Sample scheduled classes seeded successfully.');
    }
  } catch (error) {
    strapi.log.error(`[scheduled-classes-seed] Failed to seed classes: ${String(error)}`);
  }
}
