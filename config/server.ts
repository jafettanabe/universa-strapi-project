import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Server => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 3001),
  app: {
    keys: env.array('APP_KEYS'),
  },
  // Transferencias remotas (strapi transfer): en Strapi 5 se controla aquí, no con STRAPI_DISABLE_REMOTE_DATA_TRANSFER.
  transfer: {
    remote: {
      enabled: true,
    },
  },
});

export default config;
