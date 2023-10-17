import { Word } from '@prisma/client'
import React, { useCallback, useEffect, useState } from 'react'
import SingleAnswer from '../Study/SingleAnswer';
import { Progress } from "@/components/ui/progress"

const DuelGameArea:React.FC<{words:Word[],stage:number,answerUpdate:(answer:boolean)=>void}> = ({words,stage,answerUpdate}) => {

    const [translates,setTranslates] = useState<string[]>([]);
    const [hasAnswered,setHasAnswered] = useState<boolean|null>(null);
    // waiting for other player should be false when both players ready to get new stage, start countdown as well
    const [countDown,setCountDown] = useState(7000); // in ms

    // generating translates and randomize them in different locations.
    const generateTranslates = useCallback(() =>{
        const translates = [];
        const translatesArray = [...words].map(word => word.translate);
        translates[0] = translatesArray[stage];
        translatesArray.splice(stage,1);
        // fill in random
        while (translates.length<6){
            const rnd = Math.floor(Math.random()*translatesArray.length);
            translates.push(translatesArray[rnd]);
            translatesArray.splice(rnd,1);
        }
        const shuffledArray = translates.sort((a, b) => 0.5 - Math.random());
        setTranslates(shuffledArray);
    },[stage,words])

    const updateStageHandler = useCallback((isTrue:boolean) =>{
            answerUpdate(isTrue);
    },[answerUpdate,hasAnswered])




    const answerHandler=(isTrue:boolean)=>{
        if (hasAnswered) return;
        setHasAnswered(true);
        updateStageHandler(isTrue);
    }

    useEffect(()=>{
        if (countDown <=0)
        wrongAnswerHandler();
    },[countDown])

    // starts timer, wrong if didn't answer in time. Cancled upon hasAnswered is true.
    useEffect(()=>{

        let interval:ReturnType<typeof setInterval>;

            interval = setInterval(()=>{
                setCountDown(prev => prev-100);
            },100)


        
        if(!hasAnswered) generateTranslates();
        return()=>{clearInterval(interval);}
    },[hasAnswered])
    


    const wrongAnswerHandler = () =>{answerHandler(false)}
    const trueAnswerHandler = () =>{answerHandler(true)}



return (
    <div className='flex flex-col gap-2 text-center'>
        <div className='flex flex-col gap-2 text-center'>

        <div>
            <section className='relative'>
        <Progress value={countDown/7000*100} />
        <p className='absolute right-1 top-1/2 -translate-y-1/2 text-text'>{countDown/1000}s</p>
            </section>
        <p className='font-semibold text-lg'>{words[stage].word}</p>
        </div>
        

        
        <section className='grid grid-cols-2 gap-2 sm:grid-cols-3 w-full'>
            <SingleAnswer reveal={false} isTrue={translates[1]===words[stage].translate} callBackOnClick={translates[1]===words[stage].translate ? trueAnswerHandler : wrongAnswerHandler} translate={translates[1]}/>
            <SingleAnswer reveal={false} isTrue={translates[0]===words[stage].translate} callBackOnClick={translates[0]===words[stage].translate ? trueAnswerHandler : wrongAnswerHandler} translate={translates[0]}/>
            <SingleAnswer reveal={false} isTrue={translates[2]===words[stage].translate}  callBackOnClick={translates[2]===words[stage].translate ? trueAnswerHandler : wrongAnswerHandler} translate={translates[2]}/>
            <SingleAnswer reveal={false} isTrue={translates[3]===words[stage].translate} callBackOnClick={translates[3]===words[stage].translate ? trueAnswerHandler : wrongAnswerHandler} translate={translates[3]}/>
            <SingleAnswer reveal={false} isTrue={translates[4]===words[stage].translate} callBackOnClick={translates[4]===words[stage].translate ? trueAnswerHandler : wrongAnswerHandler} translate={translates[4]}/>
            <SingleAnswer reveal={false} isTrue={translates[5]===words[stage].translate} callBackOnClick={translates[5]===words[stage].translate ? trueAnswerHandler : wrongAnswerHandler} translate={translates[5]}/>
        </section>
        </div>
        
        
    </div>
)
}

export default DuelGameArea