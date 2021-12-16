import { RequestParameterError } from 'src/error'
import { Order, PaginationParams } from './typeorm-helper'

export const checkParameterOrFail = (requestBody: any, ...args: string[]) => {
  const empryList = args.filter(x => requestBody[x] == null)

  if (empryList.length > 0) {
    throw new RequestParameterError(
      `${empryList.join(', ')} required for request parameters`
    )
  }
}

// e.g. checkEnumParameterOrFail(req.body, {status: Status})
export const checkEnumParameterOrFail = (
  requestBody: any,
  args: { [key: string]: any }
) => {
  checkParameterOrFail(requestBody, ...Object.keys(args))
  for (const key in args) {
    const enumObj = args[key]
    if (enumObj[requestBody[key]] == null) {
      throw new RequestParameterError(`${key} is invalid`)
    }
  }
}

export const getPaginationParams = (requestQuery: any): PaginationParams => {
  if (requestQuery.pagination == null) return {}
  const { cursor, size, isNext, order } = requestQuery.pagination as any
  return {
    cursor: cursor ? parseInt(cursor) : undefined,
    size: size ? parseInt(size) : undefined,
    isNext:
      isNext != null
        ? isNext === 1 || isNext === true || isNext === '1' || isNext === 'true'
        : undefined,
    order: order as Order,
  }
}

export const parseDateString = (str?: string) => {
  return str == null ? undefined : new Date(str)
}
