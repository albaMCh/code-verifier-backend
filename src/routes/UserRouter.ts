import { BasicResponse } from '@/controller/types'
import express, { Request, Response } from 'express'
import { UserController } from '../controller/UsersController'
import { LogInfo } from '../utils/logger'

// Router from express
const usersRouter = express.Router()
//  GET http:// localhost: 8000/api/users?id= 
usersRouter.route('/')
  .get(async (req:Request, res: Response) => {
    // Obtain a Query Param (ID)
    let id: any = req?.query?.id;
    LogInfo(`Query Param: ${id}`);
  
    const controller: UserController = new UserController()
    // Obtain Response
    const response: any = await controller.getUsers(id)
    // Send to he client the response
    return res.send(response)
  })
  //DELETE:
  .delete(async (req:Request, res: Response) => {
    // Obtain a Query Param (ID)
    let id: any = req?.query?.id;
    LogInfo(`Query Param: ${id}`);
    const controller: UserController = new UserController();

   
    // Obtain Response
    const response: any = await controller.deleteUser(id)
    // Send to he client the response
    return res.send(response)
   

  })
  
  // POST:
  .post(async (req:Request, res: Response) => {

    let name: any = req?.query?.name;
    let age: any = req?.query?.age;
    let email: any = req?.query?.email;
    const controller: UserController = new UserController()

    let user = {
      name: name || 'defaul',
      email: email || 'default email',
      age: age || 18,
    }
    // Obtain Response
    const response: any = await controller.createUser(user);
    // Send to he client the response
    return res.send(response)
  })
  .put(async (req:Request, res: Response) => {
     // Obtain a Query Param (ID)
     let id: any = req?.query?.id;
     
     let name: any = req?.query?.name;
     let age: any = req?.query?.age;
     let email: any = req?.query?.email;
     LogInfo(`Query Param: ${id}, ${name}, ${age}, ${email}`);
     const controller: UserController = new UserController()
     

     let user = {
      name: name,
      email: email ,
      age: age,
     }
       // Obtain Response
    const response: any = await controller.updateUser(id,user);
    // Send to he client the response
    return res.send(response)
  })



// Export hello router
export default usersRouter
