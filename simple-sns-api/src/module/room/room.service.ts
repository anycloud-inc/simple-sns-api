import { getRepository } from 'typeorm'
import { Room } from './room.entity'
import { validateOrFail } from 'src/lib/validate'
import { RoomUser } from '../room-user/room-user.entity'

export const roomService = {
  async createRoom(userIds: number[]): Promise<Room> {
    const repo = getRepository(Room)
    const room = repo.create({ usersId: this._getUsersId(userIds) })
    room.roomUsers = userIds.map(userId =>
      getRepository(RoomUser).create({ userId })
    )
    await validateOrFail(room)
    console.log(room)
    return await repo.save(room)
  },

  async findOneByUserIds(userIds: number[]): Promise<Room | undefined> {
    return await getRepository(Room).findOne({
      usersId: this._getUsersId(userIds),
    })
  },

  _getUsersId(userIds: number[]) {
    // 昇順に並び替え
    return userIds.sort((a, b) => a - b).join('-')
  },
}
