const { Client } = require('pg');
const crypto = require('crypto');

async function grantPermissions() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'strapi',
    user: 'postgres',
    password: process.env.PGPASSWORD || 'Argos177',
  });

  await client.connect();

  const apis = [
    'blog-post',
    'certification',
    'community-opportunity',
    'faq-item',
    'footer',
    'header',
    'homepage',
    'impact-initiative',
    'job-opening',
    'language',
    'news-article',
    'page',
    'placement-submission',
    'program',
    'scheduled-class',
    'site-settings',
    'taller',
    'testimonial'
  ];

  // Public Role ID is 8
  const publicRoleId = 8;

  for (const api of apis) {
    const actions = [`api::${api}.${api}.find`, `api::${api}.${api}.findOne`];
    for (const action of actions) {
      // Check if permission already exists
      const existing = await client.query('SELECT id FROM up_permissions WHERE action = $1', [action]);
      let permId;
      if (existing.rows.length === 0) {
        const docId = 'perm-' + crypto.randomBytes(8).toString('hex');
        const inserted = await client.query(
          `INSERT INTO up_permissions (document_id, action, created_at, updated_at, published_at)
           VALUES ($1, $2, NOW(), NOW(), NOW()) RETURNING id`,
          [docId, action]
        );
        permId = inserted.rows[0].id;
      } else {
        permId = existing.rows[0].id;
      }

      // Check if linked to public role
      const linkCheck = await client.query(
        `SELECT id FROM up_permissions_role_lnk WHERE permission_id = $1 AND role_id = $2`,
        [permId, publicRoleId]
      );
      if (linkCheck.rows.length === 0) {
        await client.query(
          `INSERT INTO up_permissions_role_lnk (permission_id, role_id) VALUES ($1, $2)`,
          [permId, publicRoleId]
        );
      }
    }
  }

  // Set API token hash for STRAPI_AUTH_TOKEN
  const tokenInEnv = '159ce2cd3b7e45c27701b43d07eb2714a15fea2af557367d8fc0f02db78e815b55902f4ec20f8cdcafc3c1368bb3814168f6871486d8f038743ee9970370b869744d1f3577496d71d7251179fc4f15779a7facc71b0a0fa64a334cf1daeb40793e006c649d8ca86f92df2d177f51032cc1e00d229757777fc3691766746ee0a4';
  const hashed = crypto.createHash('sha512').update(tokenInEnv).digest('hex');

  await client.query(
    `UPDATE strapi_api_tokens SET access_key = $1 WHERE id = 2`,
    [hashed]
  );

  console.log('Public permissions & API tokens successfully granted and configured!');
  await client.end();
}

grantPermissions().catch(console.error);
