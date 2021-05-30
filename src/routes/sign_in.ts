import { compare } from 'bcryptjs'
import { FastifyInstance, FastifyPluginCallback } from 'fastify'
import { FromSchema } from 'json-schema-to-ts'
import { prisma, logger, sms, error } from '../utils'

const { UserInputError, ValidationError } = error

const plugin: FastifyPluginCallback = function signIn(fastify, _opts, next) {
  byPassword(fastify)
  bySMS(fastify)

  next()
}

export default plugin

function byPassword(fastify: FastifyInstance) {
  const body = {
    type: 'object',
    properties: {
      mobile: {
        type: 'string',
        minLength: 11,
        maxLength: 11,
        description: '手机号',
      },
      password: {
        type: 'string',
        minLength: 8,
        maxLength: 40,
        description: '密码',
      },
    },
    required: ['mobile', 'password'],
    additionalProperties: false,
  } as const

  const response = {
    200: {
      type: 'object',
      properties: {
        userId: { type: 'number' },
        token: { type: 'string' },
      },
    },
  } as const

  type Body = FromSchema<typeof body>
  fastify.post<{ Body: Body }>(
    '/signin-by-password',
    {
      schema: {
        description: '密码登录',
        tags: ['User'],
        body,
        response,
      },
    },
    async (req, reply) => {
      logger.trace('input data: %o', req.body)
      const { mobile, password } = req.body

      const user = await prisma.user.findUnique({
        where: { mobile },
      })

      if (!user) {
        // run compare to avoid time attack
        await compare(password, 'not_exists')
        throw new UserInputError('用户名与密码不匹配')
      }

      if (!user.password) {
        throw new ValidationError('密码未设置')
      }

      const isMatch = await compare(password, user.password)
      if (!isMatch) {
        throw new UserInputError('用户名与密码不匹配')
      }

      const token = fastify.jwt.sign({ userId: user.id })

      return {
        user,
        token,
      }
    }
  )
}

function bySMS(fastify: FastifyInstance) {
  const body = {
    type: 'object',
    properties: {
      mobile: {
        type: 'string',
        minLength: 11,
        maxLength: 11,
        description: '手机号',
      },
      smsCode: {
        type: 'string',
        description: '短信验证码',
      },
    },
    required: ['mobile', 'smsCode'],
    additionalProperties: false,
  } as const

  const response = {
    200: {
      type: 'object',
      properties: {
        userId: { type: 'number' },
        token: { type: 'string' },
      },
    },
  } as const

  type Body = FromSchema<typeof body>
  fastify.post<{ Body: Body }>(
    '/signin-by-sms',
    {
      schema: {
        description: '短信验证码登录',
        tags: ['User'],
        body,
        response,
      },
    },
    async (req, reply) => {
      logger.trace('input data: %o', req.body)
      const { mobile, smsCode } = req.body

      const user = await prisma.user.findUnique({
        where: { mobile },
      })

      if (!user) {
        throw new UserInputError('用户不存在')
      }

      const token = fastify.jwt.sign({ userId: user.id })

      return {
        user,
        token,
      }
    }
  )
}
