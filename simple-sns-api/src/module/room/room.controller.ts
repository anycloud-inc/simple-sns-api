import { Request, Response, NextFunction } from 'express'
import { Auth } from 'src/lib/auth'
import { Controller, Get, Post } from 'src/lib/controller'
import { roomPolicy } from './room.policy'
import { roomSerializer } from './room.serializer'
import { roomService } from './room.service'
import * as openapi from 'simple-sns-openapi-server-interface/outputs/openapi_server_interface/ts/types'
import { loadRelations } from 'src/lib/typeorm-helper'

@Controller('/rooms')
export class RoomController {
  @Get()
  @Auth
  async index(
    req: Request<{}, {}, {}, {}>,
    res: Response<
      openapi.paths['/rooms']['get']['responses'][200]['content']['application/json']
    >,
    next: NextFunction
  ): Promise<void> {
    try {
      const rooms = await roomService.findRooms(req.currentUser.id!)
      res.json({
        rooms: rooms.map(x => roomSerializer.build(x)),
      })
    } catch (e) {
      next(e)
    }
  }

  @Get('/:id')
  @Auth
  async show(
    req: Request<openapi.operations['findRoom']['parameters']['path']>,
    res: Response<
      openapi.paths['/rooms/{id}']['get']['responses'][200]['content']['application/json']
    >,
    next: NextFunction
  ): Promise<void> {
    try {
      await roomPolicy.showableOrFail(req.params.id, req.currentUser.id!)
      const room = await roomService.findOne(req.params.id)
      res.json({ room: roomSerializer.build(room) })
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
      openapi.paths['/rooms']['post']['requestBody']['content']['application/json']
    >,
    res: Response<
      openapi.paths['/rooms']['post']['responses'][200]['content']['application/json']
    >,
    next: NextFunction
  ): Promise<void> {
    try {
      const userIds = [req.currentUser.id!, ...req.body.userIds]
      const room =
        (await roomService.findOneByUserIds(userIds)) ||
        (await roomService.createRoom(userIds))
      await loadRelations([room], ['roomUsers', 'roomUsers.user'])
      res.json({ room: roomSerializer.build(room) })
    } catch (e) {
      next(e)
    }
  }
}
