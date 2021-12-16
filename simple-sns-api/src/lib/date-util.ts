import dayjs = require('dayjs')

export function addYears(date: Date, years: number) {
  const result = new Date(date)
  result.setFullYear(result.getFullYear() + years)
  return result
}

export function addMonths(date: Date, months: number) {
  const result = new Date(date)
  result.setMonth(result.getMonth() + months)
  return result
}

export function addDays(date: Date, days: number) {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export function addHours(date: Date, hours: number) {
  const result = new Date(date)
  result.setHours(result.getHours() + hours)
  return result
}

export function addMinutes(date: Date, minutes: number) {
  const result = new Date(date)
  result.setMinutes(result.getMinutes() + minutes)
  return result
}

export function ceilMinutes(date: Date, unit: number) {
  const result = new Date(date)
  result.setMinutes(Math.ceil(result.getMinutes() / unit) * unit, 0, 0)
  return result
}

export function addSeconds(date: Date, seconds: number) {
  const result = new Date(date)
  result.setSeconds(result.getSeconds() + seconds)
  return result
}

export function startOf(date: Date) {
  date.setHours(0, 0, 0, 0)
  return date
}

export function endOf(date: Date) {
  date.setHours(23, 59, 59, 999)
  return date
}

export function mergeOverwrapping(
  datetimeList: { startAt: Date; endAt: Date }[]
) {
  datetimeList.sort((a, b) => a.startAt.getTime() - b.startAt.getTime())
  const mergedList = []
  for (const datetime of datetimeList) {
    if (mergedList.length === 0) mergedList.push(datetime)
    const last = mergedList[mergedList.length - 1]
    if (last.endAt >= datetime.startAt && last.endAt >= datetime.endAt) continue
    if (last.endAt < datetime.startAt) {
      mergedList.push(datetime)
      continue
    }
    return mergedList
  }
}
