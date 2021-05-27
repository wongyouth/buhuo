import fastify, { FastifyRequest, FastifyReply } from 'fastify'

export const server = fastify({ logger: true })

server.get('/hello', (request: FastifyRequest, reply: FastifyReply) => {
  reply.send('world')
})
