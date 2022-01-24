import { userSerializer } from '../user/user.serializer'
import { RoomUser } from './room-user.entity'
import * as openapi from 'simple-sns-openapi-server-interface/outputs/openapi_server_interface/ts/types'
import dayjs = require('dayjs')

export const roomUserSerializer = {
  build: (item: RoomUser): openapi.components['schemas']['EntityRoomUser'] => {
    return {
      roomId: item.roomId,
      userId: item.userId,
      readAt: item.readAt != null ? dayjs(item.readAt).format() : undefined,
      user: item.user != null ? userSerializer.build(item.user) : undefined,
    }
  },
}
