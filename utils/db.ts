import { Word } from '@prisma/client';
import Dexie, {Table} from 'dexie';



export class MySubClassedDexie extends Dexie {
    words!: Table<Word>;  
    doneWords!: Table<Word>;  
    constructor() {
        super('myDatabase');
        this.version(1).stores({
            words: '++id, word , translate, level',
            doneWords:'++id, word, translate, level'
        });
    }
}

export const db = new MySubClassedDexie();