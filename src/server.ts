import { config } from 'dotenv-flow'
config()

import fastify from 'fastify'
import autoload from 'fastify-autoload'
// import routes from './routes'
import { logger } from './utils'

export const server = fastify({ logger })

server.register(autoload, {
  dir: __dirname + '/plugins',
})

server.register(autoload, {
  dir: __dirname + '/routes',
})

// server.addHook('onRequest', (req, reply, next) => {
//   logger.debug('on Request: %o', req.body as string)
// })
