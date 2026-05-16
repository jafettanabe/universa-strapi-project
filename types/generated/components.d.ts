import type { Schema, Struct } from '@strapi/strapi';

export interface BlocksCardGrid extends Struct.ComponentSchema {
  collectionName: 'components_blocks_card_grids';
  info: {
    displayName: 'card-grid';
  };
  attributes: {
    eyebrow: Schema.Attribute.String;
    items: Schema.Attribute.Component<'blocks.card-grid-item', true>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface BlocksCardGridItem extends Struct.ComponentSchema {
  collectionName: 'components_blocks_card_grid_items';
  info: {
    displayName: 'card-grid-item';
  };
  attributes: {
    ctaLabel: Schema.Attribute.String;
    ctaUrl: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksCertifications extends Struct.ComponentSchema {
  collectionName: 'components_blocks_certifications';
  info: {
    displayName: 'certifications';
  };
  attributes: {
    body: Schema.Attribute.Text;
    certifications: Schema.Attribute.Relation<
      'oneToMany',
      'api::certification.certification'
    >;
    eyebrow: Schema.Attribute.String;
    primaryCta: Schema.Attribute.Component<'shared.cta', false>;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksContactForm extends Struct.ComponentSchema {
  collectionName: 'components_blocks_contact_forms';
  info: {
    displayName: 'contact-form';
  };
  attributes: {
    eyebrow: Schema.Attribute.String;
    subjectOptions: Schema.Attribute.JSON;
    subtitle: Schema.Attribute.Text;
    successMessage: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface BlocksCtaBanner extends Struct.ComponentSchema {
  collectionName: 'components_blocks_cta_banners';
  info: {
    displayName: 'cta-banner';
  };
  attributes: {
    backgroundImage: Schema.Attribute.Media<'images'>;
    eyebrow: Schema.Attribute.String;
    overlayStrength: Schema.Attribute.Enumeration<
      ['light', 'medium', 'strong']
    > &
      Schema.Attribute.DefaultTo<'medium'>;
    primaryCta: Schema.Attribute.Component<'shared.cta', false>;
    secondaryCta: Schema.Attribute.Component<'shared.cta', false>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksEcosystem extends Struct.ComponentSchema {
  collectionName: 'components_blocks_ecosystems';
  info: {
    displayName: 'ecosystem';
  };
  attributes: {
    eyebrow: Schema.Attribute.String;
    items: Schema.Attribute.Component<'blocks.ecosystem-item', true>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface BlocksEcosystemItem extends Struct.ComponentSchema {
  collectionName: 'components_blocks_ecosystem_items';
  info: {
    displayName: 'ecosystem-item';
  };
  attributes: {
    ctaLabel: Schema.Attribute.String;
    ctaUrl: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
    phase: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksFaq extends Struct.ComponentSchema {
  collectionName: 'components_blocks_faqs';
  info: {
    displayName: 'faq';
  };
  attributes: {
    eyebrow: Schema.Attribute.String;
    faqItems: Schema.Attribute.Relation<'manyToMany', 'api::faq-item.faq-item'>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface BlocksFeatureList extends Struct.ComponentSchema {
  collectionName: 'components_blocks_feature_lists';
  info: {
    displayName: 'feature-list';
  };
  attributes: {
    columns: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<3>;
    eyebrow: Schema.Attribute.String;
    items: Schema.Attribute.Component<'shared.feature-item', true>;
    layout: Schema.Attribute.Enumeration<
      ['standard', 'split-left', 'split-right']
    > &
      Schema.Attribute.DefaultTo<'standard'>;
    primaryCta: Schema.Attribute.Component<'shared.cta', false>;
    sideImage: Schema.Attribute.Media<'images'>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface BlocksGallery extends Struct.ComponentSchema {
  collectionName: 'components_blocks_galleries';
  info: {
    displayName: 'gallery';
  };
  attributes: {
    eyebrow: Schema.Attribute.String;
    images: Schema.Attribute.Media<'images', true>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface BlocksHero extends Struct.ComponentSchema {
  collectionName: 'components_blocks_heroes';
  info: {
    displayName: 'hero';
  };
  attributes: {
    alignment: Schema.Attribute.Enumeration<['left', 'center', 'right']> &
      Schema.Attribute.DefaultTo<'left'>;
    backgroundImage: Schema.Attribute.Media<'images'>;
    eyebrow: Schema.Attribute.String;
    foregroundImage: Schema.Attribute.Media<'images'>;
    primaryCta: Schema.Attribute.Component<'shared.cta', false>;
    secondaryCta: Schema.Attribute.Component<'shared.cta', false>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    variant: Schema.Attribute.Enumeration<
      [
        'default',
        'gradient_organic',
        'full_bleed_cta',
        'image_background',
        'quote_strip',
      ]
    > &
      Schema.Attribute.DefaultTo<'default'>;
    videoLabel: Schema.Attribute.String;
    videoUrl: Schema.Attribute.String;
  };
}

export interface BlocksHeroCarousel extends Struct.ComponentSchema {
  collectionName: 'components_blocks_hero_carousels';
  info: {
    displayName: 'hero-carousel';
  };
  attributes: {
    autoplayMs: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<5500>;
    slides: Schema.Attribute.Component<'blocks.hero-slide', true> &
      Schema.Attribute.Required;
  };
}

export interface BlocksHeroSlide extends Struct.ComponentSchema {
  collectionName: 'components_blocks_hero_slides';
  info: {
    displayName: 'hero-slide';
  };
  attributes: {
    accentLabel: Schema.Attribute.String;
    accentTitle: Schema.Attribute.String;
    bgColor: Schema.Attribute.String;
    foregroundImage: Schema.Attribute.Media<'images'>;
    foregroundImageFocus: Schema.Attribute.String;
    pillCta: Schema.Attribute.Component<'shared.cta', false>;
    pillLabel: Schema.Attribute.String;
    priceBadgeText: Schema.Attribute.String;
    priceCta: Schema.Attribute.Component<'shared.cta', false>;
    priceSuffix: Schema.Attribute.String;
    priceValue: Schema.Attribute.String;
    primaryCta: Schema.Attribute.Component<'shared.cta', false>;
    subtitle: Schema.Attribute.Text;
    textTone: Schema.Attribute.Enumeration<['dark', 'light']> &
      Schema.Attribute.DefaultTo<'light'>;
    title: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface BlocksLogoCloud extends Struct.ComponentSchema {
  collectionName: 'components_blocks_logo_clouds';
  info: {
    displayName: 'logo-cloud';
  };
  attributes: {
    eyebrow: Schema.Attribute.String;
    logos: Schema.Attribute.Media<'images', true>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface BlocksProgramHighlights extends Struct.ComponentSchema {
  collectionName: 'components_blocks_program_highlights';
  info: {
    displayName: 'program-highlights';
  };
  attributes: {
    eyebrow: Schema.Attribute.String;
    programs: Schema.Attribute.Relation<'manyToMany', 'api::program.program'>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface BlocksQuote extends Struct.ComponentSchema {
  collectionName: 'components_blocks_quotes';
  info: {
    displayName: 'quote';
  };
  attributes: {
    attribution: Schema.Attribute.String;
    eyebrow: Schema.Attribute.String;
    quote: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface BlocksRichText extends Struct.ComponentSchema {
  collectionName: 'components_blocks_rich_texts';
  info: {
    displayName: 'rich-text';
  };
  attributes: {
    content: Schema.Attribute.RichText;
    eyebrow: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface BlocksStats extends Struct.ComponentSchema {
  collectionName: 'components_blocks_stats';
  info: {
    displayName: 'stats';
  };
  attributes: {
    eyebrow: Schema.Attribute.String;
    items: Schema.Attribute.Component<'shared.stat-item', true>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface BlocksStepItem extends Struct.ComponentSchema {
  collectionName: 'components_blocks_step_items';
  info: {
    displayName: 'step-item';
  };
  attributes: {
    description: Schema.Attribute.Text;
    iconName: Schema.Attribute.String;
    stepNumber: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksStepList extends Struct.ComponentSchema {
  collectionName: 'components_blocks_step_lists';
  info: {
    displayName: 'step-list';
  };
  attributes: {
    cta: Schema.Attribute.Component<'shared.cta', false>;
    eyebrow: Schema.Attribute.String;
    layout: Schema.Attribute.Enumeration<['vertical', 'horizontal']> &
      Schema.Attribute.DefaultTo<'vertical'>;
    steps: Schema.Attribute.Component<'blocks.step-item', true>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface BlocksTestimonials extends Struct.ComponentSchema {
  collectionName: 'components_blocks_testimonials';
  info: {
    displayName: 'testimonials';
  };
  attributes: {
    eyebrow: Schema.Attribute.String;
    subtitle: Schema.Attribute.Text;
    testimonials: Schema.Attribute.Relation<
      'manyToMany',
      'api::testimonial.testimonial'
    >;
    title: Schema.Attribute.String;
  };
}

export interface BlocksTextImage extends Struct.ComponentSchema {
  collectionName: 'components_blocks_text_images';
  info: {
    displayName: 'text-image';
  };
  attributes: {
    body: Schema.Attribute.RichText;
    cta: Schema.Attribute.Component<'shared.cta', false>;
    eyebrow: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    imagePosition: Schema.Attribute.Enumeration<['left', 'right']> &
      Schema.Attribute.DefaultTo<'right'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksVideoCta extends Struct.ComponentSchema {
  collectionName: 'components_blocks_video_ctas';
  info: {
    displayName: 'video-cta';
  };
  attributes: {
    bgColor: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#EEF3F9'>;
    posterImage: Schema.Attribute.Media<'images'>;
    primaryCta: Schema.Attribute.Component<'shared.cta', false>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    videoUrl: Schema.Attribute.String;
  };
}

export interface NavigationNavItem extends Struct.ComponentSchema {
  collectionName: 'components_navigation_nav_items';
  info: {
    displayName: 'nav-item';
  };
  attributes: {
    children: Schema.Attribute.Component<'navigation.sub-nav-item', true>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    openInNewTab: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    url: Schema.Attribute.String;
  };
}

export interface NavigationSubNavItem extends Struct.ComponentSchema {
  collectionName: 'components_navigation_sub_nav_items';
  info: {
    displayName: 'sub-nav-item';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    openInNewTab: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    url: Schema.Attribute.String;
  };
}

export interface SharedCta extends Struct.ComponentSchema {
  collectionName: 'components_shared_ctas';
  info: {
    displayName: 'cta';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    style: Schema.Attribute.Enumeration<['primary', 'secondary', 'ghost']> &
      Schema.Attribute.DefaultTo<'primary'>;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedFeatureItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_feature_items';
  info: {
    displayName: 'feature-item';
  };
  attributes: {
    description: Schema.Attribute.Text;
    iconName: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: 'Reusable SEO fields';
    displayName: 'seo';
  };
  attributes: {
    canonicalUrl: Schema.Attribute.String;
    metaDescription: Schema.Attribute.Text;
    metaImage: Schema.Attribute.Media<'images'>;
    metaTitle: Schema.Attribute.String;
    noIndex: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
  };
}

export interface SharedSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_social_links';
  info: {
    displayName: 'social-link';
  };
  attributes: {
    label: Schema.Attribute.String;
    platform: Schema.Attribute.Enumeration<
      [
        'facebook',
        'instagram',
        'linkedin',
        'youtube',
        'tiktok',
        'whatsapp',
        'x',
        'other',
      ]
    >;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedStatItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_stat_items';
  info: {
    displayName: 'stat-item';
  };
  attributes: {
    description: Schema.Attribute.String;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'blocks.card-grid': BlocksCardGrid;
      'blocks.card-grid-item': BlocksCardGridItem;
      'blocks.certifications': BlocksCertifications;
      'blocks.contact-form': BlocksContactForm;
      'blocks.cta-banner': BlocksCtaBanner;
      'blocks.ecosystem': BlocksEcosystem;
      'blocks.ecosystem-item': BlocksEcosystemItem;
      'blocks.faq': BlocksFaq;
      'blocks.feature-list': BlocksFeatureList;
      'blocks.gallery': BlocksGallery;
      'blocks.hero': BlocksHero;
      'blocks.hero-carousel': BlocksHeroCarousel;
      'blocks.hero-slide': BlocksHeroSlide;
      'blocks.logo-cloud': BlocksLogoCloud;
      'blocks.program-highlights': BlocksProgramHighlights;
      'blocks.quote': BlocksQuote;
      'blocks.rich-text': BlocksRichText;
      'blocks.stats': BlocksStats;
      'blocks.step-item': BlocksStepItem;
      'blocks.step-list': BlocksStepList;
      'blocks.testimonials': BlocksTestimonials;
      'blocks.text-image': BlocksTextImage;
      'blocks.video-cta': BlocksVideoCta;
      'navigation.nav-item': NavigationNavItem;
      'navigation.sub-nav-item': NavigationSubNavItem;
      'shared.cta': SharedCta;
      'shared.feature-item': SharedFeatureItem;
      'shared.seo': SharedSeo;
      'shared.social-link': SharedSocialLink;
      'shared.stat-item': SharedStatItem;
    }
  }
}
