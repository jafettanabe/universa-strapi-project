import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Server => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 3001),
  app: {
    keys: env.array('APP_KEYS'),
  },
  // STRAPI_DISABLE_REMOTE_DATA_TRANSFER está deprecado en Strapi 5; usar transfer.remote.enabled.
  transfer: {
    remote: {
      enabled: env.bool('TRANSFER_REMOTE_ENABLED', true),
    },
  },
});

export default config;
