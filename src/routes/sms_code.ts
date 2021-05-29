import { FastifyPluginCallback } from 'fastify'
import { FromSchema } from 'json-schema-to-ts'
import { logger, sms } from '../utils'

const body = {
  type: 'object',
  properties: {
    mobile: {
      type: 'string',
      minLength: 11,
      maxLength: 11,
      description: '手机号',
    },
  },
  required: ['mobile'],
  additionalProperties: false,
} as const

const response = {
  200: {
    type: 'object',
    properties: {
      message: { type: 'string' },
    },
  },
} as const

type Body = FromSchema<typeof body>

const plugin: FastifyPluginCallback = function (fastify, _opts, next) {
  fastify.post<{ Body: Body }>(
    '/sms-code',
    {
      schema: {
        description: '发送短信验证码',
        tags: ['User'],
        body,
        response,
      },
    },
    async (req, reply) => {
      logger.trace('input data: %o', req.body)
      const { mobile } = req.body

      await sms.sendSms(mobile)

      logger.trace('smsCode sent for %s', mobile)

      return {
        message: '发送成功',
      }
    }
  )

  next()
}

export default plugin
