'use client'
import React, { useMemo, useState, useRef , useEffect, useCallback} from 'react'
import { User, Word} from 'prisma/prisma-client'
import {AiOutlineLoading3Quarters} from 'react-icons/ai'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {  levelsEmoji } from '@/utils/tsModels'
import DuelGameArea from './DuelGameArea'
import useUserStore from '@/store/useUserStore'
import TextStartAnimation from './TextStartAnimation'
import { redirect} from 'next/navigation'

let didFinish = false;
let didUpdateStage = false;
let didWinByTimer = false;
const Main:React.FC<{usersInitial:User[],id:string,words:Word[],user:User}> = ({usersInitial,id,words,user}) => {
  // match states
  const [users,setUsers] = useState<any[]>(usersInitial);
  const [answers,setAnswers] = useState<boolean[]>([]);
  const [stage,setStage] = useState(-1); // starting from 0 to 19 
  const [other,setOther] = useState<any>(null) // {hasWrong}
  const [currentSynced,setCurrentSynced] = useState<number|null>(null);
  const [isRoundReady,setIsRoundReady] = useState(false);
  const [startRoundAnimation,setStartRoundAnimation] = useState(false);
  const [winners,setWinners] = useState<string[]>([]);
  const supabase = createClientComponentClient();
  const userStore = useUserStore();
  const dotList = useRef<HTMLUListElement>(null);
  const hasWrong = answers.includes(false);


  // display current round and emoji of level of current word.
  const mappedRoundDots2 = useMemo(()=>{
      const arr = words.map((wordObj,index)=>{
        return(
          <li className='flex flex-col items-center relative' key={index}>
          <section className={`${stage>index ? 'bg-green-400/80' :'bg-bgDark/10 dark:bg-bg/10'} ${hasWrong && index===stage ? 'bg-red-500 dark:bg-red-500' :''} rounded-full grid place-items-center h-6 aspect-square`}>
            <p>{String.fromCodePoint(levelsEmoji[wordObj.level])}</p>
          </section>
            <p className={`${index === stage ? 'opacity-100 text-orange-600 rounded-full' : 'opacity-40'}`}>{index+1}</p>
        </li>
        )
      })
      return arr;
  },[words,stage,hasWrong])

// handles finish game
useEffect(()=>{
  console.log('GAME ENDED 🥺');
  if (didFinish || winners.length<1) return;
  // cancel rounds and animations.
  setIsRoundReady(false);
  setStartRoundAnimation(false);
  didFinish = true;
  // send request to end game with winners.
  // only first player no need for twice.
  if (usersInitial.length<2 && !didWinByTimer) return; 


  const finishGameHandler = async() =>{
    const queryString = winners.map(winner => `winners=${encodeURIComponent(winner)}`).join('&');
    try{

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/room?id=${id}&${queryString}`,{method:'DELETE'});
      if (!response.ok){
        const data = await response.json();
        throw new Error(data || 'failed ending match');
      }
    }
    catch(err:any){
      console.error(err.message || 'something went wrong with match end');
      redirect('/');
    }
  }
 finishGameHandler();
},[winners])


// update stage list scroll
  useEffect(()=>{
    if(!dotList.current || stage===-1) return;
    else if(stage ===19) dotList.current.children[stage].scrollIntoView();
    else dotList.current.children[stage+1].scrollIntoView();
  },[stage])

  // hadnles player leaving before other joined
  useEffect(()=>{
    const unloadHandler = async() =>{
      if (usersInitial.length>1) return;
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/room?id=${id}`,{method:'DELETE'});
    }
    window.addEventListener('beforeunload',unloadHandler);

    return()=>{
      if (winners.length<1 && stage===-1) unloadHandler(); // handles path change
      window.removeEventListener('beforeunload',unloadHandler) // handles closing tab
    }
  },[])

  // handles mapping user names 
    const usersMapped = users.map((userObj:any) =>
      <li key={userObj.id} className={`flex flex-col  gap-1 p-2 inputStyle h-16 w-36 ${user.id === userObj.id ? 'border-2 border-bgDark dark:border-bg' :'opacity-80'}`}>
      <p className='font-semibold truncate text-sm'>{userObj.name}</p>
      <section className='flex items-center justify-between w-full'>
      <p className='text-xs opacity-75'>{userObj.level}</p>
      <p className='text-xs'><span className='opacity-75 text-[10px]'>Score: </span>{userObj.duelScore}</p>
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

// start animation when round is ready.
useEffect(()=>{
  if ( !startRoundAnimation) return;

  const timeout = setTimeout(() => {
    setIsRoundReady(true);
    setStartRoundAnimation(false);
  }, 3000);

},[startRoundAnimation])


// set db room stage to 1 , indicator so users cant join afterwise. called when 2 players are on.
const updateStageHandler = useCallback(async()=>{
  try{
    console.log('updating stage of id ' + id);
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/room`,{
      method:'PUT',
      body:JSON.stringify({id:id}),
      headers:{'Content-Type':'application/json'},
      cache:'no-store'
    })
    if (!response.ok) throw new Error('something went wrong');
    const data = await response.json();
    if (!data) throw new Error('something went wrong');
    console.log(data);
  }
  catch(err:any){
    console.log(err.message || 'error');
  }
},[])

// handles other player leaving for too long to ensure  victory.
useEffect(()=>{
  // check if game started
  if (stage<0 || currentSynced===null) return;
  let timeout:ReturnType<typeof setTimeout>;
  // check current amount of synced
  if (currentSynced ===1){
    console.log('Starting timer');
    // start coutndown , other player left.
    timeout = setTimeout(() => {
      didWinByTimer = true;
      setWinners([user.id]);
    }, 5000);

  }
  // clear timeout if amount gets back...
  return()=>{clearTimeout(timeout); console.log('Canceled timer')}; 
},[currentSynced])




// handles ui update for first user , called once other state changes and activates ONCE.
  useEffect(()=>{
    // update stage db to prevent refresh rejoin (only second player calls it.)
    if (!didUpdateStage && usersInitial.length===2 && other){
      didUpdateStage = true;
      updateStageHandler(); 
    }

    if (!other || startRoundAnimation || stage>-1 || winners.length>0) return;
    // update ui if first player..
    if(users.length<2){
      const secondObj = {name:other.name,level:other.level,duelScore:other.duelScore,exp:0,words:[]}
      setUsers([users[0],secondObj]);
    }
    setStartRoundAnimation(true);
    setStage(0);
  },[other])

  // subscribtion to room presence, updates otherStatus state.
  useEffect(()=>{
    const channelA = supabase.channel(`room=${id}`);
    channelA
    .on(
      'presence',
      { event: 'sync' },
      () => {
        const newState = channelA.presenceState() // get channel presence (including both players states.)
        const keys = Object.keys(newState);
        setCurrentSynced(keys.length);
        if (keys.length <2) return null;
        const indexToSet = (newState[keys[0]][0] as any).id === user.id ? 1 : 0; // if id o 0 need to set to 1 the other.
        const innerObjectToSet = newState[keys[indexToSet]] ? newState[keys[indexToSet]][0] : null;
        if(innerObjectToSet) setOther(innerObjectToSet);
        
      }
    )
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channelA.track({
          hasWrong,
          stage,
          name: userStore.name,
          level: userStore.level,
          duelScore: userStore.duelScore,
          id: user.id,
          answers,
          winners
        })
      }
    })

    return()=>{
      channelA.unsubscribe();
    }
  },[answers,userStore.name])




  // handles finish of the round and start a new round or finish game.
  useEffect(()=>{
    if (!other )return;
    // check if other already has winners so just sync.
    if (other.winners.length>0){setWinners(other.winners);return;}
    // edge cases to prevent first round entry.
    if (isRoundReady || startRoundAnimation || answers.length<1) {console.log('round not ready or first stage');return;};
    // make sure both finished same round
    if (answers.length !== other.answers.length) {console.log('players not same answers length');return;};
    // check win/lose/tie/continue condition
    if (hasWrong){
      // tie/lose
      if (other.hasWrong) setWinners([other.id,user.id]); // tie
      else setWinners([other.id]); // lose
    }
    // don't have wrong
    else{
      // win/tie / (continue if nither have wrong answer)
      if (other.hasWrong) setWinners([user.id]); // win
      else {
        // nither wrong
        if (stage === 19) setWinners([other.id,user.id]); // tie max stage
        else{    
          // continue to new stage
          setStage(prev => prev+1);
          setStartRoundAnimation(true);
        }
      }
    }
  },[answers,other])


  // answer of current player 
  const answerUpdate =  useCallback((answer:boolean) =>{
    setAnswers(prev => [...prev,answer]);
    setIsRoundReady(false);
  },[])

  let winnersMapped = '';
  if(winners.length>0) winnersMapped =  winners.length >1 ? 'its a tie ! 😐' : winners[0]===user.id ? 'You win! 😃' : 'You lost! 🥺';
  if (winners[0]==='none') winnersMapped='You cancled the match! 🙁';

  
  return (
    <div key={stage} className='flex flex-col gap-4 pt-8'>

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
        {mappedRoundDots2}
      </ul>
      </section>


        {winners.length === 0 ?
        <>
          {startRoundAnimation 
          ?
          <TextStartAnimation/> 
          :
          <>
            {isRoundReady ? <DuelGameArea words={words} stage={stage} answerUpdate={answerUpdate}/> : <p className='animate-bounce text-center opacity-75'>Waiting for other player...
              {answers.length>0 && hasWrong && '❌'}
              {answers.length>0 && !hasWrong && '✅'}
              {answers.length===0 &&'😪'}</p> }
          </>
          }
        </>
          :
          <section>
          <p className='text-center'>{winnersMapped}</p> 
          </section>
        }



    </div>
  )
}

export default Main