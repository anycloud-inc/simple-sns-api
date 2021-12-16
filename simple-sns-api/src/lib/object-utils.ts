export const filterBy = <T>(
  obj: { [key: string]: T },
  callback: (key: string, val: T) => boolean
): { [key: string]: any } => {
  return Object.fromEntries(
    Object.entries(obj).filter(x => callback(x[0], x[1]))
  )
}

// e.g.
// filterKeys({hoge: 1, fuga: 2}, ['hoge'])
// => {hoge: 1}
export const filterKeys = (
  obj: { [key: string]: any },
  keys: Array<string>
): { [key: string]: any } => {
  return Object.keys(obj)
    .filter(key => keys.includes(key))
    .reduce<{ [key: string]: any }>((memo, key) => {
      memo[key] = obj[key]
      return memo
    }, {})
}

// e.g.
// excludeKeys({hoge: 1, fuga: 2}, ['hoge'])
// => {fuga: 2}
export const excludeKeys = (
  obj: { [key: string]: any },
  keys: Array<string>
): { [key: string]: any } => {
  return Object.keys(obj)
    .filter(key => !keys.includes(key))
    .reduce<{ [key: string]: any }>((memo, key) => {
      memo[key] = obj[key]
      return memo
    }, {})
}

export const removeEmpty = (obj: Object) => {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null))
}

interface ParseOptions {
  parseNull?: boolean
  parseBoolean?: boolean
  parseNumber?: boolean
}

export const parseValue = (
  target: Object,
  options: ParseOptions = {}
): Object => {
  return _parseValue(target, options)
}

const _parseValue = (target: any, options: ParseOptions = {}): any => {
  if (target == null) return
  // set default values
  options.parseBoolean ??= true
  options.parseNull ??= true
  options.parseNumber ??= true

  switch (typeof target) {
    case 'string':
      if (options.parseNull && target === 'null') {
        return null
      } else if (
        options.parseBoolean &&
        (target === 'true' || target === 'false')
      ) {
        return target === 'true'
      } else if (
        options.parseNumber &&
        target !== '' && // Number('') -> 0 なので空文字は除外
        !isNaN(Number(target))
      ) {
        return Number(target)
      }
    case 'object':
      if (Array.isArray(target)) {
        return target.map(x => parseValue(x, options))
      } else {
        const obj = target as any
        Object.keys(obj).map(key => (obj[key] = parseValue(obj[key], options)))
        return obj
      }
    default:
      return target
  }
}
