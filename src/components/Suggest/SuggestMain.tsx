'use client'
import { role, wordLevels } from '@/utils/tsModels'
import { suggestedWord } from '@prisma/client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { sanitize } from "isomorphic-dompurify";
import { toast } from 'react-toastify'
import LevelSelector from './LevelSelector'
import AdminList from './AdminList'



const SuggestMain:React.FC<{role:role,list?:suggestedWord[]}> = ({role,list}) => {
  const {register,handleSubmit,reset} = useForm();
  const notifyError = (msg:string) => toast.error(msg);
  const notifySuccess = (msg:string) => toast.success(msg);
  const [wordLevel,setWordLevel] = useState<wordLevels>('easy');
  const [isLoading,setIsLoading] = useState(false);

  const apiCheck = async(word:string,translate:string):Promise<boolean> =>{
    
    try{
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/suggested`,
      {
        body:JSON.stringify({word,translate,wordLevel}),
        method:'POST',
        headers:{'Content-Type':'application/json'}
      });
      const data = await res.json();
      if (!res.ok){
        // req failed
        notifyError(data ?? 'error'); // data will be err message. e.g 'word already exists'
        throw new Error();
      }
      // req success
      return true;
    }
    catch(err:any){
      return false;
    }

  }


  const onSubmit = async(d:any) =>{
    if (isLoading) return;
    setIsLoading(true);
    // verify inputs and word does not exists.
    const translate = d.translate as string;
    const word = d.word as string;
    // sanitize check
    const cleanWord = sanitize(word);
    const cleanTranslate = sanitize(translate);
    if (cleanWord !== word || cleanTranslate !== translate){
      notifyError('Word or translate invalid!');
      setIsLoading(false);
      return;
    }
    // word & transalte check
    const englishWord = /^[A-Za-z]+$/;
    if (word.trim().length <2 || translate.trim().length<2 || !englishWord.test(word)){
      notifyError('Word or translate invalid!');
      setIsLoading(false);
      return;
    }
    // api check
    const result = await apiCheck(word,translate);
    if (result){
      // success
      notifySuccess('word suggested successfully!');
      // clear inputs
      reset();
    }
    // apiCheck will handle displaying errors.
    setIsLoading(false);
    return;
  }

  const updateLevelHandler = (e:wordLevels) =>{
    setWordLevel(e);
  }


  
  return (
    <div className='w-screen  h-[100dvh] flex flex-col gap-2 place-items-center py-8'>

    <form  onSubmit={handleSubmit(onSubmit)} className='relative w-60 mx-auto flex flex-col'>

          <section className='flex flex-col  relative w-60'>
            <label>
              <p className='text-end'>מילה</p>
              <input {...register("word")} className='inputStyle w-full' type='text'/>
            </label>
          </section>

          <section className='flex flex-col  relative w-60'>
            <label>
              <p className='text-end'>תרגום</p>
              <input {...register("translate")} className='inputStyle w-full' type='text'/>
            </label>
          </section>

          <section className='flex flex-col  relative w-60'>
            <label>
              <p className='text-end'>רמת המילה</p>
              <LevelSelector updateLevel={updateLevelHandler}/>
            </label>
          </section>

          <button disabled={isLoading} className='inputStyle mt-6 disabled:opacity-60 disabled:cursor-not-allowed w-fit self-center'>הצע מילה</button>
    </form>

    {role==='admin' &&
      <AdminList key={isLoading.toString()}/>
    }
    </div>
  )
}

export default SuggestMain