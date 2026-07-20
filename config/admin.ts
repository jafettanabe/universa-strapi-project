import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Admin => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  secrets: {
    encryptionKey: env('ENCRYPTION_KEY'),
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
  preview: {
    enabled: true,
    config: {
      allowedOrigins: [env('CLIENT_URL', 'http://localhost:3000')],
      async handler(uid, { documentId, locale, status }) {
        const clientUrl = env('CLIENT_URL', 'http://localhost:3000');
        if (uid === 'api::page.page') {
          return `${clientUrl}/pages/${documentId}`;
        }
        if (uid === 'api::homepage.homepage') {
          return `${clientUrl}/`;
        }
        if (uid === 'api::blog-post.blog-post') {
          const entry = await strapi.documents('api::blog-post.blog-post').findOne({
            documentId,
          });
          if (entry && entry.slug) {
            return `${clientUrl}/blog/${entry.slug}?status=${status}`;
          }
        }
        return null;
      },
    },
  },
});

export default config;
