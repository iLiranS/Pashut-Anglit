import { Word } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import SingleAnswer from '../Study/SingleAnswer';
import { Progress } from "@/components/ui/progress"

const DuelGameArea:React.FC<{words:Word[],stage:number,updateStage:(answer:boolean)=>void}> = ({words,stage,updateStage}) => {

    const [translates,setTranslates] = useState<string[]>([]);
    const [reveal,setReveal] = useState(false);
    const [hasAnswered,setHasAnswered] = useState<boolean|null>(null);
    const [isRight,setIsRight] = useState<boolean>(true)
    // waiting for other player should be false when both players ready to get new stage, start countdown as well
    const [countDown,setCountDown] = useState(7000); // in ms

    const generateTranslates = () =>{
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
    }

    const updateStageHandler = (isTrue:boolean) =>{
        setTimeout(() => {
            updateStage(isTrue);
        }, 1000);
    }




    const answerHandler=(isTrue:boolean)=>{
        if (reveal) return;
        setHasAnswered(true);
        setIsRight(isTrue);
        setReveal(true);
        updateStageHandler(isTrue);
    }

    // starts timer, wrong if didn't answer in time. Cancled upon hasAnswered is true.
    useEffect(()=>{
        if (hasAnswered) return;
        let interval:ReturnType<typeof setInterval>;
            interval = setInterval(()=>{
                if (hasAnswered){
                    clearInterval(interval);
                }

                setCountDown(prev =>{
                    if (prev<=100){
                        answerHandler(false);
                        clearInterval(interval);
                        return 0
                    }
                    else return prev-100;
                });

            },100)
        
        generateTranslates();
        return()=>{clearInterval(interval);}
    },[hasAnswered])
    


    const wrongAnswerHandler = () =>{answerHandler(false)}
    const trueAnswerHandler = () =>{answerHandler(true)}



return (
    <div className='flex flex-col gap-2 text-center'>
        {!hasAnswered ?
        <div className='flex flex-col gap-2 text-center'>

        <div>
            <section className='relative'>
        <Progress value={countDown/7000*100} />
        <p className='absolute right-1 top-1/2 -translate-y-1/2 text-text'>{countDown/1000}s</p>
            </section>
        <p className='font-semibold text-lg'>{words[stage].word}</p>
        </div>
        

        
        <section className='grid grid-cols-2 gap-2 sm:grid-cols-3 w-full'>
            <SingleAnswer reveal={reveal} isTrue={translates[1]===words[stage].translate} callBackOnClick={translates[1]===words[stage].translate ? trueAnswerHandler : wrongAnswerHandler} translate={translates[1]}/>
            <SingleAnswer reveal={reveal} isTrue={translates[0]===words[stage].translate} callBackOnClick={translates[0]===words[stage].translate ? trueAnswerHandler : wrongAnswerHandler} translate={translates[0]}/>
            <SingleAnswer reveal={reveal} isTrue={translates[2]===words[stage].translate}  callBackOnClick={translates[2]===words[stage].translate ? trueAnswerHandler : wrongAnswerHandler} translate={translates[2]}/>
            <SingleAnswer reveal={reveal} isTrue={translates[3]===words[stage].translate} callBackOnClick={translates[3]===words[stage].translate ? trueAnswerHandler : wrongAnswerHandler} translate={translates[3]}/>
            <SingleAnswer reveal={reveal} isTrue={translates[4]===words[stage].translate} callBackOnClick={translates[4]===words[stage].translate ? trueAnswerHandler : wrongAnswerHandler} translate={translates[4]}/>
            <SingleAnswer reveal={reveal} isTrue={translates[5]===words[stage].translate} callBackOnClick={translates[5]===words[stage].translate ? trueAnswerHandler : wrongAnswerHandler} translate={translates[5]}/>
        </section>
        </div>
        :
        <p className='animate-bounce'> <span className={`${isRight===null && 'hidden'}`}>{isRight ? '✅' :'❌'}</span>  Waiting for other player...</p>    
        }
    </div>
)
}

export default DuelGameArea