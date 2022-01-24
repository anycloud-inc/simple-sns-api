import { User } from '../user/user.entity'
import * as openapi from 'simple-sns-openapi-server-interface/outputs/openapi_server_interface/ts/types'

export const accountSerializer = {
  build(user: User): openapi.components['schemas']['EntityAccount'] {
    return {
      id: user.id!,
      name: user.name,
      email: user.email,
      iconImageUrl: user.iconImageUrl,
    }
  },
}
