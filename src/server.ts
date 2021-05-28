import { config } from 'dotenv-flow'
config()

import fastify from 'fastify'
import autoload from 'fastify-autoload'

export const server = fastify({ logger: true })

server.register(autoload, {
  dir: __dirname + '/plugins',
})

type User = string

type Context = {
  user: User
}
declare module 'fastify' {
  interface FastifyRequest {
    ctx: Context
  }
}

server.decorateRequest('ctx', null)

const user = { userId: 12 }

server.after(routes)

function routes() {
  server.get('/hello', (req, reply) => {
    console.log(req.user)
    reply.send('world')
  })

  server.get('/token', (req, reply) => {
    const token = server.jwt.sign(user)
    reply.send({ token })
  })

  server.get(
    '/signin',
    {
      preHandler: server.ensureUser,
    },
    async (req, reply) => {
      return 'ok'
    }
  )

  server.get(
    '/deny',
    {
      preHandler: server.authorize(() => false),
    },
    async (req, reply) => {
      return 'ok'
    }
  )

  server.get(
    '/pass',
    {
      preHandler: server.authorize(() => true),
    },
    async (req, reply) => {
      return 'ok'
    }
  )
}
