# Universa — Strapi (headless CMS)

Backend Strapi **v5** para modelar el contenido de **somosuniversa.com** como CMS headless: single types de configuración, páginas modulares con **Dynamic Zones**, entidades editoriales/listables y relaciones explícitas entre programas, FAQs y testimonios.


## Requisitos

- Node.js **20–24** (ver `package.json` → `engines`)
- npm 6+

## Arranque

```bash
npm install
npm run develop
```

- Admin: `http://localhost:3001/admin`
- API REST: `http://localhost:3001/api`

Producción / panel compilado:

```bash
npm run build
npm run start
```

### Tipos TypeScript generados

Tras cambiar esquemas:

```bash
npx strapi ts:generate-types
```

> Si ves errores raros de **content-types duplicados** al compilar, borra la carpeta `dist/` (puede quedar una copia vieja de esquemas) y vuelve a ejecutar `npm run build` o `npx strapi ts:generate-types`.

## Arquitectura de contenido (resumen)

| Capa | Uso |
|------|-----|
| **Single types** | Configuración global (sitio, header, footer, homepage). |
| **Collection types** | Entidades repetibles: páginas, programas, blog, noticias, FAQs, etc. |
| **Components** | Piezas reutilizables (SEO, CTAs, ítems de lista, navegación). |
| **Dynamic zones** | `homepage.sections` y `page.sections`: páginas compuestas por bloques versionables en el admin. |

### Single types

| UID API | Display | Notas |
|---------|---------|--------|
| `api::site-settings.site-setting` | Site Settings | Carpeta del API: `site-settings`; **singularName** Strapi: `site-setting` (requisito de unicidad + nombre de carpeta bajo `content-types`). |
| `api::header.header` | Header | |
| `api::footer.footer` | Footer | |
| `api::homepage.homepage` | Homepage | `sections` = dynamic zone. |

**Rutas REST (single types, Strapi 5):** suelen exponerse en singular según `singularName`, p. ej. `GET /api/site-setting`, `GET /api/header`, `GET /api/footer`, `GET /api/homepage`. Los collection types usan el `pluralName`: `GET /api/programs`, `GET /api/faq-items`, etc.

### Collection types

| UID API | Propósito |
|---------|-----------|
| `api::page.page` | Páginas institucionales / landings (no editoriales). |
| `api::program.program` | Programas (Adultos, Juniors, Empresas, continuo, cursos…). |
| `api::language.language` | Idiomas ofrecidos. |
| `api::certification.certification` | Certificaciones. |
| `api::testimonial.testimonial` | Testimonios. |
| `api::faq-item.faq-item` | FAQs reutilizables. |
| `api::blog-post.blog-post` | Blog. |
| `api::news-article.news-article` | Noticias. |
| `api::job-opening.job-opening` | Vacantes. |
| `api::impact-initiative.impact-initiative` | Iniciativas de impacto. |
| `api::community-opportunity.community-opportunity` | Oportunidades de comunidad. |

En todos aplica **Draft & Publish** (`options.draftAndPublish: true`).

### Components (`src/components`)

**Shared**

- `shared.seo` — SEO reutilizable.
- `shared.social-link` — Enlaces sociales.
- `shared.cta` — Botones / enlaces de acción.
- `shared.feature-item` — Ítem de beneficio/característica.
- `shared.stat-item` — Estadística (valor + etiqueta).

**Navigation**

- `navigation.nav-item` — Ítem con `children` repetibles (`navigation.sub-nav-item`).

**Blocks (Dynamic zone)**

- `blocks.hero`, `blocks.text-image`, `blocks.card-grid` (+ `blocks.card-grid-item`)
- `blocks.feature-list`, `blocks.testimonials`, `blocks.logo-cloud`, `blocks.ecosystem` (+ `blocks.ecosystem-item`)
- `blocks.step-list` (+ `blocks.step-item`), `blocks.faq`, `blocks.rich-text`
- `blocks.contact-form`, `blocks.program-highlights`, `blocks.stats`, `blocks.gallery`

Los mismos bloques están registrados en **`homepage.sections`** y **`page.sections`**.

### Relaciones destacadas

- **Program** ↔ **Certification**, **Language**, **FAQ Item**, **Testimonial** (many-to-many). El lado “dueño” de la relación en el esquema es el que define `inversedBy`; en el seed se conecta vía `connect` / `set` con **`documentId`** (Strapi 5).

## Datos iniciales (seed)

En el primer arranque con base de datos vacía, `src/bootstrap/universa-seed.ts` crea y **publica** contenido mínimo alineado con la propuesta de valor del sitio:

- `site-setting`, `header`, `footer`, `homepage` con secciones (hero, ecosistema Aprende/Conecta/Impacta, programas, FAQs, contacto, etc.)
- 3 `program` (Adultos, Juniors, Empresas)
- 2 `certification` enlazadas a programas
- 5 `faq-item` + bloque FAQ en home
- 1 `testimonial` + bloque en home
- 1 `impact-initiative`, 1 `community-opportunity`, 1 `job-opening`

**Idempotencia:** se guarda una bandera en el store del plugin `universa` (`bootstrap_seed_v1`). Si ya existe, el seed no se vuelve a ejecutar.

Para **volver a sembrar** en desarrollo: borra `.tmp/data.db` (SQLite por defecto) o elimina la entrada correspondiente en la tabla de store del plugin en tu BD.

## Consumo por API (frontend)

1. Crea un usuario admin y entra al panel.
2. **Settings → Users & Permissions → Roles → Public** (o el rol que uses): habilita `find` / `findOne` (y `singleType` donde aplique) para los content-types que quieras exponer.
3. Usa `populate` en profundidad para dynamic zones y componentes, por ejemplo (ajusta nombres según pruebes en tu entorno):

`GET /api/homepage?populate[sections][populate]=*`

> Los single types suelen exponerse como un único documento; los collection types como colección (`/api/programs`, etc.).

## Extender `homepage` / `page` con un bloque nuevo

1. Crea el componente en `src/components/blocks/mi-bloque.json` (y sub-componentes si aplica).
2. Añade el nombre del componente (p. ej. `blocks.mi-bloque`) al array `components` de los atributos dynamic zone en:
   - `src/api/homepage/content-types/homepage/schema.json` → `sections`
   - `src/api/page/content-types/page/schema.json` → `sections`
3. Ejecuta `npx strapi ts:generate-types` y reinicia Strapi.

## Decisiones de modelado

| Tema | Decisión |
|------|-----------|
| **`site-settings` vs `site-setting`** | Strapi 5 exige que `singularName` y `pluralName` sean **distintos** y que la carpeta bajo `content-types/` coincida con `singularName`. Por eso el single type es `site-setting` y el plural `site-settings`, manteniendo el API en carpeta `site-settings`. |
| **`blog-post.tags`** | Campo **JSON**: array de strings (`["ingles", "metodologia"]`) sin crear otro content-type. |
| **`blocks.contact-form.subjectOptions`** | Campo **JSON**: array de objetos `{ "value": "...", "label": "..." }` para que el front pueda renderizar un `<select>` sin acoplar opciones al código. |
| **Rich text en seed** | Los campos `richtext` se persisten como **cadena JSON** (bloques mínimos `paragraph` / `text`), que es lo que valida la capa de documentos al crear entradas por código. |
| **i18n** | No activada: los esquemas están pensados para añadir **Internationalization** más adelante sin rehacer la taxonomía (slugs, entidades separadas por tipo). |
| **Scaffold de APIs** | Los archivos `routes/controllers/services` deben llamarse como el **`singularName`** del content-type (p. ej. `site-setting.ts`), no como la carpeta del API. El script `scripts/generate-content-schemas.js` ya genera con esa convención. |

## Scripts útiles

| Script | Descripción |
|--------|-------------|
| `npm run develop` | Desarrollo con recarga. |
| `npm run build` | Build admin + compilación TS. |
| `npm run start` | Servidor sin recarga (tras `build`). |
| `npx strapi ts:generate-types` | Regenera `types/generated/*.d.ts`. |

## Estructura relevante del repo

```
src/
  api/                    # Content-types + routers/controllers/services
  components/             # Componentes y bloques (shared, navigation, blocks)
  bootstrap/
    universa-seed.ts      # Seed inicial
  index.ts                # register / bootstrap
scripts/
  generate-content-schemas.js   # Regenera esquemas (uso dev)
types/generated/          # Tipos TS generados (ejecutar typegen tras cambios)
```

---

Proyecto base Strapi: [documentación oficial](https://docs.strapi.io).
