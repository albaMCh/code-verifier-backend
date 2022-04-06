import { Get, Query, Route, Tags } from 'tsoa';
import { UserResponse } from './types';
import { IUsersController } from './interfaces';
import { LogSuccess } from '../utils/logger';
import { GetAllUsers } from '@/domain/entities/orm/User.orm';

@Route('/api/users')
@Tags('UsersController')
export class UsersController implements IUsersController {
  /**
   * Endopoint to retreive the users list in JSON
   * @param{ string | undefined} name Name of user to be greeted
   * @returns {BasicResponse} Promise of basicresponse
   */
  @Get('/')
  public async getUsers (@Query()name?: string): Promise<UserResponse[] | undefined> {
    LogSuccess('[/api/users] Get Request');

    const users = await GetAllUsers();

    return users;
  }
}
