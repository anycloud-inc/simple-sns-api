import { Request, Response, NextFunction } from 'express'
import { Controller, Get, Patch, Post } from 'src/lib/controller'
import { authService } from 'src/module/auth/auth.service'
import { accountSerializer } from './account.serializer'
import { Auth } from 'src/lib/auth'
import { accountService } from './account.service'
import { upload } from 'src/lib/image-uploader'

@Controller('/account')
export class AccountController {
  @Get()
  async show(req: Request, res: Response, next: NextFunction): Promise<void> {
    const currentUser = req.currentUser
    if (currentUser == null) {
      res.json({ user: undefined })
      return
    }
    res.json({
      user: accountSerializer.build(currentUser),
    })
  }

  @Post()
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, password } = req.body
      const { user, token } = await authService.signup({
        name,
        email,
        password,
      })
      res.json({ user: accountSerializer.build(user), token })
    } catch (e) {
      next(e)
    }
  }

  @Auth
  @Patch('/icon_image')
  async updateIconImage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { url } = await upload(req, res, 'users/icon')
      const account = await accountService.saveAccount(req.currentUser, {
        iconImageUrl: url,
      })
      res.json({ user: accountSerializer.build(account) })
    } catch (e) {
      next(e)
    }
  }

  @Auth
  @Patch('/profile')
  async updateProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const account = await accountService.saveAccount(req.currentUser, {
        name: req.body.name,
        email: req.body.email,
      })
      res.json({ user: accountSerializer.build(account) })
    } catch (e) {
      next(e)
    }
  }
}
