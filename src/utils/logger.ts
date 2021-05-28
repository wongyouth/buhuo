import pino from 'pino'
import { isProd } from './misc'
import { LOG_LEVEL } from './env'

const prettyPrint = isProd
  ? false
  : {
      translateTime: 'SYS:standard', // local time
      ignore: 'hostname',
    }

export const logger = pino({
  level: LOG_LEVEL,
  prettyPrint,
})
export type Logger = typeof logger
