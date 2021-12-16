import * as argon2 from 'argon2'
import { getRepository } from 'typeorm'
import { User } from '../user/user.entity'
import { LoginError, ValidationError } from '../../error'
import { encodeJwt } from 'src/lib/jwt'
import { validateOrFail } from 'src/lib/validate'

interface SignupParams {
  email: string
  password: string
  name: string
}

interface LoginParmas {
  email: string
  password: string
}

export const authService = {
  async signup({
    email,
    password,
    name,
  }: SignupParams): Promise<{ user: User; token: string }> {
    const passwordHashed = await this.hashPassword(password)
    const repo = getRepository(User)

    let user = repo.create({
      name,
      email,
      password: passwordHashed,
    })
    await validateOrFail(user)
    user = await repo.save(user)
    return {
      user,
      token: this._generateToken(user),
    }
  },

  async login({
    email,
    password,
  }: LoginParmas): Promise<{ user: User; token: string }> {
    const repo = getRepository(User)
    const user = await repo.findOne({ email })
    if (!user) throw new LoginError()

    const valid = await argon2.verify(user.password, password)
    if (!valid) throw new LoginError()

    return {
      user,
      token: this._generateToken(user),
    }
  },

  async hashPassword(password: string) {
    if (password.length < 8) throw new ValidationError('Password is too short.')
    return await argon2.hash(password)
  },

  _generateToken(user: User): string {
    if (user.id == null) return ''
    return encodeJwt({ id: user.id, resource: 'User' })
  },
}
