export default {
  log: (...data: any) => {
    console.log(...data)
  },
  warn: (...data: any) => {
    console.trace(...data)
  },
  error: (error: any) => {
    if (error instanceof Error) {
      console.error(error)
    } else {
      console.error(new Error(error))
    }
  },
}
