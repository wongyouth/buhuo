import { post } from '../test_helper'
import { sms } from '../../src/utils'

const smsCode = sms.TEST_CODE
const mobile = '18012341234'

describe('用户注册', () => {
  it('发送验证码', async () => {
    const res = await post('/api/sms-code', {
      mobile,
    })

    expect(res).toMatchInlineSnapshot(`
      Object {
        "data": Object {
          "message": "发送成功",
        },
        "status": 200,
      }
    `)
  })

  it('注册成功', async () => {
    await sms.sendSms(mobile)
    const res = await post('/api/signup', {
      name: 'Name',
      mobile,
      password: 'password',
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
          "userId": 1,
        },
        "status": 200,
      }
      `
    )
  })
})
