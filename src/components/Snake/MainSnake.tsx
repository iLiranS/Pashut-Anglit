'use client'
import React,{useState,useEffect,useMemo, useCallback} from 'react'
import PlayerMovement from './PlayerMovement';
import { db } from '@/utils/db';
import { localWord } from '@/utils/tsModels';
import {BiMove} from 'react-icons/bi'
import {FaRegKeyboard} from 'react-icons/fa'
import { toast } from 'react-toastify';
import {AiOutlineArrowUp} from 'react-icons/ai'


let nextDirection:number|null = null;
// can improve if added changing the near head positions to 1 as well so fruit cannot be spawned near hear.
// but it takes some calculations to not update out of board.
const MainSnake = () => {
    const [gridSize,setGridSize] = useState(15);
    const [snake,setSnake] = useState([[Math.floor(gridSize/2),Math.floor(gridSize/2)]]);
    const initialArray = useMemo(()=>Array.from({ length: gridSize }, () => Array.from({ length: gridSize }, () => 0)),[gridSize]);
    const [board,setBoard] = useState(initialArray); // also used for determine available fruit spots.
    const [fps,setFps] = useState(7);
    const [fruitPos,setFruitPos] = useState<number[]|null>(null);
    const [fruitPosCopy,setfruitPosCopy] = useState<number[]|null>(null);
    const [didGameStart,setDidGameStart] = useState(false);
    const [didWin,setDidWin] = useState(false);
    const [showGridLines,setShowGridLines] = useState(true);
    const [score,setScore] = useState(0);
    const [direction,setDirection] = useState<number|null>(null); // 1 up , 2 right , 3 down , 4 left
    const [didLose,setDidLose] = useState(false);
    const [firstWord,setFirstWord] = useState<localWord>()
    const [secondWord,setSecondWord] = useState<localWord>()
    const [correctWord,setCorrectWord] = useState(0); // 0= first , 1= second


    const boardMapped = useMemo(()=>{
        const mappedInside = [];
        let counter = 0;
        for(let i = 0; i<gridSize;i++){
            // now in row
            for (let j =0;j<gridSize;j++){
                // now in column
                const currentSpot = [i,j];
                const doesPlayerInSpot = snake.find(singlePos => singlePos.toString()===currentSpot.toString()) ? true : false;
                const isFruitInSpot = fruitPos?.toString() === currentSpot.toString() 
                const isfruitCopyInSpot = fruitPosCopy?.toString()===currentSpot.toString();
                const isFirst = snake[0][0] === currentSpot[0] && snake[0][1] === currentSpot[1];
                let rotateArrowDeg =0;
                switch(nextDirection){
                    case 2:
                        rotateArrowDeg = 90;
                        break;
                    case 3:
                        rotateArrowDeg = 180;
                        break;
                    case 4:
                        rotateArrowDeg= -90;
                        break;
                }
                mappedInside.push(<li className={`grid relative rounded-sm place-items-center w-full aspect-square ${isFirst && 'bg-black'} ${doesPlayerInSpot && !isFruitInSpot &&!isfruitCopyInSpot && !isFirst && 'bg-green-400'} ${isFruitInSpot && 'bg-orange-500'} ${ isfruitCopyInSpot && 'bg-violet-600'} ${!isFruitInSpot && !isfruitCopyInSpot && !doesPlayerInSpot && showGridLines && 'bg-gray-400/60'} ${!isFruitInSpot && !isfruitCopyInSpot && !doesPlayerInSpot && !showGridLines && 'bg-transparent'} `} key={counter.toString()}>
                    {isFirst && <AiOutlineArrowUp 
                                style={{ transform: `rotate(${rotateArrowDeg}deg)` }}
                                className={`absolute text-white text-xs opacity-80`}/>}
                </li>)
                counter++;
            }
        }
        return mappedInside;
    },[snake,fruitPos,fruitPosCopy,gridSize,showGridLines])

    const updateGame = () =>{
        if (!didGameStart || didLose || !direction) return;
        let newSnake =[...snake];

        switch(nextDirection){
            case 1:
                newSnake.unshift([newSnake[0][0]-1,newSnake[0][1]])
                break;
            case 2:
                newSnake.unshift([newSnake[0][0],newSnake[0][1]+1])
                break;
            case 3:
                newSnake.unshift([newSnake[0][0]+1,newSnake[0][1]])
                break;
            case 4:
                newSnake.unshift([newSnake[0][0],newSnake[0][1]-1])
                break;
        }
        let didEatFruit = fruitPos?.toString() === newSnake[0].toString();
        let didEatCopy = fruitPosCopy?.toString() === newSnake[0].toString();

        if (didEatCopy){
            if (correctWord===1){
                // win
                setScore(prev=> prev+1);
                setFruitPos(null);
                setfruitPosCopy(null)
            }
            else {
                // lose
                setDidLose(true);
            }
        }
            
        else if(didEatFruit){
            if (correctWord ===0){
                // win
                setScore(prev=> prev+1);
                setFruitPos(null);
                setfruitPosCopy(null)
            }
            else{
                // lose
                setDidLose(true);
            }

            }
        

        else{
            newSnake.pop();
        }
        setSnake(newSnake);
        nextDirection = direction;

        setBoard(()=>{
            const fornow = [...initialArray];
            newSnake.forEach(spot => {
                if(spot[0]>0 && spot[0]<initialArray.length-1 && spot[1]>0 && spot[1]<initialArray.length-1) fornow[spot[0]][spot[1]]=1
            });
            return fornow;
        })
    }

    // either sets direction or changes nextDirection, it will be updated after 1 snake movement in updateGame func
    const updateDirectionHandler = (direction:number) =>{
        setDidGameStart(true);
        if(!nextDirection) nextDirection = direction;
        setDirection(direction);
        
    }


    const restartGameHandler = () => {
        setSnake([[Math.floor(gridSize/2),Math.floor(gridSize/2)]]);
        setScore(0);
        setBoard(initialArray);
        setDidGameStart(false);
        setDidLose(false);
        setDirection(null);
        nextDirection = null;
        setFruitPos(null);

    };


// strats the game
    useEffect(()=>{
        const interval = setInterval(updateGame,1000/fps);
        return()=>clearInterval(interval);
    })

    // check if lost by wall or colliding itself
    useEffect(()=>{
        const headX = snake[0][1];
        const headY = snake[0][0];
        // by walls
        if(headY<0 || headY>gridSize-1) {setDidLose(true);return;}
        if (headX<0 || headX>gridSize-1) {setDidLose(true);return;}
        // check if collided
        snake.forEach((item,index)=>{
            if(index ===0) return false;
            if (snake[index].toString()===snake[0].toString()) {setDidLose(true); return;}
        })
    },[snake,gridSize])


    // returns  position on empty space on board (where snake is not there).
    const generateNewFruitPosition = useCallback(() =>{
        const availableSpots:number[][] = [];
        for (let i =0 ; i<board.length;i++){
            //row
            for (let j =0; j<board.length;j++){
                //col
                if(board[i][j]===0) availableSpots.push([i,j]);
            }
        }
        if (availableSpots.length <=6) return false; // only 4 spots left, conside as a win
        const rndIndex = Math.floor(Math.random() * availableSpots.length);
        const randomFruitPos = availableSpots[rndIndex];
        return randomFruitPos
    },[board])
    

// set fruits to 2 different locations 
    const generateFruits = useCallback(()=>{
        if (fruitPos) return;
        const truePos = generateNewFruitPosition();
        if (!truePos) {setDidLose(true); setDidWin(true)}
        let falsePos = generateNewFruitPosition();
        while (falsePos.toString() === truePos.toString()){
            falsePos = generateNewFruitPosition();
        }
        setFruitPos(truePos as number[]);
        setfruitPosCopy(falsePos as number[]);
    },[generateNewFruitPosition,fruitPos])


    // upon grid change remove fruits
    useEffect(()=>{
        setFruitPos(null);
        setBoard(initialArray);
    },[gridSize,initialArray])

// returns new fps by score
    const getNewFps = useCallback(()=>{
        const compareVal:number = Math.floor(score/5 +7);
        let newFps = Math.min(25,compareVal)
        return newFps
    },[score])

    // updates random words, getting words from dexie db (indexedDB)
    const updateRandomWords = useCallback(async()=>{
        const words = await db.words.toArray();
        if (!words || words.length<2) {toast.error('אין מספיק מילים,היכנס ללימוד מילים קודם כדי להמשיך')};
        const rnd1 = Math.floor(Math.random()*words.length);
        let rnd2 = Math.floor(Math.random()*words.length);
        while (rnd2===rnd1){
            rnd2 = Math.floor(Math.random()*words.length);
        }
        setFirstWord(words[rnd1]);
        setSecondWord(words[rnd2]);
        setCorrectWord(Math.floor(Math.random()*2));
    },[])

    // generate fruit when its gone.
    useEffect(()=>{
        generateFruits();
    },[generateFruits])

    // generate words and updates fps, called when score changes.
    useEffect(()=>{
        setFps(getNewFps());
        updateRandomWords();
    },[updateRandomWords,getNewFps])


  return (
    <div className=' h-[100dvh] w-screen gap-1 max-w-[500px] mx-auto  relative pt-3 select-none overflow-hidden flex flex-col pb-2 px-1'>

        <section className={`flex ${didGameStart ? 'justify-center' : ' justify-between'} w-full items-center mx-auto  h-fit`}>
            <p className='text-center'>Score : {score}</p>
            {!didGameStart &&
            <div className='flex items-center gap-1'>
                <div className='flex items-center gap-1'>
                    <p>Size</p>
                    <input className='inputStyle w-12' onChange={(e:any)=>{setGridSize(Math.max(10,Math.min(30,e.target.value)))}} value={gridSize} placeholder='grid size' type='number' min={10} max={30}/>
                </div>
                <div className='flex items-center gap-1'>
                    <p>Lines</p>
                    <input checked={showGridLines} onChange={(e:any)=>setShowGridLines(e.target.checked)} type='checkbox'/>
                </div>
            </div>
            }
        </section>



        <div className='relative h-full w-full flex flex-col justify-center overflow-hidden'>
        <section className='flex w-full items-center justify-evenly text-lg h-fit'>
            <div className='flex items-center gap-1 text-orange-500' dir='rtl'><section className='w-3 aspect-square bg-orange-500'></section>{firstWord?.translate}</div>
            <p>{correctWord===0 ? firstWord?.word : secondWord?.word}</p>
            <div className='flex items-center gap-1 text-violet-600' dir='rtl'><section className='w-3 aspect-square bg-violet-600'></section>{secondWord?.translate}</div>
        </section>
        <ul style={{
            gridTemplateRows: `repeat(${gridSize}, 1fr)`,
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        }} 
        className={`relative grid gap-1 overflow-hidden w-full aspect-square bg-gray-400/20`}>
            {boardMapped}

            {!didGameStart && 
            <li className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-bg dark:bg-bgDark p-4 rounded-md animate-pulse '>
                <div className='flex items-center gap-1 lg:hidden'> <BiMove/> <p>Drag Screen</p> </div>
                <div className=' items-center gap-1 hidden lg:flex'><FaRegKeyboard/> <p>W,A,S,D or Arrows</p></div>
            </li>
            }
            {didLose && !didWin &&
                <li className='flex flex-col text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-bg dark:bg-bgDark p-4 rounded-md'>
                    <p>You Lost, Score : {score}</p>
                    <p className='text-orange-500 cursor-pointer' onClick={restartGameHandler}>Press to restart</p>
                </li>
            }

            {didLose && didWin &&
                <li className='flex flex-col text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-bg dark:bg-bgDark p-4 rounded-md'>
                    <p>You WON !, Score : X</p>
                    <p className='text-orange-500 cursor-pointer' onClick={restartGameHandler}>Press to restart</p>
                </li>
            }
                <PlayerMovement didLose={didLose}  currentDirection={direction} playerLength={score+1} updateDirection={updateDirectionHandler}/>
        </ul>
        </div>




    </div>
  )
}

export default MainSnake