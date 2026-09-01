import type { Core } from '@strapi/strapi';

import { runUniversaSeed } from './bootstrap/universa-seed';
import { seedBlogPostsFromFrontend } from './bootstrap/blog-posts-seed';
import { upsertProgramaContinuoGrupalPage } from './bootstrap/programa-continuo-grupal-page';
import { upsertProgramaContinuoPrivadoPage } from './bootstrap/programa-continuo-privado-page';
import { upsertProgramaFlexPrivadoPage } from './bootstrap/programa-flex-privado-page';
import { upsertProgramaDynamicPage } from './bootstrap/programa-dynamic-page';
import { upsertSesionesOnDemandPage } from './bootstrap/sesiones-on-demand-page';
import { upsertProgramasPage } from './bootstrap/programas-page';
import { upsertHeaderProgramasNav } from './bootstrap/header-programas-nav';
import { upsertFooterProgramasNav } from './bootstrap/footer-programas-nav';
import { upsertLegalPages } from './bootstrap/legal-pages';
import { sanitizePromoContentFromCms } from './bootstrap/sanitize-promo-content';
import { bootstrapScheduledClasses } from './bootstrap/scheduled-classes-seed';
import { bootstrapTalleres } from './bootstrap/talleres-seed';
import { upsertServiciosPage } from './bootstrap/servicios-page';
import { upsertVirtualCoffeePage } from './bootstrap/virtual-coffee-page';
import { upsertProfessionalMasteryLabPage } from './bootstrap/professional-mastery-lab-page';
import { upsertMetodologiaPage } from './bootstrap/metodologia-page';


export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await runUniversaSeed(strapi);
    await seedBlogPostsFromFrontend(strapi);
    await sanitizePromoContentFromCms(strapi);
    await upsertProgramaContinuoGrupalPage(strapi);
    try {
      await upsertProgramaContinuoPrivadoPage(strapi);
    } catch (error) {
      strapi.log.warn(
        `[programa-continuo-privado] Upsert failed (certifications FK); continuing bootstrap. ${String(error)}`,
      );
    }
    await upsertProgramaFlexPrivadoPage(strapi);
    await upsertProgramaDynamicPage(strapi);
    await upsertSesionesOnDemandPage(strapi);
    await upsertProgramasPage(strapi);
    await upsertServiciosPage(strapi);
    await upsertVirtualCoffeePage(strapi);
    await upsertProfessionalMasteryLabPage(strapi);
    await upsertMetodologiaPage(strapi);
    await upsertHeaderProgramasNav(strapi);
    await upsertFooterProgramasNav(strapi);
    await upsertLegalPages(strapi);
    await sanitizePromoContentFromCms(strapi);
    await bootstrapScheduledClasses(strapi);
    await bootstrapTalleres(strapi);
  },
};
