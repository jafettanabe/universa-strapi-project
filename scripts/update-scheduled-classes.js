const { Client } = require('pg');

async function run() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'strapi',
    user: 'postgres',
    password: 'Argos177',
  });

  await client.connect();

  await client.query('UPDATE scheduled_classes SET title = $1, level = $2 WHERE document_id = $3', ['Virtual Coffee', 'Básico', 'l3fdb0es7w4ne4zl80ye65dp']);
  await client.query('UPDATE scheduled_classes SET title = $1, level = $2 WHERE document_id = $3', ['Podcast Breakdown', 'Intermedio', 'yg6j0nd936vg6qq3aznulzwz']);
  await client.query('UPDATE scheduled_classes SET title = $1, level = $2 WHERE document_id = $3', ['Welcome', 'Básico', 'vjw8ndbzqkjmcxu6ah2y6goo']);
  await client.query('UPDATE scheduled_classes SET title = $1, level = $2 WHERE document_id = $3', ['M-1', 'Avanzado', 'vpwaygai80o03uwrfpzzfs2a']);

  console.log('Database rows updated successfully with titles and levels!');
  await client.end();
}

run().catch(console.error);
