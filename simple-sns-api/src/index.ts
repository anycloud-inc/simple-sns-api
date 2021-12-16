require('dotenv').config()
console.log(111)
import * as express from 'express'
import 'reflect-metadata'
import * as morgan from 'morgan'
import * as cors from 'cors'
import { createConnection } from 'typeorm'
import logRequest from './middleware/log-request'
import handleError from './middleware/handle-error'
import camelizeQuery from './middleware/camelize-query'
import logger from './lib/logger'
import router from './router'
import * as dayjs from 'dayjs'
import * as timezone from 'dayjs/plugin/timezone'
import * as utc from 'dayjs/plugin/utc'
import setCurrentUser from './middleware/set-current-user'

const app = express()
const port = Number(process.env.PORT) || 3000
dayjs.extend(utc)
dayjs.extend(timezone)

app.use((req, res, next) => {
  next()
}, cors({ maxAge: 84600 }))
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(camelizeQuery)
app.use(logRequest)
app.use(setCurrentUser)
app.use(morgan('dev') as any)
if (process.env.UPLOAD_TO_CLOUD !== '1') {
  app.use('/uploads', express.static('uploads'))
}
app.use(router)
app.use(handleError)

process.on('unhandledRejection', logger.error)

createConnection()
  .then(async connection => {
    app.listen(port, () => console.log(`Server listening on port ${port}!`))
  })
  .catch(error => logger.error(error))
