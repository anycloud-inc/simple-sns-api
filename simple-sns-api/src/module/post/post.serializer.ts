import { Post } from './post.entity'
import dayjs = require('dayjs')
import { userSerializer } from '../user/user.serializer'

export const postSerializer = {
  build: (item: Post) => {
    return {
      ...item,
      id: item.id!,
      user: item.user ? userSerializer.build(item.user) : undefined,
      createdAt: dayjs(item.createdAt).format(),
    }
  },
}
