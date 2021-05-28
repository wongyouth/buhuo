import { FastifyPluginCallback } from 'fastify'

const routes: FastifyPluginCallback = (fastify, _opts, next) => {
  fastify.get('/hello', (req, reply) => {
    console.log(req.user)
    reply.send('world')
  })

  fastify.get('/token', (req, reply) => {
    const user = { userId: 1 }
    const token = fastify.jwt.sign(user)
    reply.send({ token })
  })

  fastify.get(
    '/signin',
    {
      preHandler: fastify.ensureUser,
    },
    async (req, reply) => {
      return 'ok'
    }
  )

  fastify.get(
    '/deny',
    {
      preHandler: fastify.authorize(() => false),
    },
    async (req, reply) => {
      return 'ok'
    }
  )

  fastify.get(
    '/pass',
    {
      preHandler: fastify.authorize(() => true),
    },
    async (req, reply) => {
      return 'ok'
    }
  )

  next()
}

export default routes
