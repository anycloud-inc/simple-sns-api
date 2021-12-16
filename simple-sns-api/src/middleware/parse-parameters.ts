import { NextFunction, Request, Response } from 'express'
import { parseValue } from 'src/lib/object-utils'

type ParsedQuery = { [key: string]: any }

interface Options {
  parseNull?: boolean
  parseBoolean?: boolean
  parseNumber?: boolean
  parseDate?: boolean
  filterPaths?: Array<string | RegExp>
}

export const parseParameters =
  (options: Options = {}) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (
      options.filterPaths != null &&
      !options.filterPaths.some(path => _matchPath(path, req.path))
    ) {
      return next()
    }

    req.params = parseValue(req.params, options) as ParsedQuery
    req.query = parseValue(req.query, options) as ParsedQuery
    next()
  }

const _matchPath = (path: string | RegExp, target: string): boolean => {
  return typeof path === 'string' ? target === path : target.match(path) != null
}
