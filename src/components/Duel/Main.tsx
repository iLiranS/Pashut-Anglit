'use client'
import React, { useMemo, useState, useRef , useEffect} from 'react'
import { User, Word} from 'prisma/prisma-client'
import {AiOutlineLoading3Quarters} from 'react-icons/ai'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {  levelsEmoji } from '@/utils/tsModels'
import DuelGameArea from './DuelGameArea'
import useUserStore from '@/store/useUserStore'



let didResultSent = false;

const Main:React.FC<{usersInitial:User[],id:string,words:Word[],user:User}> = ({usersInitial,id,words,user}) => {
  // match states
  const [users,setUsers] = useState<any>(usersInitial);
  const [answers,setAnswers] = useState<boolean[]>([]);
  const [stage,setStage] = useState(-1); // starting from 0 to 19 
  const [otherStatus,setOtherStatus] = useState<any>(null) // {hasWrong}
  const [winner,setWinner] = useState<null | string>(null); // either name , tie or null for not determined yet.
  const [hasAnswered,setHasAnswered] = useState(false);
  const supabase = createClientComponentClient();
  const userStore = useUserStore();
  const dotList = useRef<HTMLUListElement>(null);
  
  const hasWrong = answers.includes(false);
  // 
  // dots generator for stage
  const mappedRoundDots = useMemo(()=>{
    const arr = Array(20).fill('').map((arrIndexVal,index)=>
    <li className={` flex flex-col items-center relative`} 
    key={index}>
      <section className={`${stage>index ? 'bg-green-500' :'bg-bgDark/10 dark:bg-bg/10'} ${hasWrong && index===stage ? 'bg-red-500' :''} rounded-full grid place-items-center h-6 aspect-square`}>
      <p>{String.fromCodePoint(levelsEmoji[words[index].level])}</p>
      </section>
      <p className={`${index === stage ? 'opacity-100' : 'opacity-70'}`}>{index+1}</p>
    </li>
    )
    return arr;
  },[stage,words,hasWrong])



  const submitResult = async() =>{
    if (didResultSent) return;
    didResultSent = true;
    const winnersId = [];


    if (winner === 'tie'){
      winnersId.push(user.id);
      winnersId.push(otherStatus.id);
    }
    else{
      const winnerId = otherStatus.name === winner ? otherStatus.id : user.id;
      winnersId.push(winnerId);
    }

    const bodyObj={
      roomId : id,
      winnersId
    }
    const res = await fetch(`https://pashutanglit.vercel.app/api/room/result`,{
      body:JSON.stringify(bodyObj),
      method:'POST',
      headers:{'Content-Type':'application/json'}
    });
    // TODO: Create route handler to update duelscore and delete room. ALSO Handle player leave.
    // ALSO If tab is not focused it will stop interval handle it.
  }

// update stage list scroll
  useEffect(()=>{
    if(!dotList.current || stage===-1) return;
    else if(stage ===19) dotList.current.children[stage].scrollIntoView();
    else dotList.current.children[stage+1].scrollIntoView();
  },[stage])

  // handles mapping user names 
    const usersMapped = users.map((user:any) =>
      <li key={user.id} className='flex flex-col  gap-1 p-2 inputStyle h-16 w-36'>
      <p className='font-semibold truncate text-sm'>{user.name}</p>
      <section className='flex items-center justify-between w-full'>
      <p className='text-xs opacity-75'>{user.level}</p>
      <p className='text-xs'><span className='opacity-75 text-[10px]'>Score: </span>{user.duelScore}</p>
      </section>
    </li>
    )
    // waiting second player UI handler.
  if (users.length<2){
    // waiting for player  ...
    usersMapped.push(
      <li key={'-1'} className='flex items-center justify-between p-2 inputStyle h-12 w-36'>
      <p className='font-semibold'>Waiting...</p>
      <AiOutlineLoading3Quarters className=' animate-spin opacity-75'/>
      </li>
    )
  }

  // called when user answers a question with bool if true or false.
  const updateStageHandler = (answer:boolean) => {
    setHasAnswered(true);
    if (answer){
      // right answer
      setAnswers(prev=> [...prev,true]);
      
    }
    else{
      // wrong answer
      setAnswers(prev=>[...prev,false]);
    }
  }

// handles ui update for first user when second joins. and starts the game by stage to 0.
  useEffect(()=>{
    if (!otherStatus) return;
    // update ui if first player
    if(users.length<2){
      const secondObj = {name:otherStatus.name,level:otherStatus.level,duelScore:otherStatus.duelScore,exp:0,words:[]}
      setUsers([users[0],secondObj]);
      }
    if (stage===-1){
      setStage(0)
    }

  },[otherStatus])

  // subscribtion to room presence
  useEffect(()=>{
    const channelA = supabase.channel(`room=${id}`);

    channelA
    .on(
      'presence',
      { event: 'sync' },
      () => {
        const newState = channelA.presenceState()
        const keys = Object.keys(newState);
        console.log('sync',keys.length+' players');
        if (keys.length <2) return null;
        const indexToSet = (newState[keys[0]][0] as any).id === user.id ? 1 : 0; // if id o 0 need to set to 1 the other.
        const innerObjectToSet = newState[keys[indexToSet]] ? newState[keys[indexToSet]][0] : null;
        if(innerObjectToSet) setOtherStatus(innerObjectToSet);
        
      }
    )
    .on(
      'presence',
      { event: 'join' },
      ({ key, newPresences }) => {
      }
    )
    .on(
      'presence',
      { event: 'leave' },
      ({ key, leftPresences }) => {
        // handle other leave ... give exp of (stage-1) - 5 with check if not minus total exp.
      }
    )
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        const presenceTrackStatus = await channelA.track({
          hasWrong: hasWrong,
          stage:stage,
          name: userStore.name,
          level: userStore.level,
          duelScore: userStore.duelScore,
          id: user.id,
          winner: winner,
          answers
        })
        console.log(presenceTrackStatus);
      }
    })

    return()=>{channelA.unsubscribe();}

  },[userStore.name,answers,winner])



  useEffect(()=>{
    if (!otherStatus) return;
    if (answers.length === otherStatus.answers.length){
      if (hasWrong || otherStatus.hasWrong){
        if (hasWrong && otherStatus.hasWrong) {console.log('tie'); setWinner('tie')}
        if (!hasWrong && otherStatus.hasWrong) {console.log('win'); setWinner(user.name)}
        if (hasWrong && !otherStatus.hasWrong) {console.log('lost'); setWinner(otherStatus.name)}
      }
      else{
        if(hasAnswered) {

          if(stage<19){
            setStage(prev =>prev+1);
            setHasAnswered(false);
          }
          else{
            if (usersInitial[0].id === user.id){
              setWinner('tie');
              submitResult();
            }
          }
        }
        
      }
    }
  },[hasAnswered,otherStatus])


  //only one side caled unless tie
  useEffect(()=>{
    if (winner){
      if (winner==='tie'){
        // if tie , call only on first player.
        if (usersInitial[0].id === user.id){
          // fetch id of winner.
          submitResult();
        }
      }
      else{
        // fetch id of winner
        submitResult();
      }
    }
  },[winner])

  
  return (
    <div key={stage} className='flex flex-col gap-4'>

      <div className='flex items-center justify-between gap-8 relative'>
        {usersMapped}
        <section className='absolute top-0 h-12 w-[1px] left-1/2 bg-black/10 dark:bg-white/10'></section>
      </div>

      <section className='flex gap-1'>
      <div className='h-12 justify-between flex flex-col py-1 opacity-70'>
          <p className='text-xs'>Level</p>
          <p className='text-xs'>Round</p>
        </div>
      <ul ref={dotList} className={`flex gap-1 max-w-[250px] overflow-x-hidden   self-center`}>
        {mappedRoundDots}
      </ul>
      </section>
      {winner  ? <div className='text-center'>{winner==='tie' ? 'Its a tie!' :`Winner is ${winner} 🏆`}</div> :
      <div>
      
      {otherStatus && otherStatus.winner ? <div className='text-center'>{winner==='tie' ? 'Its a tie!' :`Winner is ${otherStatus.winner} 🏆`}</div> :
      <div>
      {otherStatus && !hasWrong && stage!=-1 ? <DuelGameArea   words={words} stage={stage} updateStage={updateStageHandler}/> : <p className='animate-bounce text-center'>Waiting for other player...</p>}
      </div>
      }
      </div>
      }
    </div>
  )
}

export default Main