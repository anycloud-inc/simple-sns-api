import { getRepository } from 'typeorm'
import { RoomUser } from '../room-user/room-user.entity'

export const roomPolicy = {
  async showableOrFail(roomId: string, userId: number) {
    await getRepository(RoomUser).findOneOrFail({
      userId,
      roomId,
    })
  },
}
