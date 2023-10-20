import React, { useCallback, useEffect } from 'react'
import {AiOutlineArrowUp} from 'react-icons/ai'

const PlayerMovement:React.FC<{updateDirection:(direction:number)=>void,currentDirection:number|null,playerLength:number}> = ({updateDirection,currentDirection,playerLength}) => {
    

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



return (
    <ul className='flex flex-col w-36 max-w-full  h-fit gap-2  mx-auto relative items-center'>
        <li onClick={()=>{updateDirectionHandler(1)}} className='text-center inputStyle cursor-pointer w-12 aspect-square'><AiOutlineArrowUp className='w-full h-full'/></li>
        <ul className='flex w-full items-center justify-between'>
            <li onClick={()=>{updateDirectionHandler(4)}} className=' inputStyle py-3 cursor-pointer w-12 aspect-square'><AiOutlineArrowUp className='w-full h-full rotate-[270deg]'/></li>
            <li onClick={()=>{updateDirectionHandler(2)}} className=' inputStyle py-3 cursor-pointer w-12 aspect-square'><AiOutlineArrowUp className='w-full h-full rotate-90'/></li>
        </ul>
        <li onClick={()=>{updateDirectionHandler(3)}} className='text-center inputStyle cursor-pointer w-12 aspect-square'><AiOutlineArrowUp className='w-full h-full rotate-180'/></li>
</ul>
)
}

export default PlayerMovement;