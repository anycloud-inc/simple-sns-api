import { registerControllers } from '@anycloud/express-controller'
import { notFound } from 'boom'
import * as express from 'express'
import { AccountController } from './module/account/account.controller'
import { AuthController } from './module/auth/auth.controller'
import { MessageController } from './module/message/message.controller'
import { PostController } from './module/post/post.controller'
import { RoomController } from './module/room/room.controller'

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

registerControllers({
  router,
  controllers: [
    AccountController,
    AuthController,
    PostController,
    RoomController,
    MessageController,
  ],
})

export default router
