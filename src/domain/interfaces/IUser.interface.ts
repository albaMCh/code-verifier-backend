export enum RolType {
  USER = "User",
  ADMINISTRATOR = "Administrator",
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  age: number;
  katas: string[];
  role: RolType;
}
