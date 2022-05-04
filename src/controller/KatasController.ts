import { Delete, Get, Post, Put, Query, Route, Tags } from "tsoa";
import { IKataController } from "./interfaces";
import { LogSuccess, LogError, LogWarning } from "../utils/logger";

// ORM - Users Collection
import {
  getAllKatas,
  getKataByID,
  updateKataByID,
  deleteKataByID,
  createKata,
  valorateKataByID,
  solveKataByID,
} from "../domain/entities/orm/kata.orm";
import { IKata } from "@/domain/interfaces/IKata.interface";
import { isShorthandPropertyAssignment } from "typescript";

@Route("/api/katas")
@Tags("KatasController")
export class KatasController implements IKataController {
  /**
   * Endpoint to retreive the katas in the Collection "Katas" of DB
   * @param {string} id Id of Kata to retreive (optional)
   * @returns All katas o kata found by ID
   */
  @Get("/")
  public async getKatas(
    @Query() page: number,
    @Query() limit: number,
    @Query() id?: string,
    @Query() user?: string,
    @Query() level?: number,
    @Query() sortProperty?: string,
    @Query() sortType?: string
  ): Promise<any> {
    // TODO: sortType asc | desc

    // TODO sortProperty valoration | level

    let response: any = "";

    if (id) {
      LogSuccess(`[/api/katas] Get Kata By ID: ${id} `);
      response = await getKataByID(id);
    } else {
      LogSuccess("[/api/katas] Get All Katas Request");
      response = await getAllKatas(
        page,
        limit,
        user,
        level,
        sortProperty,
        sortType
      );
    }

    return response;
  }

  @Post("/")
  public async createKata(kata: IKata): Promise<any> {
    let response: any = "";

    if (kata) {
      LogSuccess(`[/api/katas] Create New Kata: ${kata.name} `);
      await createKata(kata).then((r) => {
        LogSuccess(`[/api/katas] Created Kata: ${kata.name} `);
        response = {
          message: `Kata created successfully: ${kata.name}`,
        };
      });
    } else {
      LogWarning("[/api/katas] Register needs Kata Entity");
      response = {
        message:
          "Kata not Registered: Please, provide a Kata Entity to create one",
      };
    }
    return response;
  }

  /**
   * Endpoint to delete the Katas in the Collection "Katas" of DB
   * @param {string} id Id of Kata to delete (optional)
   * @returns message informing if deletion was correct
   */
  @Delete("/")
  public async deleteKata(
    @Query() id?: string,
    userID?: any,
    userRole?: any
  ): Promise<any> {
    let response: any = "";

    if (id) {
      LogSuccess(`[/api/katas] Delete Kata By ID: ${id} `);
      await deleteKataByID(id, userID, userRole).then((r) => {
        response = {
          message: `Kata with id ${id} deleted successfully`,
        };
      });
    } else {
      LogWarning("[/api/katas] Delete Kata Request WITHOUT ID");
      response = {
        message: "Please, provide an ID to remove from database",
      };
    }

    return response;
  }

  @Put("/")
  public async updateKata(
    @Query() id: string,
    kata: IKata,
    userID?: any,
    userRole?: any
  ): Promise<any> {
    let response: any = "";

    if (id) {
      LogSuccess(`[/api/katas] Update Kata By ID: ${id} `);
      await updateKataByID(id, kata, userID, userRole).then((r) => {
        response = {
          message: `Kata with id ${id} updated successfully`,
        };
      });
    } else {
      LogWarning("[/api/katas] Update Kata Request WITHOUT ID");
      response = {
        message: "Please, provide an ID to update an existing user",
      };
    }

    return response;
  }

  // TODO: PUT /api/katas/valorationKata?id=12345

  // TODO PUT /api/katas/12345/valorationKata

  @Put("/valoration")
  public async valorationKata(
    @Query() id: string,
    valoration: number,
    userID: string
  ): Promise<any> {
    let response: any = "";

    if (id && valoration) {
      LogSuccess(`[/api/katas] Valoration Kata By ID: ${id} `);

      await valorateKataByID(id, valoration, userID).then((r) => {
        response = {
          message: `Kata with id ${id} updated successfully`,
        };
      });
    } else {
      LogWarning("[/api/katas] Update Kata Request WITHOUT ID");
      response = {
        message: "Please, provide an ID to update an existing user",
      };
    }

    return response;
  }
  // api/katas/upload
  @Post("/upload")
  public async updateKataFile(): Promise<any> {
    throw new Error("Method not implemented");
  }
  /**
   * Endpoint to vote a Kata in the Collection "Katas" of DB
   * @param {string} id Id of kata to update
   * @param {vote} solution Vote to give to the Kata
   * @returns message informing if voting was successfull
   */
  @Put("/solve")
  public async solveKata(
    @Query() id: string,
    @Query() solution: any,
    @Query() userID: any
  ): Promise<any> {
    let response: any = "";
    if (id && solution) {
      LogSuccess(`[/api/katas] Solving Kata by ID: ${id}`);
      await solveKataByID(id, solution, userID).then((r) => {
        response = {
          message: r.message,
        };
      });
    } else {
      LogWarning("[/api/katas] Solve Kata Request WITHOUT ID");
      return {
        message: "Please, provide an ID and a solution to solve the Kata ",
      };
    }
    return response;
  }
}
