import { getRepository } from 'typeorm'
import { Message } from './message.entity'

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
}
