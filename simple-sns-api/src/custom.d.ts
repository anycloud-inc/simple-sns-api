import { User } from './module/user/user.entity'

declare global {
  namespace Express {
    interface Request {
      currentUser: User
    }
  }
}
