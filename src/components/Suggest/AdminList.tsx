import { suggestedWord } from '@prisma/client';
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
        setSuggestedWords(data.words);
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

    },[moreToFetch])

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


    const suggestedMapped = useMemo(()=>{
      const listMap = suggestedWords.map(wordObj => 
      <tr  key={wordObj.id}>
        <td className=' p-3 text-left border-2 border-bgDark/10 dark:border-bg/10'>{wordObj.word}</td>
        <td className=' p-3 text-left border-2 border-bgDark/10 dark:border-bg/10'>{wordObj.translate}</td>
        <td className=' p-3 text-left border-2 border-bgDark/10 dark:border-bg/10'>{wordObj.wordLevel}</td>
        <td className='flex gap-1 p-3 text-left border-2 border-bgDark/10 dark:border-bg/10'>
          <button disabled={isLoading} onClick={()=>{removeSuggestedWord(wordObj)}} className='inputStyle text-red-500 font-semibold cursor-pointer disabled:opacity-60 disabled:text-gray-700 disabled:cursor-not-allowed'>Reject</button>
          <button disabled={isLoading} onClick={()=>{approveWordHandler(wordObj)}} className='inputStyle text-green-700 font-semibold cursor-pointer disabled:opacity-60 disabled:text-gray-700 disabled:cursor-not-allowed'>Approve</button>
        </td>
      </tr>
      )
      return listMap;
    },[suggestedWords,removeSuggestedWord,approveWordHandler,isLoading])

  return (
    <div className='pt-8 overflow-hidden max-w-[95vw]'>
      <div className='overflow-x-auto max-w-[500px] relative'>
      {suggestedWords.length >0 ?
      <table className='bg-bgDark/10 dark:bg-bg/10 max-w-full overflow-hidden'>

        <thead>
        <tr className='inputStyle'>
          <th>Word</th>
          <th>Translate</th>
          <th>Level</th>
          <th>Approve</th>
        </tr>
        </thead>

        <tbody>
        {didHydrate && suggestedMapped}
        </tbody>


      </table>
      :
      <p>No Suggested words.</p>  
    }
        {moreToFetch &&
          <div>
            {isLoading ? <section className='animate-spin'><AiOutlineLoading3Quarters/> </section>: <p onClick={fetchSuggestedWords}>Load more</p>}
          </div>
        }
      </div>
    </div>
  )
}

export default AdminList