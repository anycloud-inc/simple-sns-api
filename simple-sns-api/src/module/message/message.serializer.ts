import { postSerializer } from '../post/post.serializer'
import { userSerializer } from '../user/user.serializer'
import { Message } from './message.entity'

export const messageSerializer = {
  build: (item: Message) => {
    return {
      ...item,
      id: item.id!,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      user: item.user ? userSerializer.build(item.user) : undefined,
      post: item.post ? postSerializer.build(item.post) : undefined,
    }
  },
}
