import { FastifyPluginCallback } from 'fastify'
import { FromSchema } from 'json-schema-to-ts'
import { prisma, hashPassword, logger } from '../utils'

const body = {
  type: 'object',
  properties: {
    mobile: {
      type: 'string',
      description: '手机号',
    },
    name: {
      type: 'string',
      description: '名字',
    },
    password: {
      type: 'string',
      description: '密码',
    },
  },
  required: ['mobile', 'password'],
  additionalProperties: false,
} as const

const response = {
  201: {
    type: 'object',
    properties: {
      userId: { type: 'number' },
      token: { type: 'string' },
    },
  },
} as const

type Body = FromSchema<typeof body>

console.log('sign up route')

const plugin: FastifyPluginCallback = function signUp(fastify, _opts, next) {
  fastify.post<{ Body: Body }>(
    '/signup',
    {
      schema: {
        body,
        response,
      },
    },
    async (req, reply) => {
      const data = await formatData(req.body)
      logger.debug(data)
      const user = await prisma.user.create({
        data,
      })
      const token = fastify.jwt.sign({ userId: user.id })

      return {
        token,
        userId: user.id,
      }
    }
  )

  next()
}

async function formatData(body: Body) {
  const password = await hashPassword(body.password)

  return {
    ...body,
    name: body.name || body.mobile,
    password,
  }
}

export default plugin
