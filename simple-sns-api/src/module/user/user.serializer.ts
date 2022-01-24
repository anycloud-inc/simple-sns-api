import { User } from './user.entity'
import * as openapi from 'simple-sns-openapi-server-interface/outputs/openapi_server_interface/ts/types'

export const userSerializer = {
  build(user: User): openapi.components['schemas']['EntityUser'] {
    return {
      id: user.id!,
      name: user.name,
      iconImageUrl: user.iconImageUrl,
    }
  },
}
