import { Request, Response, NextFunction } from 'express'
import { Auth } from 'src/lib/auth'
import { Controller, Get, Post } from 'src/lib/controller'
import { getPaginationParams } from 'src/lib/request-utils'
import { roomPolicy } from '../room/room.policy'
import { messageSerializer } from './message.serializer'
import { messageService } from './message.service'
import * as openapi from 'simple-sns-openapi-server-interface/outputs/openapi_server_interface/ts/types'

@Controller('/messages')
export class MessageController {
  @Get()
  @Auth
  async index(
    req: Request<
      {},
      {},
      {},
      openapi.operations['listMessages']['parameters']['query']
    >,
    res: Response<
      openapi.components['responses']['ResponseMessageList']['content']['application/json']
    >,
    next: NextFunction
  ): Promise<void> {
    try {
      const pagination = getPaginationParams(req.query)
      const roomId = req.query.roomId

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
  async create(
    req: Request<
      {},
      {},
      openapi.operations['createMessage']['requestBody']['content']['application/json']
    >,
    res: Response<
      openapi.components['responses']['ResponseMessage']['content']['application/json']
    >,
    next: NextFunction
  ): Promise<void> {
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
    req: Request<
      {},
      {},
      openapi.operations['createMessageViaPost']['requestBody']['content']['application/json']
    >,
    res: Response<
      openapi.components['responses']['ResponseMessage']['content']['application/json']
    >,
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
