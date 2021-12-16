import { Request, Response, NextFunction } from 'express'
import { camelizeKeys } from 'humps'

function camelizeQuery(req: Request, _res: Response, next: NextFunction) {
  req.query = camelizeKeys(req.query) as any
  next()
}

export default camelizeQuery
