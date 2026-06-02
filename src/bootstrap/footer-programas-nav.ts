import type { Core } from '@strapi/strapi';

import { PROGRAMAS_NAV_CHILDREN } from './header-programas-nav';

const VERSION_STORE_KEY = 'footer_programas_nav_version' as const;
const CONTENT_VERSION = 'four-programs-v1';

type NavItem = {
  label?: string | null;
  url?: string | null;
  openInNewTab?: boolean | null;
  children?: ReadonlyArray<{
    label?: string | null;
    url?: string | null;
    openInNewTab?: boolean | null;
  } | null> | null;
};

function withProgramasChildren(nav: ReadonlyArray<NavItem | null> | null | undefined) {
  if (!nav?.length) return null;

  let found = false;
  const updated = nav
    .filter((item): item is NavItem => item != null)
    .map((item) => {
      if (item.label !== 'Programas') return item;
      found = true;
      return {
        label: item.label,
        url: item.url ?? '/programas',
        openInNewTab: item.openInNewTab ?? false,
        children: [...PROGRAMAS_NAV_CHILDREN],
      };
    });

  return found ? updated : null;
}

/** Añade al footer los mismos enlaces de programas que el menú superior. */
export async function upsertFooterProgramasNav(strapi: Core.Strapi) {
  const store = strapi.store({ type: 'plugin', name: 'universa' });
  const appliedVersion = await store.get({ key: VERSION_STORE_KEY });

  if (appliedVersion === CONTENT_VERSION) {
    strapi.log.info(`[footer-programas-nav] Already at version ${CONTENT_VERSION}; skipping.`);
    return;
  }

  const doc = strapi.documents.bind(strapi);
  const footer = await doc('api::footer.footer').findFirst({
    populate: { footerNavigation: { populate: ['children'] } },
  });

  if (!footer?.documentId) {
    strapi.log.warn('[footer-programas-nav] Footer not found; skipping.');
    return;
  }

  const footerNavigation = withProgramasChildren(
    footer.footerNavigation as ReadonlyArray<NavItem | null> | null | undefined,
  );

  if (!footerNavigation) {
    strapi.log.warn('[footer-programas-nav] "Programas" nav item not found; skipping.');
    return;
  }

  await doc('api::footer.footer').update({
    documentId: footer.documentId,
    data: { footerNavigation },
    status: 'published',
  });

  await store.set({ key: VERSION_STORE_KEY, value: CONTENT_VERSION });
  strapi.log.info('[footer-programas-nav] Programas links added to footer.');
}
