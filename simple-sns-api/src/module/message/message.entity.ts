import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
  Index,
} from 'typeorm'
import { User } from '../user/user.entity'
import { IsNotEmpty } from 'class-validator'
import { ForbidWhiteSpaceOnly, IsValidUser } from './message.validator'
import { Room } from '../room/room.entity'
import { Post } from '../post/post.entity'

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id?: number

  @Column({ length: 2000 })
  @IsNotEmpty()
  @ForbidWhiteSpaceOnly({
    message: 'content must be contain characters other than whitespace',
  })
  content!: string

  @Column({ nullable: true })
  @IsValidUser({ message: 'invalid userId' })
  userId?: number

  @Column()
  @IsNotEmpty()
  roomId!: string

  @Column({ nullable: true })
  postId?: number

  @ManyToOne(_ => User, obj => obj.messages, { onDelete: 'CASCADE' })
  @Index()
  user?: User

  @ManyToOne(_ => Room, obj => obj.messages, { onDelete: 'CASCADE' })
  @Index()
  room?: Room

  @ManyToOne(_ => Post, obj => obj.messages, { onDelete: 'SET NULL' })
  @Index()
  post?: Post

  @CreateDateColumn()
  readonly createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date
}
