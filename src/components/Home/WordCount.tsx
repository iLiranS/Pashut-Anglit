import React from 'react'
import { PrismaClient } from "@prisma/client"


const getWordsCount =async () => {
    try{
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/words/count`,{next:{revalidate:3600}}); // revalidate every hour
        const data = await response.json();
        return data; // words number
    }
    catch(err:any){
        return err.message || 'error fetching words count';
    }
}


const WordCount = async() => {
    const wordCount = await getWordsCount() as number;

return (
    <p>Currently there are <span className='text-violet-400'>{wordCount || '...'}</span> words.</p>
)
}

export default WordCount