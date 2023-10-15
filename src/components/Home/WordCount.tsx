import React from 'react'
import { PrismaClient } from "@prisma/client"


export const revalidate = 3600; // revalidate count every hour.
const getWordsCount =async () => {
    const prisma = new PrismaClient()
    const count = await prisma.word.count();
    return count || undefined;
}


const WordCount = async() => {
    const wordCount = await getWordsCount();

return (
    <p>Currently there are <span className='text-violet-400'>{wordCount || '...'}</span> words.</p>
)
}

export default WordCount