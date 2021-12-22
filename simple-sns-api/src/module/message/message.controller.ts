import { Request, Response, NextFunction } from 'express'
import { Auth } from 'src/lib/auth'
import { Controller, Post } from 'src/lib/controller'
import { messageSerializer } from './message.serializer'
import { messageService } from './message.service'

@Controller('/messages')
export class MessageController {
  @Post()
  @Auth
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const message = await messageService.createMessage(req.currentUser.id!, {
        roomId: req.body.roomId,
        content: req.body.content,
      })

      res.json({ message: messageSerializer.build(message) })
    } catch (e) {
      next(e)
    }
  }
}
