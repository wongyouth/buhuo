import fp from 'fastify-plugin'
import { FastifyPluginCallback } from 'fastify'
import jwt from 'fastify-jwt'
import { JWT_SECRET } from '../env'

declare module 'fastify-jwt' {
  interface FastifyJWT {
    payload: { userId: number }
    user: { id: number }
  }
}

const plugin: FastifyPluginCallback = (fastify, _opt, done) => {
  fastify.register(jwt, {
    secret: JWT_SECRET,
    formatUser: (o) => ({
      id: o.userId,
    }),
  })

  done()
}

export default fp(plugin)
