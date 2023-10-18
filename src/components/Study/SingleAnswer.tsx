import { useEffect, useState } from "react";

const SingleAnswer:React.FC<{callBackOnClick:()=>void,translate:string,reveal:boolean,isTrue:boolean}> = ({callBackOnClick,translate,reveal,isTrue}) =>{
    const [didClick,setDidClick] = useState(false);
    const callBackHandler = () =>{
        setDidClick(true);
        if (reveal) return;
        callBackOnClick();
    }
    useEffect(()=>{
        if(!reveal) setDidClick(false);
    },[reveal])
    return(
        <li onClick={callBackHandler}
        className={` ${didClick && '  bg-bgDark/20 dark:bg-bg/20'} ${reveal  ? 'scale-0 delay-1500' : 'scale-100'}  p-3 inputStyle list-none cursor-pointer relative flex items-center justify-center transition-transform ease-in text-2xl`}>
            <button className={`${reveal && isTrue ? 'text-green-600 dark:text-green-300' :''} ${reveal && !isTrue && 'text-red-500'} font-semibold ${didClick && 'animate-click'}`} disabled={reveal} >{translate}</button>
        </li>
    )
}
export default SingleAnswer

//${reveal ? 'scale-0 delay-1500 border-2' : 'scale-100 border-0'} text-2xl ${isTrue? 'border-green-400' :'border-red-400'}