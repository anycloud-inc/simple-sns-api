import { messageSerializer } from '../message/message.serializer'
import { roomUserSerializer } from '../room-user/room-user.serializer'
import { Room } from './room.entity'
import * as openapi from 'simple-sns-openapi-server-interface/outputs/openapi_server_interface/ts/types'

export const roomSerializer = {
  build: (item: Room): openapi.components['schemas']['EntityRoom'] => {
    return {
      id: item.id!,
      messages:
        item.latestMessage != null
          ? [messageSerializer.build(item.latestMessage)]
          : [],
      roomUsers: item.roomUsers?.map(x => roomUserSerializer.build(x)) ?? [],
    }
  },
}
