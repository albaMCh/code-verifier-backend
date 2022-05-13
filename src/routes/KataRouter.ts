import express, { Request, Response } from "express";
import { KatasController } from "../controller/KatasController";
import { LogInfo } from "../utils/logger";

import jwt from "jsonwebtoken";

// Body Parser to read BODY from requests
import bodyParser from "body-parser";

let jsonParser = bodyParser.json();

// JWT Verifier MiddleWare
import { verifyToken } from "../middlewares/verifyToken.middleware";
import { KataLevel, IKata } from "../domain/interfaces/IKata.interface";

// Router from express
let katasRouter = express.Router();

//File Uploader
import fileUpload from "express-fileupload";

// http://localhost:8000/api/katas
katasRouter
  .route("/")
  // GET:
  .get(verifyToken, async (req: Request, res: Response) => {
    // Obtain a Query Param (ID)
    const id: any = req?.query?.id;
    const level: any = req?.query.level;

    // Pagination
    const page: any = req?.query?.page || 1;
    const limit: any = req?.query?.limit || 10;
    const user: any = req?.query.user;
    const sortProperty: any = req?.query.sortProperty;
    const sortType: any = req?.query.sortType;

    LogInfo(`Query Param: ${id}`);
    // Controller Instance to excute method
    const controller: KatasController = new KatasController();
    // Obtain Reponse
    const response: any = await controller.getKatas(
      page,
      limit,
      id,
      user,
      level,
      sortProperty,
      sortType
    );
    // Send to the client the response
    return res.status(200).send(response);
  })
  // DELETE:
  .delete(verifyToken, async (req: Request, res: Response) => {
    // Obtain a Query Param (ID)
    const id: any = req?.query?.id;
    const token: any = req.headers["x-access-token"];
    const secret = process.env.SECRETKEY || "MYSECRETKEY";
    const user: any = jwt.verify(token, secret);
    LogInfo(`Query Param: ${id}`);
    // Controller Instance to excute method
    const controller: KatasController = new KatasController();
    // Obtain Reponse
    const response: any = await controller.deleteKata(id, user.id, user.role);
    // Send to the client the response
    return res.status(200).send(response);
  })
  // PUT
  .put(jsonParser, verifyToken, async (req: Request, res: Response) => {
    // Obtain a Query Param (ID)
    const id: any = req?.query?.id;

    console.log("-------------");
    console.log("id:", id);

    const controller: KatasController = new KatasController();

    const existingKata = await controller.getKatas(0, 0, id);

    console.log("------------");
    console.log("Kata:", existingKata);

    if (!existingKata) {
      return res.status(404).send({
        message:
          "[ERROR] Updating Kata. You need to send all attrs of Kata to update it",
      });
    }

    // Read from body
    const name: string = req?.body?.name;
    const description: string = req?.body?.description || "";
    const level: KataLevel = req?.body?.level || KataLevel.BASIC;
    const intents: number = existingKata.intents;
    const stars = { average: 0, users: [] };
    const creator: string = req?.body?.creator;
    const solution: string = req?.body?.solution || "";
    const participants: string[] = req?.body?.participants || [];

    console.log("------------");
    console.log(level);

    if (name && description && level) {
      // Controller Instance to excute method

      let kata: IKata = {
        name: name,
        description: description,
        level: level,
        intents: intents,
        stars: stars,
        creator: creator,
        solution: solution,
        participants: participants,
      };

      // Obtain Response
      const response: any = await controller.updateKata(id, kata);

      // Send to the client the response
      return res.status(200).send(response);
    } else {
      return res.status(400).send({
        message:
          "[ERROR] Updating Kata. You need to send all attrs of Kata to update it",
      });
    }
  })
  // POST
  .post(jsonParser, verifyToken, async (req: Request, res: Response) => {
    // Read from body
    const name: string = req?.body?.name;
    const description: string = req?.body?.description || "Default description";
    const level: KataLevel = req?.body?.level || KataLevel.BASIC;
    const intents: number = 0;
    const stars: any = { average: 0, users: [] };

    const token: any = req.headers["x-access-token"];
    const secret = process.env.SECRETKEY || "MYSECRETKEY";
    const user: any = jwt.verify(token, secret);

    console.log("--------");
    console.log(user);
    const creator: any = user?.id;
    const solution: string = req?.body?.solution || "Default Solution";
    let participants: any[] = [];

    if (name && description && level && creator && solution) {
      let kata: IKata = {
        name: name,
        description: description,
        level: level,
        intents: intents,
        stars: stars,
        creator: creator,
        solution: solution,
        participants: participants,
      };

      // Controller Instance to excute method
      const controller: KatasController = new KatasController();

      // Obtain Response
      const response: any = await controller.createKata(kata);

      // Send to the client the response
      return res.status(201).send(response);
    } else {
      return res.status(400).send({
        message:
          "[ERROR] Creating Kata. You need to send all attrs of Kata to create",
      });
    }
  });
katasRouter.route("/uploadFile").post(
  jsonParser,
  /*verifyToken,*/ async (req: Request, res: Response) => {
    let files: any = req?.files;
    try {
      if (!files) {
        res.send({
          status: false,
          message: "There was no file found in request",
          payload: {},
        });
      } else {
        //Use the name of the input field (i.e. "file") to retrieve the uploaded file
        let file = files.file;
        //Use the mv() method to place the file in upload directory (i.e. "uploads")
        file.mv("./uploads/" + file.name);
        //send response
        res.send({
          status: true,
          message: "File was uploaded successfuly",
          payload: {
            name: file.name,
            mimetype: file.mimetype,
            size: file.size,
            // path: "/files/uploads/",
            // url: "https://my-ftp-server.com/bjYJGFYgjfVGHVb",
          },
        });
      }
    } catch (err) {
      res.status(500).send({
        status: false,
        message: "Unexpected problem",
        payload: {},
      });
    }
  }
);
// http://localhost:8000/api/katas/vote
katasRouter
  .route("/valoration")
  // PUT
  .put(verifyToken, async (req: Request, res: Response) => {
    // Obtain a Query Param
    const id: any = req?.query.id;
    const vote: any = req?.query.vote;
    const token: any = req.headers["x-access-token"];
    const secret = process.env.SECRETKEY || "MYSECRETKEY";
    const user: any = jwt.verify(token, secret);
    LogInfo(`Query Params: ${id}, ${vote}`);
    // Controller Instance to execute method
    const controller: KatasController = new KatasController();
    // Obtain Response
    const response: any = await controller.valorationKata(id, vote, user.id);
    // Send to the client the response
    return res.send(response);
  });

// http://localhost:8000/api/katas/vote
katasRouter
  .route("/vote")
  // PUT
  .put(verifyToken, async (req: Request, res: Response) => {
    // Obtain a Query Param
    const id: any = req?.query.id;
    const vote: any = req?.query.vote;
    const token: any = req.headers["x-access-token"];
    const secret = process.env.SECRETKEY || "MYSECRETKEY";
    const user: any = jwt.verify(token, secret);
    LogInfo(`Query Params: ${id}, ${vote}`);
    // Controller Instance to execute method
    const controller: KatasController = new KatasController();
    // Obtain Response
    const response: any = await controller.valorationKata(id, vote, user.id);
    // Send to the client the response
    return res.status(response.status || 200).send(response);
  });

// http://localhost:8000/api/katas/solve
katasRouter
  .route("/solve")
  // PUT
  .put(jsonParser, verifyToken, async (req: Request, res: Response) => {
    // Obtain a Query Param
    const id: any = req?.query.id;
    const solution: string = req?.body?.solution;
    const token: any = req.headers["x-access-token"];
    const secret = process.env.SECRETKEY || "MYSECRETKEY";
    const user: any = jwt.verify(token, secret);
    LogInfo(`Query Params: ${id}`);
    // Controller Instance to execute method
    const controller: KatasController = new KatasController();
    // Obtain Response
    const response: any = await controller.solveKata(id, solution, user.id);
    // Send to the client the response
    return res.send(response);
  });

// Export Users Router
export default katasRouter;

/**
 *
 * Get Documents => 200 OK
 * Creation Documents => 201 OK
 * Deletion of Documents => 200 (Entity) / 204 (No return)
 * Update of Documents =>  200 (Entity) / 204 (No return)
 *
 */
