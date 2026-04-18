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
});

export default config;
