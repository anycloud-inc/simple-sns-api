import { Post } from './post.entity'
import dayjs = require('dayjs')
import { userSerializer } from '../user/user.serializer'
import * as openapi from 'simple-sns-openapi-server-interface/outputs/openapi_server_interface/ts/types'

export const postSerializer = {
  build: (item: Post): openapi.components['schemas']['EntityPost'] => {
    return {
      ...item,
      id: item.id!,
      user: item.user ? userSerializer.build(item.user) : undefined,
      createdAt: dayjs(item.createdAt).format(),
    }
  },
}
