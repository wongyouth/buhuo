import { get, post } from '../test_helper'
import { sms } from '../../src/utils'

const smsCode = sms.TEST_CODE

describe('用户注册', () => {
  it('foo', async () => {
    const res = await get('/hello')

    expect(res).toMatchInlineSnapshot(`
      Object {
        "data": "world",
        "status": 200,
      }
    `)
  })

  it('signup', async () => {
    const mobile = '18012341234'

    await sms.sendSms(mobile)
    const res = await post('/signup', {
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
