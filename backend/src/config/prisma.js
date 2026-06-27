const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');

let prisma;

// Senior Dev Best Practice: Prevent multiple PrismaClient instances in dev hot-reloads
if (process.env.NODE_ENV === 'production') {
  const adapter = new PrismaMariaDb({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'inventory_db',
    ssl: process.env.DB_HOST !== 'localhost' ? { rejectUnauthorized: true } : false,
  });
  prisma = new PrismaClient({ adapter });
} else {
  if (!global.prismaInstance) {
    const adapter = new PrismaMariaDb({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'inventory_db',
      ssl: process.env.DB_HOST !== 'localhost' ? { rejectUnauthorized: true } : false,
    });
    global.prismaInstance = new PrismaClient({ adapter });
  }
  prisma = global.prismaInstance;
}

module.exports = prisma;
