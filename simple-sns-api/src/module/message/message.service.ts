import { validateOrFail } from 'src/lib/validate'
import { getRepository } from 'typeorm'
import { Message } from './message.entity'

interface CreateParams {
  content: string
  roomId: string
}

interface CreateViaPostParams {
  content: string
  postId: number
}

export const messageService = {
  toOneContents() {
    return ['user', 'post']
  },

  async findLatestMessages(roomIds: string[]): Promise<Message[]> {
    if (roomIds.length === 0) return []
    const latestMessageInfos = await getRepository(Message)
      .createQueryBuilder('message')
      .where('message.roomId IN (:...roomIds)', { roomIds })
      .groupBy('message.roomId')
      .select(['MAX(message.id) AS id'])
      .getRawMany()

    const messages = await getRepository(Message).findByIds(
      latestMessageInfos.map(x => x.id),
      {
        relations: this.toOneContents(),
        order: { createdAt: 'DESC' },
      }
    )

    return messages
  },

  async createMessage(userId: number, params: CreateParams): Promise<Message> {
    const repo = getRepository(Message)
    let message = repo.create({ ...params, userId })
    await validateOrFail(message)
    message = await repo.save(message)
    message = await messageService.findOne(message.id!)
    return message
  },

  async findOne(messageId: number): Promise<Message> {
    const message = await getRepository(Message).findOneOrFail(messageId, {
      relations: this.toOneContents(),
    })
    return message
  },
}
