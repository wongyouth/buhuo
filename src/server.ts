import { config } from 'dotenv-flow'
config()

import fastify from 'fastify'
import autoload from 'fastify-autoload'
import routes from './routes'

export const server = fastify({ logger: true })

server.register(autoload, {
  dir: __dirname + '/plugins',
})

server.register(routes)
