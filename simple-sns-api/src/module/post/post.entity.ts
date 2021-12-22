import { IsNotEmpty } from 'class-validator'
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Message } from '../message/message.entity'
import { User } from '../user/user.entity'

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id?: number

  @Column()
  @IsNotEmpty()
  userId!: number

  @Column({ type: 'text' })
  body!: string

  @ManyToOne(_ => User, obj => obj.posts, { onDelete: 'CASCADE' })
  @Index()
  user?: User

  @OneToMany(_ => Message, obj => obj.post)
  messages?: Message[]

  @CreateDateColumn()
  readonly createdAt?: Date

  @UpdateDateColumn()
  readonly updatedAt?: Date
}
