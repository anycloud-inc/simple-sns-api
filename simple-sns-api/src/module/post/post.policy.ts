import { getRepository } from 'typeorm'
import { Post } from './post.entity'

export const postPolicy = {
  async showableOrFail(post: Post, userId: number) {
    if (post.userId == userId) return
    // TODO: friendかどうか確認
  },
  async deletableOrFail(postId: number, userId: number) {
    await getRepository(Post).findOneOrFail({
      id: postId,
      userId,
    })
  },
  async updatableOrFail(postId: number, userId: number) {
    await getRepository(Post).findOneOrFail({
      id: postId,
      userId,
    })
  },
}
