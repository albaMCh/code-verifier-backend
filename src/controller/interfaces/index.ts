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

export interface IKataController{
      // Read all users from database || get User By ID
      getKatas(page: number, limit: number, id?: string): Promise<any>
      // Create New Kata
      createKata(kata: IKata): Promise<any>
      // Delete Kata By ID
      deleteKata(id?:string): Promise<any>
      // Update Kata
      updateKata(id:string, kata: IKata): Promise<any>
  
}
