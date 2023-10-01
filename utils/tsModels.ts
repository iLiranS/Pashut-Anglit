import { User } from "@prisma/client";

export interface RoomTS {
    id: number;
    usersId: string[];
    user1: string[];
    user2: string[];
    stage: number;
    users: User[]; // Define the users property based on your data structure
  }

  export type role = "admin" | "user" | "anon";

  export type wordLevels = 'easy' | 'medium' | 'hard' | 'impossible'

  export type localArr = ('0' | '1')[];

  export const levelsEmoji={
    easy:128523, //😋
    medium:128528, //😐
    hard:128534, //😖
    impossible:128520 //😈 
  }