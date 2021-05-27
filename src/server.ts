import fastify from 'fastify'

export const server = fastify({ logger: true })

type Context = {
  currentUser: string
}
declare module 'fastify' {
  interface FastifyRequest {
    ctx: Context
  }
}

server.decorateRequest('ctx', null)

server.get('/hello', (req, reply) => {
  console.log(req.ctx)
  reply.send('world')
})
