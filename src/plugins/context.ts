import fp from 'fastify-plugin'
import { FastifyPluginCallback } from 'fastify'

type User = string

type Context = {
  user: User
}
declare module 'fastify' {
  interface FastifyRequest {
    ctx: Context
  }
}

const plugin: FastifyPluginCallback = (fastify, options, next) => {
  fastify.decorateRequest('ctx', null)

  next()
}

export default fp(plugin, '3.x')
