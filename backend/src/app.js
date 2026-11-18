const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const { rateLimit } = require('express-rate-limit');
const config = require('./config/env');

const app = express();


app.disable('x-powered-by');
app.set('trust proxy', config.TRUST_PROXY_HOPS);

app.use(helmet());
app.use(
  cors({
    origin: config.CORS_ORIGINS,
    methods: ['GET', 'POST'],
  }),
);


app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});


app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, 
    limit: 100, 
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: 'Muitas requisições, tente novamente mais tarde' },
  }),
);


app.use(express.json({ limit: '10kb' }));


app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});


app.use((err, req, res, next) => {
  console.error(err);

  const status = err.status || err.statusCode || 500;
  const message = status < 500 ? err.message : 'Erro interno do servidor';

  res.status(status).json({ error: message });
});

module.exports = app;
