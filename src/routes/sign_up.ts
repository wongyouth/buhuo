import { FastifyPluginCallback } from 'fastify'
import { FromSchema } from 'json-schema-to-ts'
import { prisma, hashPassword, logger, sms, error } from '../utils'

const { ValidationError } = error

const body = {
  type: 'object',
  properties: {
    mobile: {
      type: 'string',
      minLength: 11,
      maxLength: 11,
      description: '手机号',
    },
    name: {
      type: 'string',
      description: '名字',
    },
    password: {
      type: 'string',
      minLength: 8,
      maxLength: 40,
      description: '密码',
    },
    smsCode: {
      type: 'string',
      description: '短信验证码',
    },
  },
  required: ['mobile', 'password', 'smsCode'],
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

const plugin: FastifyPluginCallback = function signUp(fastify, _opts, next) {
  fastify.post<{ Body: Body }>(
    '/signup',
    {
      schema: {
        description: '用户注册',
        tags: ['User'],
        body,
        response,
      },
    },
    async (req, reply) => {
      logger.trace('input data: %o', req.body)
      const { smsCode, ...data } = await formatData(req.body)

      await ensureMobileNotTaken(data.mobile)
      await ensureValidSmsCode(data.mobile, smsCode)

      const user = await prisma.user.create({
        data,
      })
      logger.trace('user created: %j', user)

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

async function ensureMobileNotTaken(mobile: string) {
  const isUserExist = await prisma.user.findUnique({
    where: { mobile },
  })

  if (isUserExist) throw new ValidationError('手机号已经存在')
}

async function ensureValidSmsCode(mobile: string, smsCode: string) {
  const code = await sms.getVerifyCode(mobile)

  if (code !== smsCode) {
    throw new ValidationError('验证码不匹配')
  }
}
