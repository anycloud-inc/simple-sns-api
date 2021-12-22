import { getRepository } from 'typeorm'
import { Room } from './room.entity'
import { validateOrFail } from 'src/lib/validate'
import { RoomUser } from '../room-user/room-user.entity'
import { messageService } from '../message/message.service'
import { addSeconds } from 'src/lib/date-util'

export const roomService = {
  async createRoom(userIds: number[]): Promise<Room> {
    const repo = getRepository(Room)
    const room = repo.create({ usersId: this._getUsersId(userIds) })
    room.roomUsers = userIds.map(userId =>
      getRepository(RoomUser).create({ userId })
    )
    await validateOrFail(room)
    return await repo.save(room)
  },

  async findRooms(userId: number): Promise<Room[]> {
    const roomUsers = await getRepository(RoomUser).find({ userId })
    if (roomUsers.length === 0) return []

    const latestMessages = await messageService.findLatestMessages(
      roomUsers.map(x => x.roomId)
    )
    if (latestMessages.length === 0) return []

    const rooms = await getRepository(Room)
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.roomUsers', 'roomUser')
      .leftJoinAndSelect('roomUser.user', 'user')
      .where('room.id IN (:roomIds)', {
        roomIds: roomUsers.map(x => x.roomId),
      })
      .orderBy(
        `field(room.id, ${latestMessages.map(x => `"${x.roomId}"`).join(',')})`
      )
      .getMany()

    rooms.forEach(room => {
      const message = latestMessages.find(x => x.roomId == room.id)
      room.latestMessage = message
    })

    return rooms
  },

  async findOne(roomId: string): Promise<Room> {
    const room = await getRepository(Room)
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.roomUsers', 'roomUser')
      .leftJoinAndSelect('roomUser.user', 'user')
      .where('room.id = :roomId', { roomId })
      .getOneOrFail()

    return room
  },

  async findOneByUserIds(userIds: number[]): Promise<Room | undefined> {
    return await getRepository(Room).findOne({
      usersId: this._getUsersId(userIds),
    })
  },

  async markAsRead(roomId: string, userId: number): Promise<Room> {
    const latestMessage = (await messageService.findLatestMessages([roomId]))[0]
    if (latestMessage == null) return await this.findOne(roomId)
    await getRepository(RoomUser).update(
      { roomId, userId },
      { readAt: addSeconds(latestMessage.createdAt!, 1) }
    )
    return await this.findOne(roomId)
  },

  _getUsersId(userIds: number[]) {
    // 昇順に並び替え
    return userIds.sort((a, b) => a - b).join('-')
  },
}
