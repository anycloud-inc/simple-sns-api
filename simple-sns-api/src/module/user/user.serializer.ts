import { User } from './user.entity'

export const userSerializer = {
  build(user: User) {
    return {
      id: user.id!,
      name: user.name,
      iconImageUrl: user.iconImageUrl,
    }
  },
}
