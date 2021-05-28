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
    sign: { expiresIn: '90d' },
    messages: {
      badRequestErrorMessage: 'Format is Authorization: Bearer [token]',
      noAuthorizationInHeaderMessage: '未提供访问令牌',
      authorizationTokenExpiredMessage: '验证令牌已过期',
      authorizationTokenInvalid: (err) => `验证令牌无效: ${err.message}`,
      authorizationTokenUntrusted: 'Untrusted authorization token',
    },
  })

  done()
}

export default fp(plugin, '3.x')
