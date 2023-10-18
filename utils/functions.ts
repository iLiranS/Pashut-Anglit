import { userLevel, wordLevel } from "@prisma/client";
import { localArr } from "./tsModels";


export const updatedUserStats = (level:userLevel,exp:number,currentExp:number):{updatedLevel:userLevel,updatedExp:number}=>{
    console.log(currentExp + ' <- base | adding -> '+ exp);
    let updatedLevel = level;
    let updatedExp = currentExp;
    switch(level){

        case 'Rookie':
            if (currentExp + exp >20){
                updatedLevel = 'Novice';
                updatedExp += exp -20;
            }
            else{
                updatedExp+=exp
            }
            break;
        
        case 'Novice':
            if (currentExp + exp >40){
                updatedLevel = 'Skilled';
                updatedExp += exp -40;
            }
            else{
                updatedExp+=exp
            }
            break;
        case 'Skilled':
            if (currentExp + exp >100){
                updatedLevel = 'Expert';
                updatedExp += exp -100;
            }
            else{
                updatedExp+=exp
            }
            break;
        case 'Expert':
            if (currentExp + exp >250){
                updatedLevel = 'Expert';
                updatedExp += exp -250;
            }
            else{
                updatedExp+=exp
            }
            break;
        default:
            updatedExp+=exp;
    }
    return{updatedLevel,updatedExp}
}



export const getLevelsArrayFromLevel = (level:userLevel) =>{
    let levels:wordLevel[] =['easy'];
    switch(level){
        case 'Rookie':
            break;
        case 'Novice':
            levels=['easy','medium'];
            break;
        case 'Master':
            levels=['hard','impossible']
            break;
        default:
            levels=['medium','hard']
    }
    return levels;
}

// returns exp update according to level and right/wrong answer
export const getExpAmount = (level:userLevel,isRight:boolean):number =>{
    let expUpdate = 0;

    switch(level){        
        case 'Skilled':
            isRight ? expUpdate=0.4 : expUpdate=-0.1; 
        case 'Expert':
            isRight ? expUpdate=0.3 : expUpdate=-0.1;
        case 'Master':
            isRight ? expUpdate=0.2 : expUpdate=-0.1;
        default:
            if (isRight) expUpdate=0.5
    }
    return expUpdate;
}
// returns total exp to give or take after local refresh
const updateToGive = (level:userLevel,arr:localArr):number =>{
    let total = 0;
    arr.forEach(result =>{
        total += getExpAmount(level,result==='0' ? false : true);
    })
    return total;
}


// updates local array of answers before fetching status.
export const updateLocalArray = (level:userLevel,isRight:boolean):{expUpdate:number,dbExpUpdate?:number} =>{
    const answer = isRight ? '1' : '0';
    const localAnswers = localStorage.getItem('currentStreak');
    const expUpdate = getExpAmount(level,isRight);
    if (!localAnswers){
        // no current streak, create one and return not full.
        localStorage.setItem('currentStreak',JSON.stringify([answer]));
        return {expUpdate};
    }
    // push new answer
    const localValid = JSON.parse(localAnswers) as localArr;
    localValid.push(answer);
    
    // check if length of 9 then return true (which will trigger db validation)
    if (localValid.length >=30){
        localStorage.setItem('currentStreak',JSON.stringify([]));
        const expToGive = updateToGive(level,localValid);
        return {expUpdate,dbExpUpdate:expToGive};
    }
    // update localStorage
    localStorage.setItem('currentStreak',JSON.stringify(localValid));
    // not full yet.
    return {expUpdate};
}
export const userLevels:userLevel[] = ['Rookie','Novice','Skilled','Expert','Master'];