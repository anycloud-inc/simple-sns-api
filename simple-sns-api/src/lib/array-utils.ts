import logger from './logger'

// 配列をグループ化する
// e.g. groupBy(['one', 'two', 'three'], 'length')
// => {3: ["one", "two"], 5: ["three"]}
export function groupBy<T extends { [k: string]: any }>(
  array: Array<T>,
  key: string
): { [k: string]: Array<T> } {
  return array.reduce((acc, item) => {
    const keyValue = item[key]
    if (keyValue == null) {
      logger.warn(`${key} does NOT exist in ${JSON.stringify(item)}`)
      return acc
    }

    if (acc[keyValue] == null) {
      acc[keyValue] = [item]
    } else {
      acc[keyValue].push(item)
    }
    return acc
  }, {} as { [k: string]: Array<T> })
}

export function uniq<T>(array: Array<T>): Array<T> {
  return array.filter((elem, index, self) => self.indexOf(elem) === index)
}

export function uniqBy<T, U>(
  array: Array<T>,
  keyExtractor: (x: T) => U
): Array<T> {
  const result: Array<T> = []
  const resultKeys: Array<U> = []
  array.forEach(item => {
    if (resultKeys.includes(keyExtractor(item))) return
    result.push(item)
    resultKeys.push(keyExtractor(item))
  })
  return result
}

export function sum(array: Array<number>): number {
  return array.reduce((a, x) => {
    return a + x
  }, 0)
}

export function average(array: Array<number>): number {
  return sum(array) / array.length
}

export const chunk = <T>(array: T[], size: number): T[][] => {
  return array.reduce(
    (acc: T[][], val) => {
      const last = acc[acc.length - 1]
      if (last.length === size) {
        acc.push([val])
        return acc
      }
      last.push(val)
      return acc
    },
    [[]]
  )
}

export const intersect = <T>(a: T[], b: T[]): T[] => {
  const setB = new Set(b)
  return [...new Set(a)].filter(x => setB.has(x))
}

export const subtract = <T>(array1: T[], array2: T[]): T[] => {
  const set2 = new Set(array2)
  return array1.filter(x => !set2.has(x))
}

// e.g. subtractBy(['one', 'two', 'three'], [3], (x) => x.length)
// => ['three']
export const subtractBy = <T, U>(
  array1: T[],
  array2: U[],
  keyExtractor: (x: T) => U
): T[] => {
  const set2 = new Set(array2)
  return array1.filter(x => !set2.has(keyExtractor(x)))
}

// Setの比較を用いているため高速
export const filterBy = <T, U>(
  array1: T[],
  array2: U[],
  keyExtractor: (x: T) => U
): T[] => {
  const set2 = new Set(array2)
  return array1.filter(x => set2.has(keyExtractor(x)))
}

export const countRankedBy = <T>(
  array: T[],
  keyExtractor: (x: T) => string | number
) => {
  const counts = array.reduce((counts, item) => {
    const key = keyExtractor(item)
    counts[key] = (counts[key] || 0) + 1
    return counts
  }, {} as { [key: string]: number })
  const result = array.slice()
  result.sort((a, b) => counts[keyExtractor(b)] - counts[keyExtractor(a)])
  return uniqBy(result, keyExtractor)
}
