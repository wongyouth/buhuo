import { server } from '../src/server'

export * as utils from '../src/utils'
// export * as factory from './factory'

import { prisma, command, logger, env, redis } from '../src/utils'
import { request } from './support'

export let get: ReturnType<typeof request.get>
export let post: ReturnType<typeof request.post>

logger.debug('env: %j', env)

beforeAll(async () => {
  const url: string = await server.listen(0) // Random port

  get = request.get(url)
  post = request.post(url)

  await Promise.all([prepareRedis(), prepareDB()])
})

afterAll(async () => {
  redis.client.quit()
  server.close()
  prisma.$disconnect()
})

function prepareRedis() {
  return redis.flushdb()
}

async function prepareDB() {
  // 设置环境变量，否则 prisma 会启用 .env 文件中的值
  const url = env.DATABASE_URL
  await command(
    `DATABASE_URL=${url} npx prisma db push --preview-feature --accept-data-loss`
  )

  await cleanupDatabase()
}

function cleanupDatabase() {
  // truncate all tables (此方法只适用于 PostgreSQL)
  return prisma.$executeRaw(`
    do
    $$
    declare
      l_stmt text;
    begin
      SELECT 'TRUNCATE ' || string_agg(format('%I.%I', schemaname, tablename), ', ')
      || ' RESTART IDENTITY CASCADE'
      INTO l_stmt FROM pg_tables
      WHERE schemaname IN ('public');
      EXECUTE l_stmt;
    end;
    $$
  `)
}
