import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import {AiOutlineInfoCircle} from 'react-icons/ai'
import React from 'react'

const WordCountInfo = () => {
return (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger><AiOutlineInfoCircle className='opacity-50 text-m'/></TooltipTrigger>
            <TooltipContent>
                answer 3 times correctly to learn the word.
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
)
}

export default WordCountInfo
