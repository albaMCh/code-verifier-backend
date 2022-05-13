import { kataEntity } from "../../entities/Kata.entity";

import { LogSuccess, LogError } from "../../../utils/logger";
import { IKata } from "../../interfaces/IKata.interface";

import mongoose from "mongoose";

// Environment variables
import dotenv from "dotenv";
import { userEntity } from "../User.entity";

// Configuration of environment variables
dotenv.config();

// CRUD

/**
 * Method to obtain all Katas from Collection "Katas" in Mongo Server
 */
export const getAllKatas = async (
  page: number,
  limit: number,
  user: string | undefined,
  level: number | undefined,
  sortProperty: string | undefined,
  sortType: string | undefined
): Promise<any[] | undefined> => {
  try {
    let kataModel = kataEntity();

    let response: any = {};

    let filters: any = {
      isDeleted: false,
    };

    if (user) {
      filters.user = new mongoose.Types.ObjectId(user);
    }

    if (level) {
      filters.level = level;
    }

    //TODOquery.sort({ level: 'asc' })
    // TODO query.sort('-level')

    let sort: string = "-data";

    console.log("sortProperty:", sortProperty);

    if (sortProperty) {
      sort = sortProperty;
    }

    if (sortType === "desc") {
      sort = `-${sort}`;
    }

    console.log("Sort:", sort);

    // TODO: Eliminar al terminar
    //sort = "-stars.average";

    // Search all Katas (using pagination)
    await kataModel
      .find(filters)
      .limit(limit)
      .sort(sort)
      .skip((page - 1) * limit)
      .exec()
      .then((katas: IKata[]) => {
        response.katas = katas;
      });

    // Count total documents in collection "Katas"
    await kataModel.countDocuments().then((total: number) => {
      response.totalPages = Math.ceil(total / limit);
      response.currentPage = page;
    });

    return response;
  } catch (error) {
    LogError(`[ORM ERROR]: Getting All Katas: ${error}`);
  }
};

// - Get Kata By ID
export const getKataByID = async (id: string): Promise<any | undefined> => {
  try {
    let kataModel = kataEntity();

    // Search Kata By ID
    return await kataModel.findById(id);
  } catch (error) {
    LogError(`[ORM ERROR]: Getting Kata By ID: ${error}`);
  }
};

// - Delete Kata By ID
export const deleteKataByID = async (
  id: string,
  userId: any,
  userRole: any
): Promise<any | undefined> => {
  try {
    const userModel = userEntity();
    const kataModel = kataEntity();

    console.log("Kata a eliminar:", id);

    // Delete Kata BY ID
    return kataModel.findById(id).then(async (kataToDelete: any) => {
      console.log("Kata encontrada en base de datos:", kataToDelete);

      console.log("Id del token:", userId);
      if (userId == kataToDelete.creator || userRole === "Administrator") {
        await kataModel.findByIdAndDelete(id);
        console.log("Kata elininada:", id);
        return userModel.findByIdAndUpdate(userId, {
          $pull: { katas: { id } },
        });
      } else {
        throw new Error("You are not allowed to delete this Kata");
      }
    });
  } catch (error) {
    LogError(`[ORM ERROR]: Deleting Kata By ID: ${error}`);
  }
};

// - Create New Kata
export const createKata = async (kata: IKata): Promise<any | undefined> => {
  try {
    const userModel = userEntity();
    const kataModel = kataEntity();
    // Create / Insert new Kata

    return kataModel.create(kata).then(async (kataCreated: any) => {
      return userModel.findByIdAndUpdate(kata.creator, {
        $push: { katas: kataCreated.id },
      });
    });
  } catch (error) {
    LogError(`[ORM ERROR]: Creating Kata: ${error}`);
  }
};

// - Update Kata By ID
export const updateKataByID = async (
  id: string,
  kata: IKata,
  userId: any,
  userRole: any
): Promise<any | undefined> => {
  try {
    const kataModel = kataEntity();

    console.log("---------");
    console.log("Level a persistir:", kata.level);

    return kataModel.findById(id).then(async (kataToUpdate: any) => {
      if (userId == kataToUpdate.creator || userRole === "Administrator") {
        return kataModel.findByIdAndUpdate(id, {
          name: kata.name,
          description: kata.description,
          level: kata.level,
          solution: kata.solution,
        });
      } else {
        return {
          message: "You are not allow to update this Kata",
        };
      }
    });
  } catch (error) {
    LogError(`[ORM ERROR]: Updating Kata ${id} error: ${error}`);
  }
};

// -Valorate Kata By ID
export const valorateKataByID = async (
  id: string,
  vote: any,
  userId: any
): Promise<any | undefined> => {
  try {
    const kataModel = kataEntity();
    const response: any = {};
    // First find kata by Kata
    await kataModel.findById(id).then(async (kataToVote: any) => {
      if (kataToVote.participants.indexOf(userId) === -1) {
        response.message =
          "You cannot update this kata as you are not participating in it";
        throw new Error(response.message);
      }

      const alreadyVoted = kataToVote.stars.users.find((user: any) => {
        return user.user === userId;
      });

      if (!!alreadyVoted) {
        response.message = "You already voted this kata before";
        throw new Error(response.message);
      }

      const oldStars = kataToVote.stars.average;
      const totalVotes: any[] = kataToVote.stars.users;
      const newStars =
        (+oldStars * +totalVotes.length + +vote) / (+totalVotes.length + 1);
      response.kata = await kataModel.findByIdAndUpdate(id, {
        "stars.average": newStars,
        $push: { "stars.users": { user: userId, stars: vote } },
      });
    });

    return response;
  } catch (error: any) {
    LogError(`[ORM ERROR]: Voting Kata ${id} error: ${error}`);
    throw new Error(error.message);
  }
};

// -Solve Kata By ID
export const solveKataByID = async (
  id: string,
  vote: any,
  userId: any
): Promise<any | undefined> => {
  try {
    const kataModel = kataEntity();
    // First find kata by Kata

    const existingKata = await getKataByID(id);

    const query: any = {};

    if (existingKata.participants.indexOf(userId) === -1) {
      query.$push = { participants: userId };
      query.intents = existingKata.intents + 1;
    }

    return kataModel
      .findByIdAndUpdate(id, query)
      .then(async (kataToSolve: any) => {
        return {
          message: kataToSolve.solution,
        };
      });
  } catch (error) {
    LogError(`[ORM ERROR]: Voting Kata ${id} error: ${error}`);
  }
};
