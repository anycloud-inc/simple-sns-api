import { IsEmail, IsNotEmpty } from 'class-validator'
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

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
  name!: string

  @Column({ nullable: true })
  iconImageUrl?: string

  @CreateDateColumn()
  readonly createdAt?: Date

  @UpdateDateColumn()
  readonly updatedAt?: Date
}
