import { Delete, Get, Post, Put, Query, Route, Tags } from "tsoa";
import { IUsersController } from "./interfaces";
import { LogSuccess, LogError, LogWarning } from "@/utils/logger";

// ORM - Users Collection
import { deleteUserByID, getAllUsers, getUserByID, createUser, updateUserByID } from "../domain/entities/orm/User.orm"
import { BasicResponse } from "./types";


@Route("/api/users")
@Tags("UsersController")
export class UserController implements IUsersController {
    updateUserByID: any;
   
   
   
    
    /**
     *  Endpoint to retreive the users in the Collection "Users" of DB
     * @param {string} id Id of user to retreive (optional)
     * @returns All user o user found by ID
     */

    @Get("/")
    public async getUsers(@Query()id?: string): Promise<any> {

        let response: any = '';

        if(id){
            LogSuccess(`[/api/users] Get User By ID: ${id}`);
            response = await getUserByID(id);
            
        }else {
            LogSuccess('[/api/users] Get All Users Request')
            response = await getAllUsers ();
            

            
        }

        return response;
    }

     /**
     *  Endpoint to delete the users in the Collection "Users" of DB
     * @param {string} id Id of user to delete (optional)
     * @returns message informing if deletion was correct
     */
        @Delete("/")
        public async deleteUser(@Query()id?: string): Promise<any> {
    
            let response: any = '';
    
            if(id){
                LogSuccess(`[/api/users] Delete User By ID: ${id}`);
                 await deleteUserByID(id).then((r)=>{
                    response ={
                        message: `User with id ${id} deleted successfully`
                    }
                });
                
            }else {
                LogWarning('[/api/users] Delete User Request WITHOUT ID')
                response = {
                    message: 'please, provide an ID to remove from database'
                }
                
    
                
            }
    
            return response;
   
    }
    @Post("/")
    public async createUser(user: any): Promise<any> {
        
       let response: any = '';
       await createUser(user).then((r)=>{
        LogSuccess(`[/api/users] Create User: ${user}`);
           response = {
               message: `User created successfully: ${user.name}`
           }
       })
   
    }

    @Put("/")
    public async updateUser(@Query()id: string, user: any): Promise<any> {
        let response: any = '';
    
        if(id){
            LogSuccess(`[/api/users] Update User By ID: ${id}`);
             await this.updateUserByID(id, user).then((r)=>{
                response ={
                    message: `User with id ${id} update successfully`
                }
            });
            
        }else {
            LogWarning('[/api/users] Update User Request WITHOUT ID')
            response = {
                message: 'please, provide an ID to update an existing user'
            }
            
    }
    
    return response;
}
@Get('/katas')
    public async  getKatas(@Query()page: number, @Query()limit: number, @Query()id: string): Promise<any> {
        let response: any = '';

        if(id){
            LogSuccess(`[/api/users/katas] Get Katas from User By ID: ${id} `);
            response = await getKatasFromUser(page, limit, id);
        }else {
            LogSuccess('[/api/users/katas] Get All Katas without id')
            response = {
                message: 'ID from user is needed'
            }
        }
        
        return response;
        
    }



}