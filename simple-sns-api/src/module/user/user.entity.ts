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
import { Post } from '../post/post.entity'

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

  @CreateDateColumn()
  readonly createdAt?: Date

  @UpdateDateColumn()
  readonly updatedAt?: Date
}
