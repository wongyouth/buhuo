import { config } from 'dotenv-flow'
config()

import fastify from 'fastify'
import printRoutes from 'fastify-print-routes'
import autoload from 'fastify-autoload'
import { logger, isDev } from './utils'

export const server = fastify({ logger })

if (isDev) server.register(printRoutes)

server.register(autoload, {
  dir: __dirname + '/plugins',
})

server.register(autoload, {
  dir: __dirname + '/routes',
})

// server.addHook('onRequest', (req, reply, next) => {
//   logger.debug('on Request: %o', req.body as string)
// })
