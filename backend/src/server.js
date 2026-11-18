const config = require('./config/env');
const app = require('./app');
const prisma = require('./db/prisma');

const server = app.listen(config.PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${config.PORT} (${config.NODE_ENV})`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM recebido, encerrando...');
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
});
