import { get, post } from '../test_helper'

describe('用户注册', () => {
  it('foo', async () => {
    const res = await get('/hello')

    expect(res).toMatchSnapshot()
  })

  it('signup', async () => {
    const res = await post('/signup', {
      name: 'Name',
      mobile: '18012341234',
      password: 'password',
    })

    expect(res).toMatchSnapshot()
  })
})
