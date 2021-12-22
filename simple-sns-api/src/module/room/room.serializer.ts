import { messageSerializer } from '../message/message.serializer'
import { roomUserSerializer } from '../room-user/room-user.serializer'
import { Room } from './room.entity'

export const roomSerializer = {
  build: (item: Room) => {
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
