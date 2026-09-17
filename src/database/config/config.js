function sslOptions() {
  if (process.env.DB_SSL === 'false') {
    return undefined;
  }
  return { rejectUnauthorized: false };
}

const production = process.env.DATABASE_URL
  ? {
      use_env_variable: 'DATABASE_URL',
      dialect: 'mysql',
      dialectOptions: {
        ssl: sslOptions(),
      },
    }
  : {
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 3306,
      dialect: 'mysql',
      dialectOptions: {
        ssl: sslOptions(),
      },
    };

module.exports = {
  development: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME || 'grupo_13',
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
  },
  production,
};
