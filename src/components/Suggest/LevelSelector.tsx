import React, { ChangeEvent, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { wordLevels } from '@/utils/tsModels';



const LevelSelector:React.FC<{updateLevel:(e:wordLevels)=>void,initialNull?:boolean}> = ({updateLevel,initialNull=false}) => {
    const valueChangeHandler = (e:any) =>{
        updateLevel(e);
        }

  return (
    <Select  onValueChange={valueChangeHandler}>
        <SelectTrigger className=" w-60">
            <SelectValue  placeholder={initialNull ? 'כל הרמות' : 'קלה' }/>
        </SelectTrigger>

        <SelectContent>
            <SelectItem value="easy">קלה</SelectItem>
            <SelectItem value="medium">בינונית</SelectItem>
            <SelectItem value="hard">קשה</SelectItem>
            <SelectItem value="impossible">בלתי אפשרית</SelectItem>
        </SelectContent>
    </Select>
  )
}

export default LevelSelector