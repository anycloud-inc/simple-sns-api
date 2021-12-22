import { userSerializer } from '../user/user.serializer'
import { RoomUser } from './room-user.entity'

export const roomUserSerializer = {
  build: (item: RoomUser) => {
    return {
      roomId: item.roomId,
      userId: item.userId,
      readAt: item.readAt,
      user: item.user != null ? userSerializer.build(item.user) : undefined,
    }
  },
}
