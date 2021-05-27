import { config } from 'dotenv-flow'
config()

import fastify from 'fastify'
import jwt from './plugins/jwt'

export const server = fastify({ logger: true })

server.register(jwt)

type Context = {
  currentUser: string
}
declare module 'fastify' {
  interface FastifyRequest {
    ctx: Context
  }
}

server.decorateRequest('ctx', null)

const user = { userId: 12 }

server.get('/hello', (req, reply) => {
  console.log(req.ctx)
  reply.send('world')
})

server.get('/signIn', (req, reply) => {
  const token = server.jwt.sign(user)
  reply.send({ token })
})

server.get('/auth', async (req, reply) => {
  await req.jwtVerify()
  console.log(req.user)
  reply.send('ok')
})
