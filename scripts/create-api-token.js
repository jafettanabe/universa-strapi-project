require('dotenv').config();
const path = require('path');
const { createStrapi } = require('@strapi/strapi');

async function main() {
  const distDir = path.resolve(__dirname, '../dist');
  const app = await createStrapi({ distDir }).load();
  
  const tokenService = app.service('admin::api-token');
  
  const newToken = await tokenService.create({
    name: 'Portal Dev Token ' + Date.now(),
    description: 'Token for portal development',
    type: 'full-access',
  });

  console.log('--- NEW API TOKEN CREATED ---');
  console.log('ACCESS_KEY:', newToken.accessKey);
  console.log('-----------------------------');
  
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
