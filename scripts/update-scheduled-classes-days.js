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

  await client.query('ALTER TABLE scheduled_classes ADD COLUMN IF NOT EXISTS day varchar(255);');

  await client.query('UPDATE scheduled_classes SET day = $1 WHERE document_id = $2', ['Lunes', 'l3fdb0es7w4ne4zl80ye65dp']);
  await client.query('UPDATE scheduled_classes SET day = $1 WHERE document_id = $2', ['Martes', 'yg6j0nd936vg6qq3aznulzwz']);
  await client.query('UPDATE scheduled_classes SET day = $1 WHERE document_id = $2', ['Sábado', 'vjw8ndbzqkjmcxu6ah2y6goo']);
  await client.query('UPDATE scheduled_classes SET day = $1 WHERE document_id = $2', ['Viernes', 'vpwaygai80o03uwrfpzzfs2a']);

  console.log('Database updated successfully with day column and sample days!');
  await client.end();
}

run().catch(console.error);
