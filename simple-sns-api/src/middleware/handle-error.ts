import { Request, Response, NextFunction } from 'express'
import {
  AuthError,
  ValidationError,
  AclError,
  RequestParameterError,
  InvalidRequestError,
} from '../error'
import logger from 'src/lib/logger'
import { QueryFailedError } from 'typeorm'
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError'

export default (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err.isBoom) {
    const errorData = err.output.payload
    return res.status(errorData.statusCode).json(errorData)
  }

  if (
    err instanceof RequestParameterError ||
    err instanceof InvalidRequestError
  ) {
    return res.status(400).json({ message: err.message })
  }

  if (err instanceof AuthError) {
    return res.status(401).json({ message: err.message })
  }

  if (err instanceof AclError) {
    return res.status(403).json({ message: err.message })
  }

  if (err instanceof ValidationError || err instanceof QueryFailedError) {
    return res.status(422).json({ message: err.message })
  }

  if (err instanceof EntityNotFoundError) {
    // err.messageにソースコードの情報が入ってしまうので、代替メッセージを表示
    return res.status(404).json({ message: 'レコードが見つかりませんでした' })
  }

  logger.error(err)

  const message = err.message || err
  res.status(500).json({
    message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  })
}
