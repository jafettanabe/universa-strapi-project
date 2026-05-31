import type { Core } from '@strapi/strapi';

const PROMO_PATTERN =
  /brochure|Válido hasta el 30 de Abril de 2026|Cierre de inscripciones Mayo|Mayo 2026|Inscripciones Mayo 2026/i;

function cleanPromoString(text: string): string {
  let s = text
    .replace(/Brochure\s+/gi, '')
    .replace(/Válido hasta el 30 de Abril de 2026\.?\s*/gi, '')
    .replace(
      /Cierre de inscripciones Mayo\s*[—–-]\s*(?:Válido hasta el 30 de Abril de 2026\s*)?(?:o\s*)?cierre de cupos\.?\s*/gi,
      '',
    )
    .replace(/^Mayo 2026$/i, '')
    .replace(/Inscripciones Mayo 2026\.?/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

  if (/Cierre de inscripciones|^Mayo 2026$/i.test(s)) {
    return '';
  }

  return s;
}

function stripPromoDeep(value: unknown): { value: unknown; changed: boolean } {
  if (typeof value === 'string') {
    if (!PROMO_PATTERN.test(value)) {
      return { value, changed: false };
    }
    const cleaned = cleanPromoString(value);
    return { value: cleaned, changed: cleaned !== value };
  }

  if (Array.isArray(value)) {
    let changed = false;
    const next = value.map((item) => {
      const result = stripPromoDeep(item);
      changed = changed || result.changed;
      return result.value;
    });
    return { value: next, changed };
  }

  if (value && typeof value === 'object') {
    let changed = false;
    const next: Record<string, unknown> = {};

    for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
      if (
        [
          'documentId',
          'id',
          'createdAt',
          'updatedAt',
          'publishedAt',
          'locale',
          'localizations',
          '__temp_key__',
        ].includes(key)
      ) {
        next[key] = child;
        continue;
      }

      const result = stripPromoDeep(child);
      changed = changed || result.changed;
      next[key] = result.value;
    }

    return { value: next, changed };
  }

  return { value, changed: false };
}

type ContentEntry = {
  documentId: string;
  slug?: string | null;
  title?: string | null;
  sections?: unknown;
  hero?: unknown;
  seo?: unknown;
  excerpt?: string | null;
};

async function sanitizeEntry(
  strapi: Core.Strapi,
  uid: 'api::page.page' | 'api::homepage.homepage',
  entry: ContentEntry,
  label: string,
): Promise<boolean> {
  const doc = strapi.documents.bind(strapi);
  const payload: Record<string, unknown> = {};
  let changed = false;

  for (const field of ['sections', 'hero', 'seo', 'excerpt'] as const) {
    const raw = entry[field];
    if (raw == null) continue;
    const result = stripPromoDeep(raw);
    if (result.changed) {
      payload[field] = result.value;
      changed = true;
    }
  }

  if (!changed) return false;

  await doc(uid).update({
    documentId: entry.documentId,
    data: payload,
    status: 'published',
  });

  strapi.log.info(
    `[sanitize-promo] Updated ${label} (${entry.slug ?? entry.title ?? entry.documentId}).`,
  );
  return true;
}

/** Retira textos promocionales (Brochure, fechas Mayo 2026, etc.) del CMS publicado. */
export async function sanitizePromoContentFromCms(strapi: Core.Strapi) {
  const doc = strapi.documents.bind(strapi);
  let updated = 0;

  const pages = await doc('api::page.page').findMany({
    populate: {
      sections: { populate: '*' },
      hero: { populate: '*' },
      seo: true,
    },
    limit: 200,
  });

  for (const page of pages) {
    if (await sanitizeEntry(strapi, 'api::page.page', page as ContentEntry, 'page')) {
      updated += 1;
    }
  }

  const homepage = await doc('api::homepage.homepage').findFirst({
    populate: {
      sections: { populate: '*' },
      seo: true,
    },
  });

  if (
    homepage &&
    (await sanitizeEntry(strapi, 'api::homepage.homepage', homepage as ContentEntry, 'homepage'))
  ) {
    updated += 1;
  }

  if (updated === 0) {
    strapi.log.info('[sanitize-promo] No promotional date text found in CMS content.');
  } else {
    strapi.log.info(`[sanitize-promo] Done. ${updated} document(s) updated.`);
  }
}
