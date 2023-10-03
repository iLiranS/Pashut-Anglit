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

    const updateLevelHandler = (newLevel:wordLevel|null) =>{
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
    <li dir='rtl' className='justify-between odd:bg-bgDark/10 dark:odd:bg-bg/10 grid grid-cols-2 text-start text-xl odd:opacity-80' key={index}>
        <p className='w-full px-1 py-1'>{wordObj.word}</p>
        <p className='w-full px-1 border-r-[1px] py-1 border-bgDark/20 dark:border-bg/20'>{wordObj.translate}</p>
    </li>
    )


    return (
    <div className=' w-96 max-w-[100vw] mx-auto relative pt-10 grid grid-rows-[max-content,1fr] pb-2 h-[100dvh]'>

        <div className='h-max relative'>


            <div className='flex flex-col'>
                <section className='w-full relative h-max '>
                    <Input value={searchInput} onChange={updateSearchInputHandler} className='w-full placeholder:text-end' type='text' placeholder='...חיפוש מילה או תרגום'/>
                    {searchInput.length>0 && <FiDelete onClick={()=>{setSearchInput('')}} className='absolute cursor-pointer right-2 opacity-75 top-1/2 -translate-y-1/2 hover:text-red-400'/>}
                </section>
                <p className='text-xs opacity-60 text-end px-1'>הערה: אלו רק מילים שענית עליהן בעבר</p>
            </div>



            <ul className='grid grid-cols-2 text-end text-sm justify-between opacity-75 h-6 mt-2'>
                <li className='px-1'>תרגום</li>
                <li className='px-1'>מילה</li>
            </ul>

        </div>

        <section className='h-full relative overflow-hidden'>
            <ul className='flex flex-col  border-[1px] border-bgDark/20 dark:border-bg/20 relative h-max  max-h-full overflow-y-auto'>
                {mappedWords}
            </ul>
        </section>

    </div>
    )
}

export default MainDictionary