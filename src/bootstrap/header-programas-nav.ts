import type { Core } from '@strapi/strapi';

export const PROGRAMAS_NAV_CHILDREN = [
  { label: 'Programa Continuo Grupal', url: '/programa-continuo-grupal', openInNewTab: false },
  { label: 'Programa Continuo Privado', url: '/programa-continuo-privado', openInNewTab: false },
  { label: 'Programa Flex Privado', url: '/programa-flex-privado', openInNewTab: false },
  { label: 'Sesiones On Demand', url: '/sesiones-on-demand-privado', openInNewTab: false },
] as const;

const VERSION_STORE_KEY = 'header_programas_nav_version' as const;
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

/** Deja el submenú Programas con solo los 4 programas principales. */
export async function upsertHeaderProgramasNav(strapi: Core.Strapi) {
  const store = strapi.store({ type: 'plugin', name: 'universa' });
  const appliedVersion = await store.get({ key: VERSION_STORE_KEY });

  if (appliedVersion === CONTENT_VERSION) {
    strapi.log.info(
      `[header-programas-nav] Already at version ${CONTENT_VERSION}; skipping.`,
    );
    return;
  }

  const doc = strapi.documents.bind(strapi);
  const header = await doc('api::header.header').findFirst({
    populate: { primaryNavigation: { populate: ['children'] } },
  });

  if (!header?.documentId) {
    strapi.log.warn('[header-programas-nav] Header not found; skipping.');
    return;
  }

  const primaryNavigation = withProgramasChildren(
    header.primaryNavigation as ReadonlyArray<NavItem | null> | null | undefined,
  );

  if (!primaryNavigation) {
    strapi.log.warn('[header-programas-nav] "Programas" nav item not found; skipping.');
    return;
  }

  await doc('api::header.header').update({
    documentId: header.documentId,
    data: { primaryNavigation },
    status: 'published',
  });

  await store.set({ key: VERSION_STORE_KEY, value: CONTENT_VERSION });
  strapi.log.info('[header-programas-nav] Programas submenu updated to 4 programs.');
}
