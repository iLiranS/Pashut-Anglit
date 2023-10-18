import { useState } from "react";

const SingleAnswer:React.FC<{callBackOnClick:()=>void,translate:string,reveal:boolean,isTrue:boolean}> = ({callBackOnClick,translate,reveal,isTrue}) =>{
    const [didClick,setDidClick] = useState(false);
    const callBackHandler = () =>{
        setDidClick(true);
        if (reveal) return;
        callBackOnClick();
    }
    return(
        <li onClick={callBackHandler}
        className={` p-4 animate-scaleUp inputStyle list-none cursor-pointer relative flex items-center justify-center transition-transform ease-in text-2xl ${reveal ? 'scale-0 delay-1500' :''} ${didClick && ' bg-bgDark/20 dark:bg-bg/20'}`}>
            <button className={`${reveal && isTrue ? 'text-green-600 dark:text-green-300' :''}`} disabled={reveal} >{translate}</button>
            <div className={`${reveal ? ' opacity-100' :'opacity-0'} transition-opacity duration-500 border-2 ${isTrue ? 'border-green-400' : 'border-red-400'} absolute h-full w-full top-0 rounded-md`}>

            </div>
        </li>
    )
}
export default SingleAnswer

//${reveal ? 'scale-0 delay-1500 border-2' : 'scale-100 border-0'} text-2xl ${isTrue? 'border-green-400' :'border-red-400'}