import * as jwt from 'jsonwebtoken'
import { EnvVarError } from '../error'

export interface Decoded {
  payload: JwtPayload
  iat: number
}

export interface JwtPayload {
  id: number
  resource: string
}

export const encodeJwt = (payload: JwtPayload): string => {
  return jwt.sign({ payload }, _getJwtSecret())
}

export const decodeJwt = (token: string): Decoded => {
  return jwt.verify(token, _getJwtSecret()) as Decoded
}

const _getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new EnvVarError('Set JWT_SECRET in .env')
  return secret
}
