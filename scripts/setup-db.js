const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

function stripDbCommands(sql) {
  return sql
    .split('\n')
    .filter((line) => {
      const trimmed = line.trim().toUpperCase();
      return (
        !trimmed.startsWith('DROP DATABASE') &&
        !trimmed.startsWith('CREATE DATABASE') &&
        !trimmed.startsWith('USE ')
      );
    })
    .join('\n');
}

async function runStatements(connection, sql) {
  const statements = sql
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean);

  for (const statement of statements) {
    await connection.query(statement);
  }
}

async function setup() {
  const config = process.env.DATABASE_URL
    ? { uri: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }
    : {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl:
          process.env.DB_SSL === 'false'
            ? undefined
            : { rejectUnauthorized: false },
      };

  const connection = await mysql.createConnection(config);

  const [tables] = await connection.query("SHOW TABLES LIKE 'products'");
  if (tables.length === 0) {
    const schema = stripDbCommands(
      fs.readFileSync(
        path.join(__dirname, '../db-setup/migrations9.sql'),
        'utf8'
      )
    );
    await runStatements(connection, schema);
    console.log('Schema created.');
  } else {
    console.log('Schema already exists, skipping tables.');
  }

  const [[{ n }]] = await connection.query(
    'SELECT COUNT(*) AS n FROM products'
  );
  if (Number(n) === 0) {
    const seed = stripDbCommands(
      fs.readFileSync(path.join(__dirname, '../db-setup/seeders.sql'), 'utf8')
    );
    await runStatements(connection, seed);
    console.log('Seed data loaded.');
  } else {
    console.log('Products already present, skipping seed.');
  }

  await connection.end();
  console.log('Database setup finished.');
}

setup().catch((error) => {
  console.error(error);
  process.exit(1);
});
