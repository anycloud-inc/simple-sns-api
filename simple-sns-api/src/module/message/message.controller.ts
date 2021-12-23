import { Request, Response, NextFunction } from 'express'
import { Auth } from 'src/lib/auth'
import { Controller, Get, Post } from 'src/lib/controller'
import { getPaginationParams } from 'src/lib/request-utils'
import { roomPolicy } from '../room/room.policy'
import { messageSerializer } from './message.serializer'
import { messageService } from './message.service'

@Controller('/messages')
export class MessageController {
  @Get()
  @Auth
  async index(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = getPaginationParams(req.query)
      const roomId = req.query.roomId as string

      await roomPolicy.showableOrFail(roomId, req.currentUser.id!)

      const messages = await messageService.findMessages(roomId, pagination)
      res.json({
        messages: messages.map(x => messageSerializer.build(x)),
      })
    } catch (e) {
      next(e)
    }
  }

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

  @Post('/via_post')
  @Auth
  async createViaPost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const message = await messageService.createMessageViaPost(
        req.currentUser.id!,
        {
          postId: req.body.postId,
          content: req.body.content,
        }
      )
      res.json({ message: messageSerializer.build(message) })
    } catch (e) {
      next(e)
    }
  }
}
