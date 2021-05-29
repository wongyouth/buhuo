import * as redis from './redis'
import { isProd } from './misc'

export const TEST_CODE = '111111'
const redisSmsKey = (mobile: string) => `sms:verify:${mobile}`

export async function getVerifyCode(mobile: string) {
  return redis.get(redisSmsKey(mobile))
}

export async function isNotExpired(mobile: string) {
  const code = await getVerifyCode(mobile)
  return !!code
}

export function reachMaxTimes(mobile: string): boolean {
  // TODO
  return false
}

const redisVerifyCacheTime = 300

export async function sendSms(mobile: string) {
  redis.setex(redisSmsKey(mobile), redisVerifyCacheTime, genVerificationCode())

  // TODO: Use SMS service to send out Verification code
}

// 生成6位验证码
function genVerificationCode() {
  if (!isProd) return TEST_CODE

  return Array(6)
    .fill(0)
    .map(() => nRand())
    .join('')
}

function nRand() {
  return Math.floor(Math.random() * 10)
}
