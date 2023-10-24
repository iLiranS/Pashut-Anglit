import React, { useCallback, useEffect, useRef, useState } from 'react'
import {AiOutlineArrowUp} from 'react-icons/ai'

type touchPos = {x:number|null,y:number|null};

// Detects first touch spot and release spot and decide on direction by that.
const PlayerMovement:React.FC<{updateDirection:(direction:number)=>void,currentDirection:number|null,playerLength:number,didLose:boolean}> = ({didLose,updateDirection,currentDirection,playerLength}) => {
    const [startPos,setStartPos] = useState<touchPos>({x:null,y:null});
    const [endPos,setEndPos] = useState<touchPos>({x:null,y:null});
    const boardRef = useRef<HTMLDivElement>(null);
    const isNewDirectionValid =useCallback((newDir:number) =>{
        if (!currentDirection) return true;
        if (playerLength <2) return true;
        
        switch(currentDirection){
            case 1:
            case 3:
                return newDir === 4 || newDir === 2;
            case 2:
            case 4:
                return newDir === 1 || newDir === 3;

            default:
            return false;
        }
    },[currentDirection,playerLength])

    const updateDirectionHandler = useCallback((direction:number)=>{
        if(isNewDirectionValid(direction)) updateDirection(direction);
    },[isNewDirectionValid,updateDirection])

    // direction handler keyPress
    useEffect(()=>{

        const keyPressHandler = (e:KeyboardEvent) =>{
            switch(e.key){
                case 'w':
                case 'W':
                case 'ArrowUp':
                    updateDirectionHandler(1)
                    break;

                case 'd':
                case 'D':
                case 'ArrowRight':
                    updateDirectionHandler(2)
                    break;
                
                case 's':
                case 'S':
                case 'ArrowDown':
                    updateDirectionHandler(3)
                    break;
                
                case 'a':
                case 'A':
                case 'ArrowLeft':
                    updateDirectionHandler(4)
                    break;
                
                default:
                    break;
            }
        }

        window.addEventListener('keydown',keyPressHandler)

        return ()=> {window.removeEventListener('keydown',keyPressHandler)}
    },[updateDirectionHandler])

    const setTouchStartHandler = (e:TouchEvent) =>{
        console.log('start touch listener')
        const startPos:touchPos = {x:e.touches[0].clientX,y:e.touches[0].clientY};
        setStartPos(startPos)
    }
    // when touch end I can already calculate new direction.
    const setTouchEndHandler = useCallback(() =>{
        console.log('end touch listener')
        if (!startPos.x || !startPos.y) return;
        if (!endPos.x || !endPos.y) return;
            console.log(startPos,endPos)
        const yMove = endPos.y - startPos.y; // yMove > 0 means UP . yMove < 0 means DOWN
        const xMove = endPos.x - startPos.x; // xMove > 0 means RIGHT . xMove < 0 means LEFT
        // check if xMove > yMove then go by X axis, otherwise Y axis.
        if (Math.abs(yMove) > Math.abs(xMove)){
            if (yMove > 0) updateDirection(3);
            else updateDirection(1);
        }
        else{
            if (xMove >0) updateDirection(2)
            else updateDirection(4);

        }
    },[endPos,startPos,updateDirection])

    const setTouchMoveHandler = (e:TouchEvent) =>{
        const currentPos:touchPos = {x:e.touches[0].clientX,y:e.touches[0].clientY};
        setEndPos(currentPos);
    }




    useEffect(()=>{
        const ref = boardRef.current;
        if(!ref) return
        ref.addEventListener('touchstart',setTouchStartHandler);
        ref.addEventListener('touchmove',setTouchMoveHandler);
        ref.addEventListener('touchend',setTouchEndHandler);

        return()=>{
            ref.removeEventListener('touchstart',setTouchStartHandler);
            ref.removeEventListener('touchend',setTouchEndHandler);
            ref.removeEventListener('touchmove',setTouchMoveHandler);
        }
    },[boardRef,setTouchEndHandler])



return (
    <div ref={boardRef} className={`absolute w-full h-full  ${didLose && '-z-10'}`}>

    </div>
//     <ul className='flex flex-col w-36 max-w-full  h-fit gap-2  mx-auto relative items-center'>
//         <li onClick={()=>{updateDirectionHandler(1)}} className='text-center inputStyle cursor-pointer w-12 aspect-square'><AiOutlineArrowUp className='w-full h-full'/></li>
//         <ul className='flex w-full items-center justify-between'>
//             <li onClick={()=>{updateDirectionHandler(4)}} className=' inputStyle py-3 cursor-pointer w-12 aspect-square'><AiOutlineArrowUp className='w-full h-full rotate-[270deg]'/></li>
//             <li onClick={()=>{updateDirectionHandler(2)}} className=' inputStyle py-3 cursor-pointer w-12 aspect-square'><AiOutlineArrowUp className='w-full h-full rotate-90'/></li>
//         </ul>
//         <li onClick={()=>{updateDirectionHandler(3)}} className='text-center inputStyle cursor-pointer w-12 aspect-square'><AiOutlineArrowUp className='w-full h-full rotate-180'/></li>
// </ul>
)
}

export default PlayerMovement;