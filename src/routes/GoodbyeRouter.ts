import express, { Request, Response } from 'express'
import { GoodbyeController } from '../controller/GoodbyeControler'
import { LogInfo } from '../utils/logger'

// Router from express
let goodbyeRouter = express.Router()
//  GET http:// localhost: 8000/api/hello
goodbyeRouter.route('/')
  .get(async (req:Request, res: Response) => {
  // Obtain a Query Param
    let name: any = req?.query?.name
    LogInfo(`Query Param: ${name}`)

    const controller: GoodbyeController = new GoodbyeController()
    // Obtain Response
    const response = await controller.getMessage(name)
    // Send to he client the response
    return res.send(response)
  })

// Export hello router
export default goodbyeRouter
