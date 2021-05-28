import { FastifyInstance } from 'fastify'
import swagger, { FastifyDynamicSwaggerOptions } from 'fastify-swagger'

const options: FastifyDynamicSwaggerOptions = {
  routePrefix: '/docs',
  openapi: {
    info: {
      title: '古稀 API 文档',
      description: '古稀养老系统接口文档',
      version: '0.1.0',
    },
    tags: [{ name: 'User' }],
  },
  exposeRoute: true,
}

export const addSwagger = (fastify: FastifyInstance) => {
  fastify.register(swagger, options)

  fastify.addHook('onReady', (next) => {
    fastify.swagger()

    next()
  })
}
