import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Unique,
  DeleteDateColumn,
} from 'typeorm'
import { Room } from '../room/room.entity'
import { User } from '../user/user.entity'

@Entity()
@Unique('unique-user-room', ['userId', 'roomId'])
export class RoomUser {
  @PrimaryGeneratedColumn()
  id?: number

  @Column()
  userId!: number

  @Column()
  roomId!: string

  @Column('timestamp', { nullable: true })
  readAt?: Date

  @ManyToOne(() => User, user => user.roomUsers)
  @Index()
  user!: User

  @ManyToOne(() => Room, room => room.roomUsers)
  @Index()
  room!: Room

  @CreateDateColumn()
  readonly createdAt?: Date

  @UpdateDateColumn()
  readonly updatedAt?: Date

  @DeleteDateColumn()
  readonly deletedAt?: Date
}
