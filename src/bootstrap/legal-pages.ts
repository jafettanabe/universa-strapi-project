import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import type { Core } from '@strapi/strapi';

const CONTENT_VERSION = 'legal-pages-v1';
const VERSION_STORE_KEY = 'legal_pages_content_version' as const;
const CONTENT_DIR = join(process.cwd(), 'src', 'bootstrap', 'content');

const LEGAL_PAGES = [
  {
    slug: 'terminos',
    title: 'Términos y Condiciones',
    file: 'terminos-y-condiciones.txt',
    sectionTitle: 'Términos y Condiciones de Servicio Universa',
    seoTitle: 'Términos y Condiciones | Universa',
    seoDescription:
      'Términos y Condiciones Generales de Servicio de Universa, operada por Bethcor Group S.A.C.',
  },
  {
    slug: 'privacidad',
    title: 'Política de Privacidad',
    file: 'politica-privacidad.txt',
    sectionTitle: 'Política de Privacidad y Protección de datos personales',
    seoTitle: 'Política de Privacidad | Universa',
    seoDescription:
      'Política de Privacidad y Protección de Datos Personales de Universa, operada por Bethcor Group S.A.C.',
  },
] as const;

const FOOTER_LEGAL_LINKS = [
  { label: 'Política de Privacidad', url: '/privacidad', openInNewTab: false },
  { label: 'Términos y Condiciones', url: '/terminos', openInNewTab: false },
] as const;

function readLegalFile(filename: string) {
  return readFileSync(join(CONTENT_DIR, filename), 'utf8');
}

async function upsertFooterLegalLinks(strapi: Core.Strapi) {
  const doc = strapi.documents.bind(strapi);
  const footer = await doc('api::footer.footer').findFirst();

  if (!footer?.documentId) {
    strapi.log.warn('[legal-pages] Footer not found; skipping legal links update.');
    return;
  }

  await doc('api::footer.footer').update({
    documentId: footer.documentId,
    data: { legalLinks: [...FOOTER_LEGAL_LINKS] },
    status: 'published',
  });
}

/** Crea o actualiza /terminos y /privacidad con el contenido legal oficial. */
export async function upsertLegalPages(strapi: Core.Strapi) {
  const store = strapi.store({ type: 'plugin', name: 'universa' });
  const appliedVersion = await store.get({ key: VERSION_STORE_KEY });

  if (appliedVersion === CONTENT_VERSION) {
    strapi.log.info(`[legal-pages] Already at version ${CONTENT_VERSION}; skipping.`);
    return;
  }

  const doc = strapi.documents.bind(strapi);

  for (const page of LEGAL_PAGES) {
    const body = readLegalFile(page.file);
    const pageData = {
      title: page.title,
      slug: page.slug,
      pageType: 'institutional' as const,
      showInNavigation: false,
      excerpt: page.seoDescription,
      seo: {
        metaTitle: page.seoTitle,
        metaDescription: page.seoDescription,
        noIndex: false,
      },
      sections: [
        {
          __component: 'blocks.legal-document',
          title: page.sectionTitle,
          body,
        },
      ],
    };

    const existing = await doc('api::page.page').findMany({
      filters: { slug: { $eq: page.slug } },
      limit: 1,
    });

    if (existing.length > 0) {
      await doc('api::page.page').update({
        documentId: existing[0].documentId,
        data: pageData,
        status: 'published',
      });
      strapi.log.info(`[legal-pages] Updated /${page.slug}.`);
    } else {
      await doc('api::page.page').create({
        data: pageData,
        status: 'published',
      });
      strapi.log.info(`[legal-pages] Created /${page.slug}.`);
    }
  }

  await upsertFooterLegalLinks(strapi);
  await store.set({ key: VERSION_STORE_KEY, value: CONTENT_VERSION });
  strapi.log.info('[legal-pages] Legal pages and footer links applied.');
}
