# Propuesta de Estructura de Contenido (Strapi + Next.js)

## 1) Objetivo

Definir una arquitectura de contenido para Strapi que permita a una app Next.js renderizar el sitio de forma fiel y mantenible, pero con una **home corta** (máximo 4–5 bloques además del header) y el resto del contenido distribuido en páginas secundarias, sin hardcodear estructura en frontend.

## 2) Principios de diseño

- **Headless real:** el frontend consume datos y decide presentación, no lógica editorial.
- **Page Builder modular:** `homepage` y otras páginas renderizadas por bloques en orden.
- **Contenido reusable:** testimonios, FAQs, programas, certificaciones y noticias como colecciones.
- **Escalable para nuevas páginas:** posibilidad de replicar la misma lógica para `nosotros`, `metodologia`, `programas`, etc.
- **Optimizado para Next.js:** payloads claros, slugs estables, relaciones explícitas y SEO desacoplado.
- **Preparado para i18n:** sin activarlo ahora, pero con convenciones compatibles.

## 3) Mapa funcional del sitio (según tu criterio de home corta)

La captura contiene mucho contenido, pero se propone una arquitectura multipágina:

### 3.1 Home (máximo 4–5 bloques, además de header)

1. Hero principal (propuesta de valor + CTA).
2. Programas principales (cards o highlights).
3. Bloque de valor diferencial (“¿Por qué Universa?” resumido).
4. Testimonios o prueba social.
5. CTA de cierre (contacto/test/recomendación).

### 3.2 Páginas secundarias (donde vive el contenido extenso)

- `/nosotros`: historia, cultura, equipo, trabaja con nosotros.
- `/metodologia`: método, materiales, plataforma, certificaciones.
- `/programas` y subpáginas (`/adultos`, `/juniors`, `/empresas`, etc.).
- `/comunidad-universa`: ecosistema, conecta, oportunidades.
- `/impacto-universa`: iniciativas y proyectos.
- `/faqs`: FAQs completas.
- `/contacto`: formulario, datos de contacto y CTA comercial.
- `/blog` y `/noticias`: contenido editorial.

> Decisión clave: la home funciona como “portada de navegación”, no como landing larga.

## 4) Modelo de contenido propuesto

## 4.1 Single Types (configuración global y páginas únicas)

- `site-settings`
  - Identidad global del sitio: nombre, tagline, logos, contacto, redes, SEO por defecto.
- `header`
  - Navegación principal, CTA principal, links secundarios, submenús.
- `footer`
  - Navegación footer, links legales, redes, bloque de contacto, copy legal.
- `homepage`
  - `title`, `slug`, `seo`, `sections` (Dynamic Zone).

> Decisión: `homepage` es una entidad editorial real para que marketing pueda reordenar bloques sin tocar código.

## 4.2 Collection Types (entidades reutilizables)

- `page` (landings/institucionales; opcional hero + dynamic zone).
- `program` (adultos, juniors, empresas, cursos, etc.).
- `testimonial`.
- `faq-item`.
- `certification`.
- `language`.
- `blog-post`.
- `news-article`.
- `job-opening`.
- `impact-initiative`.
- `community-opportunity`.

## 4.3 Componentes base reutilizables

- `shared.seo`
- `shared.cta`
- `shared.social-link`
- `shared.feature-item`
- `shared.stat-item`
- `navigation.nav-item`
- `navigation.sub-nav-item`

## 4.4 Bloques para Page Builder (Dynamic Zone)

Bloques necesarios para cubrir la captura:

- `blocks.hero`
- `blocks.text-image`
- `blocks.card-grid`
- `blocks.feature-list`
- `blocks.program-highlights`
- `blocks.testimonials`
- `blocks.logo-cloud`
- `blocks.ecosystem`
- `blocks.stats`
- `blocks.step-list`
- `blocks.rich-text`
- `blocks.faq`
- `blocks.contact-form`
- `blocks.gallery`
- `blocks.cta-banner` (**nuevo recomendado**)
- `blocks.comparison-grid` (**nuevo recomendado**)
- `blocks.metric-strip` (**nuevo recomendado**)

> Nota: los tres bloques “nuevo recomendado” son para reproducir con más fidelidad franjas visuales intermedias que se aprecian en la captura (secciones compactas con KPIs/beneficios/comparativas).

## 5) Contrato de render para Next.js

## 5.1 Estrategia de frontend

- Página `"/"` consume `homepage` con `sections`.
- Render por switch de componente:
  - `blocks.hero` => `<HeroBlock />`
  - `blocks.feature-list` => `<FeatureListBlock />`
  - etc.
- Cada bloque se renderiza por su `__component`.

## 5.2 Datos mínimos por bloque

Todos los bloques deben incluir:

- `id` del bloque
- `__component`
- Contenido principal (title/subtitle/body/items)
- `cta` opcional
- Multimedia opcional
- `themeVariant` opcional (**recomendado**) para controlar estilo visual desde CMS

## 5.3 SEO y navegación

- SEO a nivel de `homepage` y `page`.
- Header/Footer consultados por separado y cacheables.
- Slugs estables para páginas (`/contacto`, `/blog`, `/noticias`, etc.).

## 6) Orden editorial recomendado para `homepage.sections` (home corta)

Límite: **4 o 5 bloques** máximo (sin contar header/footer).

### Opción recomendada (5 bloques)

1. `blocks.hero`
2. `blocks.program-highlights`
3. `blocks.feature-list` (versión resumida de propuesta de valor)
4. `blocks.testimonials`
5. `blocks.cta-banner`

### Opción compacta (4 bloques)

1. `blocks.hero`
2. `blocks.program-highlights`
3. `blocks.feature-list`
4. `blocks.cta-banner`

## 6.1 Distribución de bloques en páginas secundarias

- **Nosotros:** `text-image`, `rich-text`, `stats`, `gallery`
- **Metodología:** `rich-text`, `feature-list`, `logo-cloud`, `metric-strip`
- **Programas (hub):** `program-highlights`, `comparison-grid`, `faq`
- **Programa detalle:** `hero`, `feature-list`, `testimonials`, `faq`, `cta-banner`
- **Comunidad/Impacto:** `ecosystem`, `card-grid`, `gallery`, `cta-banner`
- **Contacto:** `contact-form`, `rich-text`, `faq`

## 7) Taxonomía y relaciones clave

- `program` ↔ `testimonial` (M2M)
- `program` ↔ `faq-item` (M2M)
- `program` ↔ `certification` (M2M)
- `program` ↔ `language` (M2M)
- `blocks.program-highlights` referencia `program`
- `blocks.testimonials` referencia `testimonial`
- `blocks.faq` referencia `faq-item`

Esto evita duplicar contenido y permite que cambios editoriales se reflejen en múltiples páginas.

## 8) Requisitos no funcionales para equipo Next.js

- **Cache:** Header/Footer/Homepage por ISR/revalidate.
- **Fallback robusto:** si un bloque no existe, no romper render global.
- **Validación runtime:** zod/io-ts en capa de fetching para tolerancia a cambios editoriales.
- **Imágenes:** usar `next/image` + dominios permitidos + formatos responsive.

## 9) Gobierno editorial recomendado

- Draft & Publish habilitado en todos los tipos públicos.
- Campos `displayOrder` para listados gestionados por negocio.
- Convención de slugs única y permanente.
- Campos `isFeatured` donde haya destacados.
- Checklist de publicación por página (SEO, CTA, enlaces, formulario, analítica).

## 10) Gap actual vs tu objetivo

Para cumplir exactamente tu objetivo (home corta + multipágina reusable), aún se requiere:

- Definir qué 4–5 bloques quedan fijos en home (lista final de negocio).
- Asignar cada bloque “sobrante” de la captura a su página secundaria destino.
- Definir copy final por página (no solo por home).
- Cargar assets reales en Media Library para conservar consistencia visual.

## 11) Entregable de esta fase

Este documento es la base de arquitectura para aprobación.

Si se aprueba, la siguiente fase sería:

1. Congelar schema final.
2. Implementar/ajustar content-types y bloques.
3. Sembrar seed con contenido 1:1.
4. Entregar contrato de consumo para Next.js (queries + tipos).

