import Dexie, {Table} from 'dexie';
import { localWord } from './tsModels';



export class MySubClassedDexie extends Dexie {
    words!: Table<localWord>;  
    doneWords!: Table<localWord>;  
    constructor() {
        super('myDatabase');
        this.version(1).stores({
            words: '++id, word , translate, level, count',
            doneWords:'++id, word, translate, level, count'
        });
    }
}

export const db = new MySubClassedDexie();