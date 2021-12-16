import { IsNotEmpty } from 'class-validator'
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
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

  @CreateDateColumn()
  readonly createdAt?: Date

  @UpdateDateColumn()
  readonly updatedAt?: Date
}
