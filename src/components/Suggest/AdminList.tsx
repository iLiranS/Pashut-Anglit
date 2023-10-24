import {suggestedWord } from '@prisma/client';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { toast } from 'react-toastify';

const AdminList = () => {
    const [suggestedWords,setSuggestedWords] = useState<suggestedWord[]>([]); // {id,word,translate,wordLevel}
    const [moreToFetch,setMoreToFetch] = useState(true);
    const [currentSkip,setCurrentSkip] = useState(0);
    const [didHydrate,setDidHydrate] = useState(false);
    const [isLoading,setIsLoading] = useState(false);
    const notifyError= (msg:string)=> toast.error(msg);
    const notifySuccess= (msg:string)=> toast.success(msg);

    const fetchSuggestedWords = useCallback(async()=>{
      if (!moreToFetch || isLoading) return; // no more words to fetch.
      try{
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/suggested?skip=${currentSkip}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data ?? ' failed fetching suggested words');
        // success shoud get { ,skip:string}
        setSuggestedWords(prev => [...prev, ...data.words]);
        if(data.words.length < 20) setMoreToFetch(false);
        setCurrentSkip(data.skip);
      }
      catch(err:any){
        if (err.message === 'empty'){
          // no more suggested words
          setMoreToFetch(false);
          notifyError('no more words to fetch');
        }
        else notifyError(err.message ?? 'failed fetching suggested words');
      }

    },[moreToFetch,currentSkip,isLoading])

    useEffect(()=>{
      fetchSuggestedWords();
      setDidHydrate(true);
    },[])

    const removeWordFromState = useCallback((id:number)=>{
      setSuggestedWords(prev =>{
        const fornow = [...prev];
        const indexOfWord = fornow.findIndex(word => word.id === id);
        if (indexOfWord <0) return fornow;
        fornow.splice(indexOfWord,1);
        return fornow;
      })
    },[])


    const removeSuggestedWord = useCallback(async(word:suggestedWord,fromApprove=false) =>{
      if (isLoading && !fromApprove) return;
      setIsLoading(true);
        // delete word only
        try{
          const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/suggested?id=${word.id}`,{method:'DELETE'});
          if (!res.ok){
            throw new Error();
          }
          // word deleted, remove from state and toast.
          notifySuccess(`${word.word} Removed from Suggested`)
          removeWordFromState(word.id);
          
        }
        catch(err:any){
          notifyError(err.message ??'error');
        }
        setIsLoading(false);
    },[removeWordFromState,isLoading])


    const approveWordHandler = useCallback(async(word:suggestedWord) =>{
      if (isLoading) return;
      setIsLoading(true);
      // delete word and add to word list
      try{
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/word`,
        {
          method:'POST',
          body:JSON.stringify(word),
          headers:{'Content-Type':'application/json'}
        });
        if (!res.ok) throw new Error();
        // success
        notifySuccess(`${word.word} Added Successfully`);
        // remove word from suggested.
        removeSuggestedWord(word,true);
      }
      catch(err:any){
        notifyError(err.message ?? 'error');
      }
    },[removeSuggestedWord,isLoading])


    // const removeAllHandler = useCallback(async() =>{
    //   if (isLoading) return;
    //   setIsLoading(true);
    //     // delete all words from suggested
    //     try{
    //       const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/words`,{method:'DELETE'});
    //       if (!res.ok){
    //         throw new Error();
    //       }
    //       // word deleted, remove from state and toast.
    //       notifySuccess(`Words Removed from Suggested Successfully!`)
    //       setSuggestedWords([]);
          
    //     }
    //     catch(err:any){
    //       notifyError(err.message ??'error');
    //     }
    //     setIsLoading(false);
    // },[isLoading])


    const approveAllHandler = useCallback(async() =>{
      if (isLoading || moreToFetch) return;
      setIsLoading(true);
      const mappedSuggestedToAdd = suggestedWords.map(word => ({word:word.word,translate:word.translate,level:word.wordLevel}));
      // delete word and add to word list
      try{
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/words`,
        {
          method:'POST',
          body:JSON.stringify(mappedSuggestedToAdd),
          headers:{'Content-Type':'application/json'}
        });
        if (!res.ok) throw new Error();
        // success
        notifySuccess(`Words Added to db Successfully`);
        // remove word from suggested. Changed : Now happens automatically in words suggested route.
        // removeAllHandler();
      }
      catch(err:any){
        notifyError(err.message ?? 'error');
      }
    },[isLoading,suggestedWords])


    const suggestedMapped = useMemo(()=>{
      const listMap = suggestedWords.map(wordObj =>{
        return(
        <tr className='odd:bg-bgDark/10 dark:odd:bg-bg/10' key={wordObj.id}>
          <td className='p-2 border-2 border-bgDark/10 dark:border-bg/10'>{wordObj.word}</td>
          <td className='p-2 border-2 border-bgDark/10 dark:border-bg/10'>{wordObj.translate}</td>
          <td className='p-2 border-2 border-r-0 border-bgDark/10 dark:border-bg/10'>{wordObj.wordLevel}</td>
          <td className=' flex justify-evenly p-2 border-2 border-bgDark/10 dark:border-bg/10'>
          <button disabled={isLoading} onClick={()=>{removeSuggestedWord(wordObj)}} className='inputStyle text-red-500 font-semibold cursor-pointer disabled:opacity-60 disabled:text-gray-700 disabled:cursor-not-allowed'>No</button>
          <button disabled={isLoading} onClick={()=>{approveWordHandler(wordObj)}} className='inputStyle text-green-700 font-semibold cursor-pointer disabled:opacity-60 disabled:text-gray-700 disabled:cursor-not-allowed'>Yes</button>
          </td>
        </tr>
        )
      }
      )
      return listMap;
    },[suggestedWords,removeSuggestedWord,approveWordHandler,isLoading])

  return (
    <>
      {suggestedWords.length >0 ?
      <div className='py-2 gap-2 grid grid-rows-[1fr,max-content] relative max-h-full w-[500px] max-w-[95vw] overflow-y-auto self-start'>
      <table className='max-w-full'>
        <thead>
        <tr>
          <th className='text-start pl-2'>Word</th>
          <th className='text-start pl-2'>Translate</th>
          <th className='text-start pl-2'>Level</th>
          <th className='text-center'>Action</th>
        </tr>
        </thead>

        <tbody className=''>
        {didHydrate && suggestedMapped}
        </tbody>
      </table>

      <section className='flex items-center justify-center gap-2'>
        <p onClick={approveAllHandler} className={`${moreToFetch ? 'cursor-not-allowed opacity-60' :'cursor-pointer'} inputStyle  w-fit mx-auto p-2`}>Approve all</p>

        {moreToFetch && isLoading && <section className='animate-spin'><AiOutlineLoading3Quarters/> </section>}
        {moreToFetch && !isLoading &&  <p className='inputStyle cursor-pointer w-fit mx-auto' onClick={fetchSuggestedWords}>Load more</p>}
      
      </section>

      </div>
      :
      <p>No Suggested words.</p>  
    }

      </>
  )
}

export default AdminList