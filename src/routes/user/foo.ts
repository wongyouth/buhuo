import { FastifyPluginCallback } from 'fastify'

console.log('foo')
const plugin: FastifyPluginCallback = function signUp(fastify, _opts, next) {
  fastify.get('/foo', (req, reply) => {
    reply.send('hello')
  })

  next()
}

export default plugin
