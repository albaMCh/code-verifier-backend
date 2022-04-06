import { UserResponse } from '@/controller/types'
import express, { Request, Response } from 'express'
import { UsersController } from '../controller/UsersController'
import { LogInfo } from '../utils/logger'

// Router from express
const usersRouter = express.Router()
//  GET http:// localhost: 8000/api/hello
usersRouter.route('/')
  .get(async (req:Request, res: Response) => {
  // Obtain a Query Param
    const name: any = req?.query?.name
    LogInfo(`Query Param: ${name}`)

    const controller: UsersController = new UsersController()
    // Obtain Response
    const response: UserResponse[] | undefined = await controller.getUsers(name)
    // Send to he client the response
    return res.send(response)
  })

// Export hello router
export default usersRouter
