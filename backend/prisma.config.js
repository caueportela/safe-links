const { defineConfig } = require('prisma/config');

try {
  process.loadEnvFile('.env');
} catch {
 
}

module.exports = defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
