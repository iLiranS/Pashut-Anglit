const SingleAnswer:React.FC<{callBackOnClick:()=>void,translate:string,reveal:boolean,isTrue:boolean}> = ({callBackOnClick,translate,reveal,isTrue}) =>{
    const callBackHandler = () =>{
        if (reveal) return;
        callBackOnClick();
    }
    return(
        <li onClick={callBackHandler}  className={`p-3 h-12 inputStyle list-none cursor-pointer relative flex items-center justify-between transition-transform ease-in ${reveal ? 'scale-0 delay-1500' : 'scale-100'}`}>
            <button className={`${reveal && isTrue ? 'text-green-600 dark:text-green-300' :''}`} disabled={reveal} >{translate}</button>
            {reveal &&
                <p className={`${isTrue ? 'text-green-500' : 'text-red-500'} animate-scaleUpWord`}>
                    {isTrue ? '✓' :'⨉'}
                </p>  
            }
        </li>
    )
}
export default SingleAnswer