import { config } from 'dotenv-flow'
config()

import fastify from 'fastify'
import autoload from 'fastify-autoload'
import routes from './routes'
import { logger } from './utils'

export const server = fastify({ logger })

server.register(autoload, {
  dir: __dirname + '/plugins',
})

server.register(routes)
