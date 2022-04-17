import { BasicResponse } from '../types'
import { UserResponse } from '../types'

export interface IHelloController {
    getMessage(name?:string): Promise<BasicResponse>
}

export interface IGoodbyeController {
    getMessage(name?:string): Promise<BasicResponse>
}

export interface IUsersController {
    
    // Read all users from datebases || get User 
    
    getUsers(id?: string): Promise<any>
    // Delete User By ID
    deleteUser(id?: string): Promise<any>
    // Create new User
    createUser(user:any): Promise<any>
    // Update user
    updateUser(id:string, user: any): Promise<any>

}
