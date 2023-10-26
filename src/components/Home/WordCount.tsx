import React from 'react'
import { PrismaClient } from "@prisma/client"


const getWordsCount =async () => {
    const prisma = new PrismaClient();
    const count = await prisma.word.count() || -1;
    return count;
}


const WordCount = async() => {
    const wordCount = await getWordsCount();

return (
    <p className='opacity-90'>Currently there are <span className='text-violet-500 opacity-100'>{wordCount || '...'}</span> words.</p>
)
}

export default WordCount