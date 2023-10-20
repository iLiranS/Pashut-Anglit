'use client'
import React,{useState,useEffect,useMemo, useCallback} from 'react'
import PlayerMovement from './PlayerMovement';
import { db } from '@/utils/db';
import { localWord } from '@/utils/tsModels';
import { toast } from 'react-toastify';



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
    const [score,setScore] = useState(0);
    const [direction,setDirection] = useState<number|null>(null); // 1 up , 2 right , 3 down , 4 left
    const [didLose,setDidLose] = useState(false);
    const [firstWord,setFirstWord] = useState<localWord>()
    const [secondWord,setSecondWord] = useState<localWord>()
    const [correctWord,setCorrectWord] = useState(0); // 0= first , 1= second


    // generate fruit position on empty space.
    const generateNewFruitPosition = useCallback(() =>{
        const availableSpots:number[][] = [];
        for (let i =0 ; i<gridSize;i++){
            //row
            for (let j =0; j<gridSize;j++){
                //col
                if(board[i][j]===0) availableSpots.push([i,j]);
            }
        }
        if (availableSpots.length <=1) return false; // no spots
        const rndIndex = Math.floor(Math.random() * availableSpots.length);
        const randomFruitPos = availableSpots[rndIndex];
        return randomFruitPos
    },[gridSize,board])


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
                mappedInside.push(<li className={`grid place-items-center w-full aspect-square ${isFirst && 'bg-black'} ${doesPlayerInSpot && !isFruitInSpot &&!isfruitCopyInSpot && !isFirst && 'bg-green-400'} ${isFruitInSpot && 'bg-orange-500'} ${ isfruitCopyInSpot && 'bg-violet-600'} ${!isFruitInSpot && !isfruitCopyInSpot && !doesPlayerInSpot && 'bg-gray-400'}`} key={counter.toString()}></li>)
                counter++;
            }
        }
        return mappedInside;
    },[snake,fruitPos,fruitPosCopy,gridSize])



    const updateGame = () =>{
        if (!didGameStart || didLose) return;
        console.log(direction)
        let newSnake =[...snake];

        switch(direction){
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
    }

    const updateDirectionHandler = (direction:number) =>{
        setDidGameStart(true);
        setDirection(direction);
    }


    const restartGameHandler = () => {
        setSnake([[Math.floor(gridSize/2),Math.floor(gridSize/2)]]);
        setScore(0);
        setBoard(initialArray);
        setDidGameStart(false);
        setDidLose(false);
        setDirection(null);
        setFruitPos(null);

    };



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


    //update board empty spots based on playerPos array
    useEffect(()=>{
        // if everything is valid, update available spots
        setBoard(()=>{
            const fornow = [...initialArray];
            snake.forEach(spot => {
                if(spot[0]>0 && spot[0]<gridSize-1 && spot[1]>0 && spot[1]<gridSize-1) fornow[spot[0]][spot[1]]=1
            });
            return initialArray;
        })
    },[snake,initialArray,gridSize])

    useEffect(()=>{
        const compareVal:number = Math.floor(score/4.5 +7);
        let newFps = Math.min(30,compareVal)
        setFps(newFps);

    },[score])


    // generating fruits
    useEffect(()=>{
        if (fruitPos) return;
        const truePos = generateNewFruitPosition();
        if (!truePos) {setDidLose(true); setDidWin(true)}
        const falsePos = generateNewFruitPosition();
        setFruitPos(truePos as number[]);
        setfruitPosCopy(falsePos as number[]);


    },[fruitPosCopy,fruitPos,generateNewFruitPosition])

    // generate words
    useEffect(()=>{
        
        const getRandomWords =async () => {
            const words = await db.words.toArray();
            if (!words || words.length<2) {toast.error('אין מספיק מילים,היכנס ללימוד מילים קודם כדי להמשיך')};
            const rnd1 = Math.floor(Math.random()*words.length);
            let rnd2 = Math.floor(Math.random()*words.length);
            while (rnd2===rnd1){
                rnd2 = Math.floor(Math.random()*words.length);
            }
            setFirstWord(words[rnd1]);
            setSecondWord(words[rnd2]);
        }
        getRandomWords();
        setCorrectWord(Math.floor(Math.random()*2));
        
    },[score])


  return (
    <div className=' h-full w-full gap-1  relative mx-auto pt-8 flex flex-col'>
        <section className={`flex ${didGameStart ? 'justify-center' : ' justify-evenly'} items-center  h-fit`}>
            <p className='text-center'>Score : {score}</p>
            {!didGameStart &&
            <div className='flex items-center gap-1'>
                <p>Grid Size: </p>
                <input className='inputStyle w-12' onChange={(e:any)=>{setGridSize(e.target.value)}} value={gridSize} placeholder='grid size' type='number' min={10} max={30}/>
            </div>
            }
        </section>
        <section className='flex items-center justify-evenly text-lg  h-fit'>
            <div className='flex items-center gap-1 text-orange-500' dir='rtl'><section className='w-3 aspect-square bg-orange-500'></section>{firstWord?.translate}</div>
            <p>{correctWord===0 ? firstWord?.word : secondWord?.word}</p>
            <div className='flex items-center gap-1 text-violet-600' dir='rtl'><section className='w-3 aspect-square bg-violet-600'></section>{secondWord?.translate}</div>
        </section>
        <ul style={{
            gridTemplateRows: `repeat(${gridSize}, 1fr)`,
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            }} 
            className={`relative grid gap-1 overflow-hidden w-[360px] md:w-[500px] max-w-[95vw] mx-auto aspect-square bg-gray-400/20`}>
            {boardMapped}

            {!didGameStart && 
            <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-bg dark:bg-bgDark p-4 rounded-md animate-pulse '>
                <p>Press W,A,S,D or Arrow keys to start</p>
            </div>
            }
            {didLose && !didWin &&
                <div className='flex flex-col text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-bg dark:bg-bgDark p-4 rounded-md'>
                <p>You Lost, Score : {score}</p>
                <p className='text-orange-500 cursor-pointer' onClick={restartGameHandler}>Press to restart</p>
            </div>
            }
            {didLose && didWin &&
                <div className='flex flex-col text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-bg dark:bg-bgDark p-4 rounded-md'>
                <p>You WON !, Score : X</p>
                <p className='text-orange-500 cursor-pointer' onClick={restartGameHandler}>Press to restart</p>
            </div>
            }

        </ul>

        <PlayerMovement key={score} currentDirection={direction} playerLength={score+1} updateDirection={updateDirectionHandler}/>



    </div>
  )
}

export default MainSnake