import { notFound } from 'boom'
import * as express from 'express'

const router = express.Router()

router.get('/', (req, res) => res.send('OK!!!!!!'))
router.get('/routes', (req, res, next) => {
  if (process.env.NODE_ENV === 'production') return next(notFound())
  res.send(
    router.stack
      .map(x => `${x.route.stack[0]?.method} ${x.route.path}`)
      .join('</br>')
  )
})

export default router
