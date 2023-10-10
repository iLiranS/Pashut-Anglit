import { userLevel } from '@prisma/client';
import React from 'react'
import { Progress } from "@/components/ui/progress"
import { userLevels } from '@/utils/functions';

const maxExpPerLevel = {
    Rookie:20,
    Novice:40,
    Skilled:100,
    Expert:250,
    Master:null
}


const ExpProgress:React.FC<{level:userLevel,exp:number}> = ({level,exp}) => {
    const currentLevelIndex = userLevels.indexOf(level);
    const nextLevelIndex = level==='Master' ? currentLevelIndex : currentLevelIndex+1
    const percentage = level==='Master' ? 0 : Math.floor(exp/maxExpPerLevel[level]*100)
return (
    <div className='flex flex-col gap-1 '>
        <p className='text-sm opacity-75 text-end font-medium'>{level}{level==='Master' ? ' - Max Level' :''}</p>
        {level==='Master' ?  <p className='text-sm text-end'>Exp: <span className='font-semibold opacity-100'>{exp}</span> <span className='text-xs'>pts</span> </p>
        :
            <section className='flex relative'>
                <Progress  className='h-[12px]' value={percentage}/>
                <p dir='ltr' className='absolute top-1/2 left-2 -translate-y-1/2 text-xs text-text font-medium'>{exp.toFixed(1)}/{maxExpPerLevel[level]} <span className='text-[10px] font-semibold'>pts</span></p>
                <p className='absolute top-1/2 right-2 -translate-y-1/2 text-xs text-bgDark font-medium'>{userLevels[nextLevelIndex]}</p>
            </section>
        }
    </div>
)
}

export default ExpProgress