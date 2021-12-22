import { Request, Response, NextFunction } from 'express'
import { Auth } from 'src/lib/auth'
import { Controller, Get, Post } from 'src/lib/controller'
import { roomSerializer } from './room.serializer'
import { roomService } from './room.service'

@Controller('/rooms')
export class RoomController {
  @Get()
  @Auth
  async index(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const rooms = await roomService.findRooms(req.currentUser.id!)
      res.json({
        rooms: rooms.map(x => roomSerializer.build(x)),
      })
    } catch (e) {
      next(e)
    }
  }

  @Post()
  @Auth
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userIds = [req.currentUser.id!, ...req.body.userIds]
      const room =
        (await roomService.findOneByUserIds(userIds)) ||
        (await roomService.createRoom(userIds))
      res.json({ room: roomSerializer.build(room) })
    } catch (e) {
      next(e)
    }
  }
}
