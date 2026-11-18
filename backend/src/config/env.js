const { z } = require('zod');


const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),


  CORS_ORIGINS: z
    .string()
    .min(1)
    .transform((value) => value.split(',').map((origin) => origin.trim())),


  TRUST_PROXY_HOPS: z.coerce.number().int().min(0).default(0),


  DATABASE_URL: z
    .string()
    .regex(/^postgres(ql)?:\/\//, 'precisa começar com postgresql://'),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error('Variáveis de ambiente inválidas:\n' + z.prettifyError(parsed.error));
  process.exit(1);
}

module.exports = Object.freeze(parsed.data);
