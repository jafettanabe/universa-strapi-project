const fs = require('fs');
const path = require('path');

const root = process.cwd();
const writeJson = (relPath, data) => {
  const abs = path.join(root, relPath);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(`${abs}`, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
};

const defaultOptions = { draftAndPublish: true };

const components = {
  'src/components/shared/seo.json': {
    collectionName: 'components_shared_seos',
    info: { displayName: 'seo', description: 'Reusable SEO fields' },
    attributes: {
      metaTitle: { type: 'string' },
      metaDescription: { type: 'text' },
      metaImage: { type: 'media', multiple: false, allowedTypes: ['images'] },
      noIndex: { type: 'boolean', default: false },
      canonicalUrl: { type: 'string' },
    },
  },
  'src/components/shared/social-link.json': {
    collectionName: 'components_shared_social_links',
    info: { displayName: 'social-link' },
    attributes: {
      platform: {
        type: 'enumeration',
        enum: ['facebook', 'instagram', 'linkedin', 'youtube', 'tiktok', 'whatsapp', 'x', 'other'],
      },
      label: { type: 'string' },
      url: { type: 'string', required: true },
    },
  },
  'src/components/shared/cta.json': {
    collectionName: 'components_shared_ctas',
    info: { displayName: 'cta' },
    attributes: {
      label: { type: 'string', required: true },
      url: { type: 'string', required: true },
      style: {
        type: 'enumeration',
        enum: ['primary', 'secondary', 'ghost'],
        default: 'primary',
      },
    },
  },
  'src/components/shared/feature-item.json': {
    collectionName: 'components_shared_feature_items',
    info: { displayName: 'feature-item' },
    attributes: {
      title: { type: 'string', required: true },
      description: { type: 'text' },
      iconName: { type: 'string' },
    },
  },
  'src/components/shared/stat-item.json': {
    collectionName: 'components_shared_stat_items',
    info: { displayName: 'stat-item' },
    attributes: {
      value: { type: 'string', required: true },
      label: { type: 'string', required: true },
      description: { type: 'string' },
    },
  },
  'src/components/navigation/sub-nav-item.json': {
    collectionName: 'components_navigation_sub_nav_items',
    info: { displayName: 'sub-nav-item' },
    attributes: {
      label: { type: 'string', required: true },
      url: { type: 'string' },
      openInNewTab: { type: 'boolean', default: false },
    },
  },
  'src/components/navigation/nav-item.json': {
    collectionName: 'components_navigation_nav_items',
    info: { displayName: 'nav-item' },
    attributes: {
      label: { type: 'string', required: true },
      url: { type: 'string' },
      openInNewTab: { type: 'boolean', default: false },
      children: { type: 'component', repeatable: true, component: 'navigation.sub-nav-item' },
    },
  },
  'src/components/blocks/hero.json': {
    collectionName: 'components_blocks_heroes',
    info: { displayName: 'hero' },
    attributes: {
      eyebrow: { type: 'string' },
      title: { type: 'string', required: true },
      subtitle: { type: 'text' },
      primaryCta: { type: 'component', repeatable: false, component: 'shared.cta' },
      secondaryCta: { type: 'component', repeatable: false, component: 'shared.cta' },
      backgroundImage: { type: 'media', multiple: false, allowedTypes: ['images'] },
      foregroundImage: { type: 'media', multiple: false, allowedTypes: ['images'] },
      alignment: {
        type: 'enumeration',
        enum: ['left', 'center', 'right'],
        default: 'left',
      },
    },
  },
  'src/components/blocks/text-image.json': {
    collectionName: 'components_blocks_text_images',
    info: { displayName: 'text-image' },
    attributes: {
      eyebrow: { type: 'string' },
      title: { type: 'string', required: true },
      body: { type: 'richtext' },
      image: { type: 'media', multiple: false, allowedTypes: ['images'] },
      imagePosition: {
        type: 'enumeration',
        enum: ['left', 'right'],
        default: 'right',
      },
      cta: { type: 'component', repeatable: false, component: 'shared.cta' },
    },
  },
  'src/components/blocks/card-grid-item.json': {
    collectionName: 'components_blocks_card_grid_items',
    info: { displayName: 'card-grid-item' },
    attributes: {
      title: { type: 'string', required: true },
      description: { type: 'text' },
      image: { type: 'media', multiple: false, allowedTypes: ['images'] },
      ctaLabel: { type: 'string' },
      ctaUrl: { type: 'string' },
    },
  },
  'src/components/blocks/card-grid.json': {
    collectionName: 'components_blocks_card_grids',
    info: { displayName: 'card-grid' },
    attributes: {
      eyebrow: { type: 'string' },
      title: { type: 'string' },
      subtitle: { type: 'text' },
      items: { type: 'component', repeatable: true, component: 'blocks.card-grid-item' },
    },
  },
  'src/components/blocks/feature-list.json': {
    collectionName: 'components_blocks_feature_lists',
    info: { displayName: 'feature-list' },
    attributes: {
      eyebrow: { type: 'string' },
      title: { type: 'string' },
      subtitle: { type: 'text' },
      items: { type: 'component', repeatable: true, component: 'shared.feature-item' },
      columns: { type: 'integer', default: 3 },
    },
  },
  'src/components/blocks/testimonials.json': {
    collectionName: 'components_blocks_testimonials',
    info: { displayName: 'testimonials' },
    attributes: {
      eyebrow: { type: 'string' },
      title: { type: 'string' },
      subtitle: { type: 'text' },
      testimonials: {
        type: 'relation',
        relation: 'manyToMany',
        target: 'api::testimonial.testimonial',
      },
    },
  },
  'src/components/blocks/logo-cloud.json': {
    collectionName: 'components_blocks_logo_clouds',
    info: { displayName: 'logo-cloud' },
    attributes: {
      eyebrow: { type: 'string' },
      title: { type: 'string' },
      subtitle: { type: 'text' },
      logos: { type: 'media', multiple: true, allowedTypes: ['images'] },
    },
  },
  'src/components/blocks/ecosystem-item.json': {
    collectionName: 'components_blocks_ecosystem_items',
    info: { displayName: 'ecosystem-item' },
    attributes: {
      phase: { type: 'string' },
      title: { type: 'string', required: true },
      description: { type: 'text' },
      image: { type: 'media', multiple: false, allowedTypes: ['images'] },
      ctaLabel: { type: 'string' },
      ctaUrl: { type: 'string' },
    },
  },
  'src/components/blocks/ecosystem.json': {
    collectionName: 'components_blocks_ecosystems',
    info: { displayName: 'ecosystem' },
    attributes: {
      eyebrow: { type: 'string' },
      title: { type: 'string' },
      subtitle: { type: 'text' },
      items: { type: 'component', repeatable: true, component: 'blocks.ecosystem-item' },
    },
  },
  'src/components/blocks/step-item.json': {
    collectionName: 'components_blocks_step_items',
    info: { displayName: 'step-item' },
    attributes: {
      stepNumber: { type: 'string' },
      title: { type: 'string', required: true },
      description: { type: 'text' },
    },
  },
  'src/components/blocks/step-list.json': {
    collectionName: 'components_blocks_step_lists',
    info: { displayName: 'step-list' },
    attributes: {
      eyebrow: { type: 'string' },
      title: { type: 'string' },
      subtitle: { type: 'text' },
      steps: { type: 'component', repeatable: true, component: 'blocks.step-item' },
    },
  },
  'src/components/blocks/faq.json': {
    collectionName: 'components_blocks_faqs',
    info: { displayName: 'faq' },
    attributes: {
      eyebrow: { type: 'string' },
      title: { type: 'string' },
      subtitle: { type: 'text' },
      faqItems: {
        type: 'relation',
        relation: 'manyToMany',
        target: 'api::faq-item.faq-item',
      },
    },
  },
  'src/components/blocks/rich-text.json': {
    collectionName: 'components_blocks_rich_texts',
    info: { displayName: 'rich-text' },
    attributes: {
      eyebrow: { type: 'string' },
      title: { type: 'string' },
      content: { type: 'richtext' },
    },
  },
  'src/components/blocks/contact-form.json': {
    collectionName: 'components_blocks_contact_forms',
    info: { displayName: 'contact-form' },
    attributes: {
      eyebrow: { type: 'string' },
      title: { type: 'string' },
      subtitle: { type: 'text' },
      successMessage: { type: 'string' },
      subjectOptions: { type: 'json' },
    },
  },
  'src/components/blocks/program-highlights.json': {
    collectionName: 'components_blocks_program_highlights',
    info: { displayName: 'program-highlights' },
    attributes: {
      eyebrow: { type: 'string' },
      title: { type: 'string' },
      subtitle: { type: 'text' },
      programs: {
        type: 'relation',
        relation: 'manyToMany',
        target: 'api::program.program',
      },
    },
  },
  'src/components/blocks/stats.json': {
    collectionName: 'components_blocks_stats',
    info: { displayName: 'stats' },
    attributes: {
      eyebrow: { type: 'string' },
      title: { type: 'string' },
      subtitle: { type: 'text' },
      items: { type: 'component', repeatable: true, component: 'shared.stat-item' },
    },
  },
  'src/components/blocks/gallery.json': {
    collectionName: 'components_blocks_galleries',
    info: { displayName: 'gallery' },
    attributes: {
      eyebrow: { type: 'string' },
      title: { type: 'string' },
      subtitle: { type: 'text' },
      images: { type: 'media', multiple: true, allowedTypes: ['images'] },
    },
  },
};

const dzComponents = [
  'blocks.hero',
  'blocks.text-image',
  'blocks.card-grid',
  'blocks.feature-list',
  'blocks.testimonials',
  'blocks.logo-cloud',
  'blocks.ecosystem',
  'blocks.step-list',
  'blocks.faq',
  'blocks.rich-text',
  'blocks.contact-form',
  'blocks.program-highlights',
  'blocks.stats',
  'blocks.gallery',
];

const singleTypes = {
  'site-settings': {
    kind: 'singleType',
    collectionName: 'site_settings',
    info: {
      singularName: 'site-setting',
      pluralName: 'site-settings',
      displayName: 'Site Settings',
    },
    options: defaultOptions,
    attributes: {
      siteName: { type: 'string', required: true },
      siteTagline: { type: 'string' },
      siteDescription: { type: 'text' },
      logo: { type: 'media', multiple: false, allowedTypes: ['images'] },
      favicon: { type: 'media', multiple: false, allowedTypes: ['images'] },
      contactEmail: { type: 'email' },
      contactPhone: { type: 'string' },
      whatsappNumber: { type: 'string' },
      address: { type: 'text' },
      socialLinks: { type: 'component', repeatable: true, component: 'shared.social-link' },
      defaultSeo: { type: 'component', repeatable: false, component: 'shared.seo' },
      announcementBarText: { type: 'string' },
      announcementBarEnabled: { type: 'boolean', default: false },
    },
  },
  header: {
    kind: 'singleType',
    collectionName: 'headers',
    info: { singularName: 'header', pluralName: 'headers', displayName: 'Header' },
    options: defaultOptions,
    attributes: {
      logo: { type: 'media', multiple: false, allowedTypes: ['images'] },
      primaryNavigation: { type: 'component', repeatable: true, component: 'navigation.nav-item' },
      ctaLabel: { type: 'string' },
      ctaUrl: { type: 'string' },
      secondaryLinkLabel: { type: 'string' },
      secondaryLinkUrl: { type: 'string' },
    },
  },
  footer: {
    kind: 'singleType',
    collectionName: 'footers',
    info: { singularName: 'footer', pluralName: 'footers', displayName: 'Footer' },
    options: defaultOptions,
    attributes: {
      logo: { type: 'media', multiple: false, allowedTypes: ['images'] },
      footerNavigation: { type: 'component', repeatable: true, component: 'navigation.nav-item' },
      legalLinks: { type: 'component', repeatable: true, component: 'navigation.nav-item' },
      socialLinks: { type: 'component', repeatable: true, component: 'shared.social-link' },
      copyrightText: { type: 'string' },
      contactBlockTitle: { type: 'string' },
      contactBlockText: { type: 'text' },
    },
  },
  homepage: {
    kind: 'singleType',
    collectionName: 'homepages',
    info: { singularName: 'homepage', pluralName: 'homepages', displayName: 'Homepage' },
    options: defaultOptions,
    attributes: {
      title: { type: 'string', required: true },
      slug: { type: 'uid', targetField: 'title', required: true, default: 'home' },
      seo: { type: 'component', repeatable: false, component: 'shared.seo' },
      sections: { type: 'dynamiczone', components: dzComponents },
    },
  },
};

const collectionTypes = {
  page: {
    kind: 'collectionType',
    collectionName: 'pages',
    info: { singularName: 'page', pluralName: 'pages', displayName: 'Page' },
    options: defaultOptions,
    attributes: {
      title: { type: 'string', required: true },
      slug: { type: 'uid', targetField: 'title', required: true },
      pageType: {
        type: 'enumeration',
        enum: ['default', 'institutional', 'landing', 'contact', 'community', 'impact'],
        default: 'default',
      },
      excerpt: { type: 'text' },
      seo: { type: 'component', component: 'shared.seo', repeatable: false },
      hero: { type: 'component', component: 'blocks.hero', repeatable: false },
      sections: { type: 'dynamiczone', components: dzComponents },
      showInNavigation: { type: 'boolean', default: false },
      navigationLabel: { type: 'string' },
    },
  },
  program: {
    kind: 'collectionType',
    collectionName: 'programs',
    info: { singularName: 'program', pluralName: 'programs', displayName: 'Program' },
    options: defaultOptions,
    attributes: {
      title: { type: 'string', required: true },
      slug: { type: 'uid', targetField: 'title', required: true },
      shortDescription: { type: 'text' },
      longDescription: { type: 'richtext' },
      programType: {
        type: 'enumeration',
        enum: ['adultos', 'juniors', 'empresas', 'continuo', 'curso', 'servicio'],
      },
      modality: {
        type: 'enumeration',
        enum: ['online', 'presencial', 'hibrido'],
      },
      ageRange: { type: 'string' },
      durationText: { type: 'string' },
      scheduleText: { type: 'string' },
      classSizeText: { type: 'string' },
      ctaLabel: { type: 'string' },
      ctaUrl: { type: 'string' },
      featuredImage: { type: 'media', multiple: false, allowedTypes: ['images'] },
      gallery: { type: 'media', multiple: true, allowedTypes: ['images'] },
      benefits: { type: 'component', repeatable: true, component: 'shared.feature-item' },
      features: { type: 'component', repeatable: true, component: 'shared.feature-item' },
      certifications: {
        type: 'relation',
        relation: 'manyToMany',
        target: 'api::certification.certification',
        mappedBy: 'programs',
      },
      languages: {
        type: 'relation',
        relation: 'manyToMany',
        target: 'api::language.language',
        mappedBy: 'programs',
      },
      faqItems: {
        type: 'relation',
        relation: 'manyToMany',
        target: 'api::faq-item.faq-item',
        mappedBy: 'relatedPrograms',
      },
      testimonials: {
        type: 'relation',
        relation: 'manyToMany',
        target: 'api::testimonial.testimonial',
        mappedBy: 'relatedPrograms',
      },
      seo: { type: 'component', repeatable: false, component: 'shared.seo' },
      isFeatured: { type: 'boolean', default: false },
      displayOrder: { type: 'integer', default: 0 },
    },
  },
  language: {
    kind: 'collectionType',
    collectionName: 'languages',
    info: { singularName: 'language', pluralName: 'languages', displayName: 'Language' },
    options: defaultOptions,
    attributes: {
      name: { type: 'string', required: true },
      slug: { type: 'uid', targetField: 'name' },
      description: { type: 'text' },
      icon: { type: 'media', multiple: false, allowedTypes: ['images'] },
      programs: {
        type: 'relation',
        relation: 'manyToMany',
        target: 'api::program.program',
        inversedBy: 'languages',
      },
    },
  },
  certification: {
    kind: 'collectionType',
    collectionName: 'certifications',
    info: { singularName: 'certification', pluralName: 'certifications', displayName: 'Certification' },
    options: defaultOptions,
    attributes: {
      name: { type: 'string', required: true },
      slug: { type: 'uid', targetField: 'name' },
      description: { type: 'text' },
      issuer: { type: 'string' },
      logo: { type: 'media', multiple: false, allowedTypes: ['images'] },
      externalUrl: { type: 'string' },
      programs: {
        type: 'relation',
        relation: 'manyToMany',
        target: 'api::program.program',
        inversedBy: 'certifications',
      },
    },
  },
  testimonial: {
    kind: 'collectionType',
    collectionName: 'testimonials',
    info: { singularName: 'testimonial', pluralName: 'testimonials', displayName: 'Testimonial' },
    options: defaultOptions,
    attributes: {
      name: { type: 'string', required: true },
      role: { type: 'string' },
      location: { type: 'string' },
      quote: { type: 'text', required: true },
      fullStory: { type: 'richtext' },
      avatar: { type: 'media', multiple: false, allowedTypes: ['images'] },
      countryFlag: { type: 'media', multiple: false, allowedTypes: ['images'] },
      featured: { type: 'boolean', default: false },
      rating: { type: 'integer', min: 1, max: 5 },
      relatedPrograms: {
        type: 'relation',
        relation: 'manyToMany',
        target: 'api::program.program',
        inversedBy: 'testimonials',
      },
    },
  },
  'faq-item': {
    kind: 'collectionType',
    collectionName: 'faq_items',
    info: { singularName: 'faq-item', pluralName: 'faq-items', displayName: 'FAQ Item' },
    options: defaultOptions,
    attributes: {
      question: { type: 'string', required: true },
      answer: { type: 'richtext', required: true },
      category: {
        type: 'enumeration',
        enum: ['general', 'programas', 'pagos', 'horarios', 'metodologia', 'certificacion', 'empresas'],
        default: 'general',
      },
      relatedPrograms: {
        type: 'relation',
        relation: 'manyToMany',
        target: 'api::program.program',
        inversedBy: 'faqItems',
      },
      displayOrder: { type: 'integer', default: 0 },
      featured: { type: 'boolean', default: false },
    },
  },
  'blog-post': {
    kind: 'collectionType',
    collectionName: 'blog_posts',
    info: { singularName: 'blog-post', pluralName: 'blog-posts', displayName: 'Blog Post' },
    options: defaultOptions,
    attributes: {
      title: { type: 'string', required: true },
      slug: { type: 'uid', targetField: 'title', required: true },
      excerpt: { type: 'text' },
      coverImage: { type: 'media', multiple: false, allowedTypes: ['images'] },
      content: { type: 'richtext', required: true },
      authorName: { type: 'string' },
      category: { type: 'string' },
      tags: { type: 'json' },
      seo: { type: 'component', repeatable: false, component: 'shared.seo' },
      featured: { type: 'boolean', default: false },
    },
  },
  'news-article': {
    kind: 'collectionType',
    collectionName: 'news_articles',
    info: { singularName: 'news-article', pluralName: 'news-articles', displayName: 'News Article' },
    options: defaultOptions,
    attributes: {
      title: { type: 'string', required: true },
      slug: { type: 'uid', targetField: 'title', required: true },
      excerpt: { type: 'text' },
      coverImage: { type: 'media', multiple: false, allowedTypes: ['images'] },
      content: { type: 'richtext', required: true },
      publishedDate: { type: 'date' },
      seo: { type: 'component', repeatable: false, component: 'shared.seo' },
      featured: { type: 'boolean', default: false },
    },
  },
  'job-opening': {
    kind: 'collectionType',
    collectionName: 'job_openings',
    info: { singularName: 'job-opening', pluralName: 'job-openings', displayName: 'Job Opening' },
    options: defaultOptions,
    attributes: {
      title: { type: 'string', required: true },
      slug: { type: 'uid', targetField: 'title', required: true },
      department: { type: 'string' },
      modality: {
        type: 'enumeration',
        enum: ['remoto', 'presencial', 'hibrido'],
      },
      location: { type: 'string' },
      description: { type: 'richtext' },
      requirements: { type: 'richtext' },
      applyUrl: { type: 'string' },
      isActive: { type: 'boolean', default: true },
    },
  },
  'impact-initiative': {
    kind: 'collectionType',
    collectionName: 'impact_initiatives',
    info: {
      singularName: 'impact-initiative',
      pluralName: 'impact-initiatives',
      displayName: 'Impact Initiative',
    },
    options: defaultOptions,
    attributes: {
      title: { type: 'string', required: true },
      slug: { type: 'uid', targetField: 'title', required: true },
      summary: { type: 'text' },
      description: { type: 'richtext' },
      coverImage: { type: 'media', multiple: false, allowedTypes: ['images'] },
      ctaLabel: { type: 'string' },
      ctaUrl: { type: 'string' },
      featured: { type: 'boolean', default: false },
    },
  },
  'community-opportunity': {
    kind: 'collectionType',
    collectionName: 'community_opportunities',
    info: {
      singularName: 'community-opportunity',
      pluralName: 'community-opportunities',
      displayName: 'Community Opportunity',
    },
    options: defaultOptions,
    attributes: {
      title: { type: 'string', required: true },
      slug: { type: 'uid', targetField: 'title', required: true },
      summary: { type: 'text' },
      description: { type: 'richtext' },
      coverImage: { type: 'media', multiple: false, allowedTypes: ['images'] },
      ctaLabel: { type: 'string' },
      ctaUrl: { type: 'string' },
      featured: { type: 'boolean', default: false },
    },
  },
};

Object.entries(components).forEach(([p, d]) => writeJson(p, d));

const mkApiScaffold = (name, schema) => {
  const contentTypeFolder = schema.info?.singularName || name;
  writeJson(`src/api/${name}/content-types/${contentTypeFolder}/schema.json`, schema);
  const routePath = path.join(root, `src/api/${name}/routes/${contentTypeFolder}.ts`);
  const controllerPath = path.join(root, `src/api/${name}/controllers/${contentTypeFolder}.ts`);
  const servicePath = path.join(root, `src/api/${name}/services/${contentTypeFolder}.ts`);
  fs.mkdirSync(path.dirname(routePath), { recursive: true });
  fs.mkdirSync(path.dirname(controllerPath), { recursive: true });
  fs.mkdirSync(path.dirname(servicePath), { recursive: true });
  fs.writeFileSync(
    routePath,
    `/**\n * ${name} router\n */\n\nimport { factories } from '@strapi/strapi';\n\nexport default factories.createCoreRouter('api::${name}.${name}');\n`,
    'utf8'
  );
  fs.writeFileSync(
    controllerPath,
    `/**\n * ${name} controller\n */\n\nimport { factories } from '@strapi/strapi';\n\nexport default factories.createCoreController('api::${name}.${name}');\n`,
    'utf8'
  );
  fs.writeFileSync(
    servicePath,
    `/**\n * ${name} service\n */\n\nimport { factories } from '@strapi/strapi';\n\nexport default factories.createCoreService('api::${name}.${name}');\n`,
    'utf8'
  );
};

Object.entries(singleTypes).forEach(([name, schema]) => mkApiScaffold(name, schema));
Object.entries(collectionTypes).forEach(([name, schema]) => mkApiScaffold(name, schema));

console.log('Schemas generated');
