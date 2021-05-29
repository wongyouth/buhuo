import { promisify } from 'util'
import { createClient } from 'redis'
import { REDIS_URL, REDIS_PREFIX } from './env'

export const client = createClient({
  url: REDIS_URL,
  prefix: REDIS_PREFIX,
})

// Promise redis will comming in v4
export const get = promisify(client.get).bind(client)
export const setex = promisify(client.setex).bind(client)
export const flushdb = promisify(client.flushdb).bind(client)
