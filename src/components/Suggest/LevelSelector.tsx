import React, { ChangeEvent, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { wordLevels } from '@/utils/tsModels';



const LevelSelector:React.FC<{updateLevel:(e:wordLevels)=>void}> = ({updateLevel}) => {
    const valueChangeHandler = (e:any) =>{
        updateLevel(e);
    }

  return (
    <Select  defaultValue='easy' onValueChange={valueChangeHandler}>
        <SelectTrigger className="w-60">
            <SelectValue  placeholder={'Easy'}/>
        </SelectTrigger>

        <SelectContent>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
            <SelectItem value="impossible">Impossible</SelectItem>
        </SelectContent>
    </Select>
  )
}

export default LevelSelector