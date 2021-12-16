import { User } from '../user/user.entity'

export const accountSerializer = {
  build(user: User) {
    return {
      id: user.id!,
      name: user.name,
      email: user.email,
      iconImageUrl: user.iconImageUrl,
    }
  },
}
