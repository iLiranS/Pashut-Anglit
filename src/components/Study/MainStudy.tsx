'use client'
import useUserStore from '@/store/useUserStore';
import { db } from '@/utils/db';
import React, { useCallback, useEffect, useState } from 'react'
import { getLevelsArrayFromLevel, updateLocalArray, updatedUserStats } from '@/utils/functions';
import { Word, userLevel, wordLevel } from '@prisma/client';
import { toast } from 'react-toastify';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { levelsEmoji } from '@/utils/tsModels';
import SingleAnswer from './SingleAnswer';

let didUserLoad = false;
type gameWord = {word:string,translate:string,level:wordLevel}
const MainStudy = () => {
    const notifyError = (msg:string) => toast.error(msg);
    const notifySuccess = (msg:string) => toast.success(msg);
    const user = useUserStore();
    const [reveal,setReveal] = useState(false);
    const [word,setWord] = useState<gameWord>();
    const [startSessionLevel,setStartSessionLevel] = useState<userLevel|null>(null);
    const [translates,setTranslates] = useState<string[]>([]);
    const [isLastWord,setIsLastWord] = useState(false);
   
// random translates with one correct. Assuming (doneWords.length + words.Length) >=6
    const generateTranslates= async() =>{
        if (!word) return; // will not be null.
        setTranslates([]);
        // get correct and determine index of correct
        const correctTranslate = word.translate;
        let correctIndex =  Math.floor(Math.random()*6);
        // get total words array
        const doneWords = await db.doneWords.toArray();
        const words = await db.words.toArray();
        const totalWords = [...doneWords,...words];
        if (totalWords.length <6){
            notifyError('Not enough words to generate translates');
            return;
        }
        // create array for translates
        const translatesHolder:string[] = Array(6).fill(undefined);
        // put correct in the random determined index
        translatesHolder[correctIndex] = correctTranslate;
        // find index in total words of correct answer
        const indexOfCorrectInTotal = totalWords.findIndex(word => word.word === words[0].word);
        totalWords.splice(indexOfCorrectInTotal,1);
        //
        let alreadyAdded = 1;
        // count the added tranlates, starting from 1 already
        while(alreadyAdded<=6){
            const indexInTotal = Math.floor(Math.random()*totalWords.length);
            
            // find empty spot
            const firstEmptyIndex = translatesHolder.findIndex(el => !el);
            if(firstEmptyIndex===-1) break;
            translatesHolder[firstEmptyIndex] = totalWords[indexInTotal].translate;
            // remove from totalWords to avoid duplication
            totalWords.splice(indexInTotal,1);
            alreadyAdded++;
        }

        setTranslates(translatesHolder);
    }


    //  fetching words from DB according to user level and *ADDING* all *NEW* results to indexedDB.
    // so can be used for updates as well.
    const fetchWordsFromDB = async(level:userLevel)=>{
        // new last update to localStorage
        const date = new Date();
        localStorage.setItem('last_update',JSON.stringify(date.getTime()));

        
        console.log('fetch words from db called');
        let levels = getLevelsArrayFromLevel(level);
        const levelsQueryParam = levels.join('&levels='); // Join levels with '&levels='
        console.log(levelsQueryParam);
        try{
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/words?levels=${levelsQueryParam}`,{cache:'no-store'});
            const data= await res.json() as Word[] | null;
            if (!res.ok){
                // something went wrong
                throw new Error( 'error fetching words');
            }
            // success , put words in local db.
            // but put only words that are not answered yet.
            const doneWords = await db.doneWords.toArray();
            const words = await db.words.toArray();
            const filteredArrayOfNewWords = (data as Word[]).filter(word => !doneWords.map(doneWord => doneWord.word).includes(word.word));
            // also check if not exists yet, used for UPDATES from db.
            // this contains new words that are not in Words and not in doneWords
            const finalizeArrayOfNewWords = filteredArrayOfNewWords.filter(word => !words.map(alreadyWord => alreadyWord.word).includes(word.word))
            
            
            if (finalizeArrayOfNewWords.length <=0){
                // no new words
                throw new Error('no update found');
            }
            else{
                await db.words.bulkAdd(finalizeArrayOfNewWords);
                notifySuccess('fetched ' + finalizeArrayOfNewWords.length + ' new words');
            }

        }
        catch(err:any){
            // error handling
            notifyError(err.message || 'error fetching words');
        }
    }


    // everytime word changes
    useEffect(()=>{
        if (word) generateTranslates();
    },[word])

    // first word in DB to word state, can give word ahead to save calculation
    const setWordToFirstInDB = async(preWord?:any)=>{
        if (preWord) setWord(preWord);
        else{
            const words = await db.words.toArray();
            setWord(words[0]);
        }
        // generate translate
    }
    // update user exp locally and if dbExpUpdate given to db as well.
    const updateUserExp=async(exp:number,dbExpUpdate?:number)=>{
        console.log('in mainStudy , ' +exp)
        // handle case of minus handled be setExp.
        const updatedStats = updatedUserStats(user.level,exp,user.exp);
        user.setExp(updatedStats.updatedExp);
        user.setLevel(updatedStats.updatedLevel);


        if (dbExpUpdate){
            // to avoid negative exp.
            if (dbExpUpdate < 0 && Math.abs(dbExpUpdate)>user.exp) return;
            const params = new URLSearchParams({
                exp:dbExpUpdate.toString(),
                id: user.id,
            });
            // need to tell prisma to update exp.
            const result = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/exp?${params.toString()}`,{
                method:'PUT',
                headers:{'Content-Type':'application/json'},
            })
            if (!result.ok){
                notifyError('failed updating user exp to db');
            }
            else{
                notifySuccess('updated to db')
            }
        }
    }

    // if doneWords length >= 75 choose random between the oldest 50 words.
    const retrieveOldWord = async() =>{
        const doneWords = await db.doneWords.toArray();
        if (doneWords.length>=75){
            const rnd = Math.floor(Math.random()*50);
            const wordToRetrieve = doneWords[rnd];
            await db.doneWords.where('word').equals(wordToRetrieve.word).delete();
            await db.words.add(wordToRetrieve);
        }
    }

    const answerHandler = async(isRight:boolean) =>{
        if (!word) return;
        // local update exp and if array given also to DB.
        const result = updateLocalArray(user.level,isRight);
        result.dbExpUpdate ? updateUserExp(result.expUpdate,result.dbExpUpdate) : updateUserExp(result.expUpdate);


        // respoinsible on local db update as well as for edge case of last word available.
        setTimeout(async() => {
            // in here generate new word.
            const words = await db.words.toArray();
            const wordObj = {word:word.word,translate:word.translate,level:word.level} as any;
            const nextWord = words[1];
            if (!nextWord) {notifyError('that was the last word'); setIsLastWord(true); return;}

            if (isRight){
                // right, first to doneWords
                await db.doneWords.add(wordObj);
                await db.words.where('word').equals(word.word).delete();

                // add one old doneWord to words but every 2 turns so it wont be infinite
                if (words.length%2===0) retrieveOldWord();
            }
            else{
                // wrong, first to last
                await db.words.where('word').equals(word.word).delete();
                await db.words.add(wordObj as any);
            }
            setWordToFirstInDB(nextWord);
            setReveal(false);
        }, 2000);
    }


    // get first word, if no words fetch only if not a master
    const startGameHandler = useCallback(async(level:userLevel)=>{
        const words = await db.words.toArray();
        if (words.length <1){
            // no words
            // if (user.level === 'Master') { notifySuccess('Nice job! You cleared all the words, Stay tuned for new words.')}
                await fetchWordsFromDB(level);
                await setWordToFirstInDB();
        }
        else{
            // there are words already, check for updates and start game.
            const lastUpdae = localStorage.getItem('last_update') || false;
            const today = new Date();
            if (!lastUpdae){
                localStorage.setItem('last_update',JSON.stringify(today.getTime()));
            }
            else{
                // check if 1 day passed
                const oneDayInMilliseconds = 86400000;
                const dateLast = new Date(parseInt(lastUpdae) * 1000);
                if (today.getTime() - dateLast.getTime()/1000 > oneDayInMilliseconds){
                    notifySuccess('checking for updates');
                    fetchWordsFromDB(level);
                }
                else{
                    // no need to check for update.
                }
                
            }
            
            setWordToFirstInDB(words[0]);
        }
    },[])

    // initial effect, called once on landing. starting game and updates, including level up
    useEffect(()=>{
        // check if leveld up, get new words from db if needed.
        const didLevelUp = startSessionLevel!=null && startSessionLevel!=user.level;
        if (didLevelUp){
            const previousLevel = startSessionLevel;
            setStartSessionLevel(user.level);
            notifySuccess('You leveled up to '+user.level +' !');
            const fetchForNewLevel = async()=>{
                await fetchWordsFromDB(user.level);
                await generateTranslates();
            }
            // check if new words levels added to this level, previous for state update may update before check so it will always be equal.
            if(getLevelsArrayFromLevel(user.level).toString()!==getLevelsArrayFromLevel(previousLevel).toString()) fetchForNewLevel();
        }
        if (didUserLoad) return;
        if (user.id.length>2){
            didUserLoad = true;
            setStartSessionLevel(user.level);
            startGameHandler(user.level);
        }

    },[startGameHandler,user])


    const wrongAnswerHandler = () =>{setReveal(true); answerHandler(false)}
    const trueAnswerHandler = () =>{setReveal(true); answerHandler(true)}



    if (isLastWord) return <section className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold'><p>Stay tuned for new words.</p></section>
    if (!word) return <section className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold'><AiOutlineLoading3Quarters className='animate-spin'/></section>
    const emojiCode = levelsEmoji[word.level];
    const emoji = String.fromCodePoint(emojiCode);
    return (
        <div className='flex flex-col w-80 max-w-[100vw] mx-auto h-fit top-8  gap-8 relative'>

            <section className='text-center border-b-2 border-b-bgDark/10 dark:border-b-bg/10 pb-2 relative'>
            <p className={`font-semibold transition-transform ease-in ${reveal ? 'scale-0 delay-1500' : 'scale-100'}`}>{word.word}  </p>
            <span className={`text-xs opacity-75 transition-transform ease-in ${reveal ? 'scale-0 delay-1500' : 'scale-100'} absolute bottom-0 right-0 ${word.level==='easy' && 'text-green-300'} ${word.level==='medium' && 'text-yellow-200'} ${word.level==='hard' && 'text-red-500'} ${word.level==='impossible' && 'text-violet-500'}`}>{word.level}{emoji}</span>
            </section>
            
            <section className='grid grid-cols-2 gap-2 sm:grid-cols-3 w-full'>
                <SingleAnswer reveal={reveal} isTrue={translates[0]===word.translate} callBackOnClick={translates[0]===word.translate ? trueAnswerHandler : wrongAnswerHandler} translate={translates[0]}/>
                <SingleAnswer reveal={reveal} isTrue={translates[1]===word.translate} callBackOnClick={translates[1]===word.translate ? trueAnswerHandler : wrongAnswerHandler} translate={translates[1]}/>
                <SingleAnswer reveal={reveal} isTrue={translates[2]===word.translate}  callBackOnClick={translates[2]===word.translate ? trueAnswerHandler : wrongAnswerHandler} translate={translates[2]}/>
                <SingleAnswer reveal={reveal} isTrue={translates[3]===word.translate} callBackOnClick={translates[3]===word.translate ? trueAnswerHandler : wrongAnswerHandler} translate={translates[3]}/>
                <SingleAnswer reveal={reveal} isTrue={translates[4]===word.translate} callBackOnClick={translates[4]===word.translate ? trueAnswerHandler : wrongAnswerHandler} translate={translates[4]}/>
                <SingleAnswer reveal={reveal} isTrue={translates[5]===word.translate} callBackOnClick={translates[5]===word.translate ? trueAnswerHandler : wrongAnswerHandler} translate={translates[5]}/>
            </section>

        </div>
    )
}



export default MainStudy