'use client'
import React, { useEffect, useState } from 'react'
import LevelSelector from '../Suggest/LevelSelector'
import { Word, wordLevel } from '@prisma/client';
import { Input } from "@/components/ui/input"
import {FiDelete} from 'react-icons/fi'
import { db } from '@/utils/db';

const MainDictionary = () => {
    const [level,setLevel] = useState<wordLevel | null>(null);
    const [searchInput,setSearchInput] = useState<string>('');
    const [words,setWords] = useState<Word[]>([]);

    const updateSearchInputHandler = (e:React.ChangeEvent<HTMLInputElement>) =>{
        setSearchInput(e.target.value);
    }

    const updateLevelHandler = (newLevel:wordLevel) =>{
        setLevel(newLevel);
    }
    
    // initial words fetch
    useEffect(()=>{
        const getWords = async() =>{
            const doneWords = await db.doneWords.toArray() as Word[];
            setWords(doneWords);
        }
        getWords();
    },[])


    const filteredWords = words.filter(word => level ? word.level === level : true).filter((word)=>searchInput.length>0 ?  word.word.includes(searchInput) || word.translate.includes(searchInput): true);

    const mappedWords = filteredWords.map((wordObj,index) => 
    <li className='justify-between odd:bg-bgDark/10 dark:odd:bg-bg/10 grid grid-cols-2 text-end text-xl' key={index}>
        <p className='w-full px-1 border-r-[1px] py-1 border-bgDark/20 dark:border-bg/20'>{wordObj.translate}</p>
        <p className='w-full px-1 py-1'>{wordObj.word}</p>
    </li>
    )


    return (
    <div className=' w-96 max-w-[100vw] mx-auto relative pt-10 flex flex-col gap-4'>

        <section className='w-full relative'>
            <Input value={searchInput} onChange={updateSearchInputHandler} className='w-full placeholder:text-end' type='text' placeholder='חפש מילה או תרגום'/>
            {searchInput.length>0 && <FiDelete onClick={()=>{setSearchInput('')}} className='absolute cursor-pointer right-2 opacity-75 top-1/2 -translate-y-1/2'>X</FiDelete>}
        <p className='text-xs opacity-60 text-end px-1'>הערה: אלו רק מילים שענית עליהם</p>
        </section>


        <section className='flex items-center gap-2 w-full justify-between border-b-[1px] border-b-bgDark/10 dark:border-b-bg/10 pb-2 px-1'>
        <LevelSelector initialNull={true} updateLevel={updateLevelHandler}/>
        <p>רמת מילה</p>
        </section>

        <section>
        <ul className='grid grid-cols-2 text-end text-sm justify-between opacity-75'>
            <li className='px-1'>תרגום</li>
            <li className='px-1'>מילה</li>
        </ul>

        <ul className='flex flex-col  border-[1px] border-bgDark/20 dark:border-bg/20 relative'>
            {mappedWords}
            {/* <div className='w-[1px] h-full absolute left-1/2 -translate-x-1/2 bg-bgDark/20 dark:bg-bg/20'></div> */}
        </ul>

        </section>


    </div>
    )
}

export default MainDictionary