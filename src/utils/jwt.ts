import jwt from 'jsonwebtoken'
import { User } from '@prisma/client'
import { JWT_SECRET } from './env'

type Token = {
  userId: number
}

export function genToken(user: User) {
  return jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '90d' })
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as Token
}
