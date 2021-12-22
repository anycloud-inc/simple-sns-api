import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator'
import { Message } from './message.entity'
import { Room } from '../room/room.entity'
import { getRepository } from 'typeorm'

export function ForbidWhiteSpaceOnly(options?: ValidationOptions) {
  return function (object: Message, propertyName: string) {
    registerDecorator({
      name: 'forbidWhiteSpaceOnly',
      target: object.constructor,
      propertyName,
      options,
      validator: {
        async validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') {
            return false
          }
          if (value.replace(/\s/g, '') === '') {
            return false
          }
          return true
        },
      },
    })
  }
}

// Roomに所属しないuserのメッセージを許さない
export function IsValidUser(options?: ValidationOptions) {
  return function (object: Message, propertyName: string) {
    registerDecorator({
      name: 'isValidUser',
      target: object.constructor,
      propertyName,
      options,
      validator: {
        async validate(userId: any, args: ValidationArguments) {
          const message = args.object as Message
          if (typeof userId === 'string') {
            userId = parseInt(userId)
          }
          if (typeof userId !== 'number') {
            return false
          }
          const room = await getRepository(Room).findOneOrFail(message.roomId, {
            relations: ['roomUsers', 'roomUsers.user'],
          })

          if (!room.roomUsers) return false
          const user = room.roomUsers
            .map(x => x.user)
            .find(user => user.id === message.userId)
          return !!user
        },
      },
    })
  }
}
