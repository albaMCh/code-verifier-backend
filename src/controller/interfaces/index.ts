import { BasicResponse } from '../types'
import { UserResponse } from '../types'

export interface IHelloController {
    getMessage(name?:string): Promise<BasicResponse>
}

export interface IGoodbyeController {
    getMessage(name?:string): Promise<BasicResponse>
}

export interface IUsersController {
    getUsers(name?:string): Promise<UserResponse[] | undefined>
}
