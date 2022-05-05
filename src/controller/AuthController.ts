import { Delete, Get, Post, Put, Query, Route, Tags } from "tsoa";
import { IAuthController } from "./interfaces";
import { LogSuccess, LogError, LogWarning } from "../utils/logger";
import { IUser } from "../domain/interfaces/IUser.interface";
import { IAuth } from "../domain/interfaces/IAuth.interface";

// ORM imports
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../domain/entities/orm/Auth.orm";
import {
  getUserByID,
  getUserByNameOrEmail,
} from "../domain/entities/orm/User.orm";
import { AuthResponse, ErrorResponse } from "./types";

@Route("/api/auth")
@Tags("AuthController")
export class AuthController implements IAuthController {
  @Post("/register")
  public async registerUser(@Query() user: IUser): Promise<any> {
    let response: any = "";
    let userFound: boolean = false;
    if (user) {
      await getUserByNameOrEmail(user.name, user.email).then((r) => {
        if (r) {
          userFound = true;
          LogWarning("[/api/auth/register] User Already registered");
          return {
            message: `User Already registered: ${user.name}`,
          };
        }
      });
      if (!userFound) {
        LogSuccess(`[/api/auth/register] register user:  ${user.email}`);
        await registerUser(user).then((r) => {
          LogSuccess(`[/api/auth/register] Create User: ${user.email}`);
          response = {
            message: `User created succesfully: ${user.name}`,
          };
        });
      }
    } else {
      LogWarning("[/api/auth/register] Register user without USER");
      return {
        message: "Pelase, provide the user to register. ",
      };
    }
    return response;
  }

  @Post("/login")
  public async loginUser(auth: IAuth): Promise<any> {
    let response: AuthResponse | ErrorResponse | undefined;

    if (auth) {
      LogSuccess(`[/api/auth/login] Login User: ${auth.email} `);
      let data = await loginUser(auth);
      response = {
        token: data.token,
        message: `Welcome, ${data.user.name}`,
      };
    } else {
      LogWarning(
        "[/api/auth/login] Login needs Auth Entity (email && password"
      );
      response = {
        error: "[AUTH ERROR]: Email & Password are needed",
        message: "Please, provide a email && password to login",
      };
    }

    return response;
  }

  /**
   * Endpoint to retreive the User in the Collection "Users" of DB
   * Middleware: Validate JWT
   * In headers you must add the x-access-token with a valid JWT
   * @param {string} id Id of user to retreive (optional)
   * @returns All user o user found by iD
   */
  @Get("/me")
  public async userData(@Query() id: string): Promise<any> {
    let response: any = "";

    if (id) {
      LogSuccess(`[/api/users] Get User Data By ID: ${id} `);
      response = await getUserByID(id);
    }

    return response;
  }

  @Post("/logout")
  public async logoutUser(): Promise<any> {
    let response: any = "";

    // TODO: Close Session of user
    throw new Error("Method not implemented.");
  }
}
