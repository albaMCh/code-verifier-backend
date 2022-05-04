export enum KataLevel {
  BASIC = "Basic",
  MEDIUM = "Medium",
  HIGH = "High",
}
export interface IVotingUser {
  user: string;
  valoration: number;
}

export interface IKata {
  name: string;
  description: string;
  level: KataLevel;
  intents: number;
  stars: {
    average: number;
    users: IVotingUser[];
  };
  creator: string; // Id of user
  solution: string;
  participants: string[];
}
