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

/**
 * Method to obtain all Users from Collection "Users" in Mongo Server
 */
export const getAllUsers = async (
  page: number,
  limit: number
): Promise<any[] | undefined> => {
  try {
    let userModel = userEntity();

    let response: any = {};

    // Search all users (using pagination)
    await userModel
      .find({ isDeleted: false })
      .select("name email age katas")
      .limit(limit)
      .skip((page - 1) * limit)
      .exec()
      .then((users: IUser[]) => {
        response.users = users;
      });

    // Count total documents in collection "Users"
    await userModel.countDocuments().then((total: number) => {
      response.totalPages = Math.ceil(total / limit);
      response.currentPage = page;
    });

    return response;
  } catch (error) {
    LogError(`[ORM ERROR]: Getting All Users: ${error}`);
  }
};

// - Get User By ID
export const getUserByID = async (id: string): Promise<any | undefined> => {
  try {
    let userModel = userEntity();

    // Search User By ID
    return userModel.findById(id).select("name email age katas");
  } catch (error) {
    LogError(`[ORM ERROR]: Getting User By ID: ${error}`);
  }
};
// -Get User By Name OR Email
export const getUserByNameOrEmail = async (
  name: string,
  email: string
): Promise<any | undefined> => {
  try {
    const userModel = userEntity();
    // Search User by Name
    return await userModel.findOne({
      $or: [
        { name: { $regex: new RegExp(name, "i") } },
        { email: { $regex: new RegExp(email, "i") } },
      ],
    });
  } catch (error) {
    LogError(`[ORM ERROR]: Getting User by Name: ${error}`);
  }
};

// - Delete User By ID
export const deleteUserByID = async (id: string): Promise<any | undefined> => {
  try {
    let userModel = userEntity();

    // Delete User BY ID
    return userModel.deleteOne({ _id: id });
  } catch (error) {
    LogError(`[ORM ERROR]: Deleting User By ID: ${error}`);
  }
};

// - Update User By ID
export const updateUserByID = async (
  id: string,
  user: any
): Promise<any | undefined> => {
  try {
    const userModel = userEntity();

    // Update User
    return userModel.findByIdAndUpdate(id, user);
  } catch (error) {
    LogError(`[ORM ERROR]: Updating User ${id}: ${error}`);
  }
};

/**
 * Method to obtain all Users from Collection "Users" in Mongo Server
 */
export const getKatasFromUser = async (
  page: number,
  limit: number,
  id: string
): Promise<any[] | undefined> => {
  try {
    let userModel = userEntity();
    let katasModel = kataEntity();

    let katasFound: IKata[] = [];

    let response: any = {
      katas: [],
    };

    console.log("User ID", id);

    await userModel
      .findById(id)
      .then(async (user: IUser) => {
        response.user = user.email;

        // console.log('Katas from User', user.katas);

        // Create types to search
        let objectIds: mongoose.Types.ObjectId[] = [];
        user.katas.forEach((kataID: string) => {
          let objectID = new mongoose.Types.ObjectId(kataID);
          objectIds.push(objectID);
        });

        return katasModel
          .find({ _id: { $in: objectIds } })
          .then((katas: IKata[]) => {
            katasFound = katas;
          });
      })
      .catch((error) => {
        LogError(`[ORM ERROR]: Obtaining User: ${error}`);
      });

    response.katas = katasFound;

    return response;
  } catch (error) {
    LogError(`[ORM ERROR]: Getting All Users: ${error}`);
  }
};
