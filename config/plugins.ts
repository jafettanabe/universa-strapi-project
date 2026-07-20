import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
  graphql: {
    config: {
      endpoint: '/graphql',
      shadowCRUD: true,
      depthLimit: 10,
      amountLimit: 100,
      // En desarrollo mostramos GraphQL landing/sandbox; en producción lo puedes desactivar.
      landingPage: (strapiEnv) => strapiEnv !== 'production',
    },
  },
  upload: {
    config: env('CLOUDINARY_KEY')
      ? {
          provider: 'cloudinary',
          providerOptions: {
            cloud_name: env('CLOUDINARY_NAME'),
            api_key: env('CLOUDINARY_KEY'),
            api_secret: env('CLOUDINARY_SECRET'),
          },
          actionOptions: {
            upload: {},
            uploadStream: {},
            delete: {},
          },
        }
      : undefined,
  },
});

export default config;
