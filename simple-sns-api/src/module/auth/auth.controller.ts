import { Request, Response, NextFunction } from 'express'
import { authService } from './auth.service'
import { Controller, Delete, Post } from 'src/lib/controller'
import { accountSerializer } from '../account/account.serializer'
import { LoginError } from 'src/error'
import { badRequest } from 'boom'
import * as openapi from 'simple-sns-openapi-server-interface/outputs/openapi_server_interface/ts/types'

@Controller('/auth')
export class AuthController {
  @Post()
  async create(
    req: Request<
      {},
      {},
      openapi.paths['/auth']['post']['requestBody']['content']['application/json']
    >,
    res: Response<
      openapi.paths['/auth']['post']['responses'][200]['content']['application/json']
    >,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password } = req.body
      const { user, token } = await authService.login({
        email,
        password,
      })
      res.json({
        user: accountSerializer.build(user),
        token,
      })
    } catch (e) {
      if (e instanceof LoginError) {
        next(badRequest(e.message))
      } else {
        next(e)
      }
    }
  }

  @Delete()
  async delete(
    req: Request<
      {},
      {},
      openapi.paths['/auth']['delete']['requestBody']['content']['application/json']
    >,
    res: Response<
      openapi.paths['/auth']['delete']['responses'][200]['content']['application/json']
    >,
    next: NextFunction
  ): Promise<void> {
    try {
      if (req.currentUser != null) {
        // ログイン時の処理
      }
      res.json({ success: true })
    } catch (e) {
      next(e)
    }
  }
}
