import { IsEmail, IsNotEmpty } from 'class-validator'
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
import { Post } from '../post/post.entity'
import { RoomUser } from '../room-user/room-user.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number

  @Column()
  @IsNotEmpty()
  @IsEmail()
  @Index({ unique: true })
  email!: string

  @Column()
  password!: string

  @Column()
  @IsNotEmpty()
  name!: string

  @Column({ nullable: true })
  iconImageUrl?: string

  @OneToMany(_ => Post, obj => obj.user)
  posts?: Post[]

  @OneToMany(() => RoomUser, obj => obj.user, { cascade: true })
  roomUsers!: RoomUser[]

  @OneToMany(_ => Message, obj => obj.user, { cascade: true })
  messages?: Message[]

  @CreateDateColumn()
  readonly createdAt?: Date

  @UpdateDateColumn()
  readonly updatedAt?: Date
}
