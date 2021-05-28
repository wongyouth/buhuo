import fp from 'fastify-plugin'
import {
  FastifyPluginCallback,
  FastifyRequest,
  preHandlerAsyncHookHandler,
} from 'fastify'
import { logger } from '../utils'

const ensureUser: preHandlerAsyncHookHandler = async (req, _reply) => {
  await req.jwtVerify()

  // TODO: load user
  // req.ctx.user = db.loadUser()

  req.ctx = {
    user: 'ryan',
  }

  logger.debug({ label: 'auth' }, 'ctx %o', req.ctx)

  if (req.user == null) throw Error('需要登录')
}

type PolicyFun = (
  user: string,
  req: FastifyRequest
) => boolean | Promise<boolean>

const verifyPolicy = (fn: PolicyFun) => {
  const preHandler: preHandlerAsyncHookHandler = async (req, reply) => {
    await ensureUser(req, reply)

    let result = fn(req.ctx.user, req)
    if (result instanceof Promise) {
      result = await result
    }

    logger.debug('authorize result: %o', result)

    if (!result) {
      reply.status(401)
      throw new Error('无权访问')
    }
  }

  return preHandler
}

declare module 'fastify' {
  interface FastifyInstance {
    ensureUser: preHandlerAsyncHookHandler
    authorize: (fn: PolicyFun) => preHandlerAsyncHookHandler
  }
}

const plugin: FastifyPluginCallback = (fastify, _opt, next) => {
  fastify.decorate('ensureUser', ensureUser)
  fastify.decorate('authorize', verifyPolicy)

  next()
}

export default fp(plugin, '3.x')
