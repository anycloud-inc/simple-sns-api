import { userSerializer } from '../user/user.serializer'
import { RoomUser } from './room-user.entity'
import * as openapi from 'simple-sns-openapi-server-interface/outputs/openapi_server_interface/ts/types'

export const roomUserSerializer = {
  build: (item: RoomUser): openapi.components['schemas']['EntityRoomUser'] => {
    return {
      roomId: item.roomId,
      userId: item.userId,
      user: item.user != null ? userSerializer.build(item.user) : undefined,
    }
  },
}
