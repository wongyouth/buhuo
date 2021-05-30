import { post } from '../test_helper'
import { prisma, sms, hashPassword } from '../../src/utils'

const smsCode = sms.TEST_CODE
const mobile = '18012341234'
const password = '11112222'

beforeAll(async () => {
  await prisma.user.create({
    data: {
      name: 'ryan',
      mobile,
      password: await hashPassword(password),
    },
  })
})

describe('用户登录', () => {
  it('密码登录', async () => {
    const res = await post('/api/signin-by-password', {
      mobile,
      password,
    })

    expect(res).toMatchInlineSnapshot(
      {
        data: { token: expect.any(String) },
      },
      `
        Object {
          "data": Object {
            "token": Any<String>,
          },
          "status": 200,
        }
      `
    )
  })

  it('短信验证码登录', async () => {
    await sms.sendSms(mobile)
    const res = await post('/api/signin-by-sms', {
      mobile,
      smsCode,
    })

    expect(res).toMatchInlineSnapshot(
      {
        data: { token: expect.any(String) },
      },
      `
        Object {
          "data": Object {
            "token": Any<String>,
          },
          "status": 200,
        }
      `
    )
  })
})
