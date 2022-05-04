import { userEntity } from "../User.entity";

import { LogSuccess, LogError } from "../../../utils/logger";
import { IUser } from "../../interfaces/IUser.interface";
import { IAuth } from "../../interfaces/IAuth.interface";

// Environment variables
import dotenv from "dotenv";

// BCRYPT for passwords
import bcrypt from "bcrypt";

// JWT
import jwt from "jsonwebtoken";
import { UserResponse } from "../../types/UserResponse.type";
import { kataEntity } from "../../entities/Kata.entity";
import { IKata } from "../../interfaces/IKata.interface";
import mongoose from "mongoose";

// Configuration of environment variables
dotenv.config();

// Obtain Secret key to generate JWT
const secret = process.env.SECRETKEY || "MYSECRETKEY";

// CRUD

// Register User
export const registerUser = async (user: IUser): Promise<any | undefined> => {
  try {
    let userModel = userEntity();

    // Create / Insert new User
    return await userModel.create(user);
  } catch (error) {
    LogError(`[ORM ERROR]: Creating User: ${error}`);
  }
};

// Login User
export const loginUser = async (auth: IAuth): Promise<any | undefined> => {
  try {
    let userModel = userEntity();

    let userId;

    let userFound: IUser | undefined = undefined;
    let token = undefined;
    // Check if user exists by Unique Email
    await userModel
      .findOne({ email: auth.email })
      .then((user) => {
        userFound = user as IUser;
        userId = user._id;
      })
      .catch((error) => {
        console.log("-----");
        console.error(`[ERROR Authentication in ORM]: User Not Found`);
        throw new Error(
          `[ERROR Authentication in ORM]: User Not Found: ${error}`
        );
      });

    // Check if Password is Valid (compare with bcrypt)
    let validPassword = bcrypt.compareSync(auth.password, userFound!.password);
    if (!validPassword) {
      console.error(`[ERROR Authentication in ORM]: Password Not Valid`);
      throw new Error(`[ERROR Authentication in ORM]: Password Not Valid`);
    }

    // Generate our JWT
    token = jwt.sign(
      {
        email: userFound!.email,
        password: validPassword,
        id: userId,
      },
      secret,
      {
        expiresIn: "3h",
      }
    );

    return {
      user: userFound,
      token: token,
    };
    console.log("-------");
  } catch (error) {
    LogError(`[ORM ERROR]: Creating User: ${error}`);
  }
};

// Logout User
export const logoutUser = async (): Promise<any | undefined> => {
  // TODO: NOT IMPLEMENTED
};
