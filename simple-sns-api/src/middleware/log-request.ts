import { Request, Response, NextFunction } from 'express'
import logger from 'src/lib/logger'

export default (req: Request, _res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV !== 'production') {
    logger.log() // new line
  }
  logger.log(req.method, req.url)

  const maskKeys = ['password']
  const logParams = Object.entries(req.body).reduce((prev, [key, value]) => {
    prev[key] = maskKeys.includes(key) ? '****' : value
    return prev
  }, {} as { [key: string]: any })

  logger.log('parameters:', logParams)
  next()
}
