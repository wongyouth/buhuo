import { PrismaClient, User } from '@prisma/client'
import { logger } from './logger'
import { DATABASE_URL } from './env'

export const prisma = new PrismaClient({
  datasources: { db: { url: DATABASE_URL } },
  log: [
    {
      level: 'query',
      emit: 'event',
    },
    {
      level: 'info',
      emit: 'event',
    },
    'warn',
    'error',
  ],
})

prisma.$on('query', (e) => {
  const message = `${e.query} ${e.params} ${e.duration}ms`
  logger.debug({ label: 'query' }, message)
})

prisma.$on('info', (e) => {
  logger.debug({ label: 'prisma' }, e.message)
})
