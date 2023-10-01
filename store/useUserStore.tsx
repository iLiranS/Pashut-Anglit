import { updatedUserStats } from '@/utils/functions';
import { userLevel } from '@prisma/client';
import {create} from 'zustand';

interface User {
  name: string;
  id: string;
  level: userLevel;
  exp: number;
  duelScore:number;

  setName: (newName: string) => void;
  setId: (id: string) => void;
  setLevel: (level: userLevel) => void;
  setExp: (exp: number) => void;
  logout: () => void;
  setDuelScore:(score:number)=>void;
}

const useUserStore = create<User>((set) => ({
  name: '',
  id: '',
  level: 'Novice',
  exp: 0,
  duelScore:0,
  setName: (name) => set({ name: name }),
  setId: (id) => set({ id: id }),
  setLevel: (level) => set({ level: level }),
  setExp: (exp) => set({exp:exp}), 
  logout: () => set({ id: '', name: '' }),
  setDuelScore:(score)=>set({duelScore:score})
}));

export default useUserStore;
