import { sign } from 'jsonwebtoken'

export async function generateAccessToken(payload: any) {
  return sign(payload, process.env.JWT_SECRET_KEY as string, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })
}
