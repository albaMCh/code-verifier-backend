import { userEntity } from '../User.entity'

import { LogSuccess, LogError } from '@/utils/logger'
import { StringValidator } from 'tsoa'

//  CRUD
export const getAllUsers = async (): Promise<any[] | undefined> => {
  try {
    const userModel = userEntity()
    // Search all use
    return await userModel.find({ isDeleted: false })
  } catch (error) {
    LogError(`[ORM ERROR]: Getting All Users: ${error}`)
  }
}


// Get User By ID
export const getUserByID = async (id: String) : Promise<any | undefined> => {

  try {
    let userModel = userEntity();

    // Search User By ID
    return await userModel.findById(id);

  }catch (error) {
    LogError(`[ORM ERROR]: Getting Users by ID: ${error}`);

  }
}

// TODO:
// Get User By Email
// Delete User By ID
export const deleteUserByID = async (id: string): Promise<any | undefined> => {

  try{
    let userModel = userEntity();

    // Delete User by ID
    return await userModel.deleteOne({ _id: id })
  }catch (error) {
    LogError(`[ORM ERROR]: Deleting User by ID: ${error}`);

  }
}


// - Create New User
export const createUser = async (user:any): Promise<any | undefined> => {

  try {

    let userModel = userEntity();

    //Create / Insert new User
    return await userModel.create(user);



  }catch (error) {
    LogError(`[ORM ERROR]: Creating User: ${error}`);



  }
}
// - Update User By ID

export const updateUserByID = async (user:any, id: string): Promise<any | undefined> =>{
  
  try{

    let userModel = userEntity();

    //Update User
    return await userModel.findByIdAndUpdate( id, user);



  }catch(error) {
    LogError(`[ORM ERROR]: Updating User ${id}: ${error}`);
  }
}



