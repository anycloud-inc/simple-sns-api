import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Message } from '../message/message.entity'
import { RoomUser } from '../room-user/room-user.entity'
import { User } from '../user/user.entity'

@Entity()
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id?: string

  @Column({ nullable: true })
  @Index({ unique: true })
  // 所属ユーザーのidを昇順に並べて'-'で繋げたもの。 e.g. 5-10-22
  usersId?: string

  @OneToMany(() => RoomUser, obj => obj.room, { cascade: true })
  roomUsers?: RoomUser[]

  @OneToMany(_ => Message, obj => obj.room, { cascade: true })
  messages?: Message[]

  @CreateDateColumn()
  readonly createdAt?: Date

  @UpdateDateColumn()
  readonly updatedAt?: Date

  latestMessage?: Message

  get users(): User[] | undefined {
    return this.roomUsers?.map(x => x.user)
  }

  readBy(user: User): boolean | undefined {
    const roomUser = this.roomUsers?.find(x => x.userId == user.id)
    if (this.latestMessage == null || roomUser == null) return undefined
    return (
      this.latestMessage?.userId == user.id ||
      this.roomUsers?.find(x => x.userId == user.id)?.readAt! >=
        this.latestMessage?.createdAt!
    )
  }

  userIds(): number[] | undefined {
    if (this.usersId) return this.usersId.split('-').map(x => parseInt(x))
  }
}
