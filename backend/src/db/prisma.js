const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const config = require('../config/env');

const adapter = new PrismaPg({ connectionString: config.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
module.exports = prisma;
