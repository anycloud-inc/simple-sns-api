import { Request, Response, NextFunction } from 'express'
import { AuthError } from 'src/error'

export const Auth = (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) => {
  const action = descriptor.value.bind(target)

  descriptor.value = async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (req.currentUser == null) return next(new AuthError('Unauthorized user'))

    try {
      action(req, res, next)
    } catch (e) {
      next(e)
    }
  }
}
