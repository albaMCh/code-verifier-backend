import { BasicResponse } from './types'
import { IGoodbyeController } from './interfaces/index'
import { LogSuccess } from '../utils/logger'

export class GoodbyeController implements IGoodbyeController {
  public async getMessage (name?: string): Promise<BasicResponse> {
    LogSuccess('[/api/goodbye] Get Request')

    return { message: `Goodbye, ${name || 'World!'}` }
  }
}
