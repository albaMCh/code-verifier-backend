import { userEntity } from '../User.entity'

import { LogSuccess, LogError } from '@/utils/logger'

//  CRUD
export const GetAllUsers = async (): Promise<any[] | undefined> => {
  try {
    const userModel = userEntity()
    // Search all use
    return await userModel.find({ isDelete: false })
  } catch (error) {
    LogError(`[ORM ERROR]: Getting All Users: ${error}`)
  }
}

// TODO:
// Get User By ID
// Get User By Email
// Delete User By ID
// - Create New User
// - Update User By ID
