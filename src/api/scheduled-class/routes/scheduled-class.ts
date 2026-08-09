import { factories } from '@strapi/strapi';

const defaultRouter = factories.createCoreRouter('api::scheduled-class.scheduled-class');

const customRouter = (innerRouter: any, extraRoutes = []) => {
  let routes: any[];
  return {
    get prefix() { return innerRouter.prefix; },
    get routes() {
      if (!routes) routes = innerRouter.routes.concat(extraRoutes);
      return routes;
    },
  };
};

const myExtraRoutes = [
  {
    method: 'POST',
    path: '/scheduled-classes/import',
    handler: 'api::scheduled-class.scheduled-class.importClasses',
    config: {
      auth: false,
      policies: [],
      middlewares: [],
    },
  },
];

export default customRouter(defaultRouter, myExtraRoutes);
