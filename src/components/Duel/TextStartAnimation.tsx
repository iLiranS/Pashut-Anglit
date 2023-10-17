import React, { useEffect, useState } from 'react'

const TextStartAnimation = () => {
  const [num,setNum] = useState(2);

  useEffect(()=>{
    let interval:ReturnType<typeof setInterval>;

      interval = setInterval(()=>{
        setNum(prev =>{
          return prev-1;
        })
      },1000)
    
    return () => {clearInterval(interval);}
  },[])

  let namVal = '';
  switch(num){
    case 2:
      namVal = 'READY'
      break;
    case 1:
      namVal = 'SET'
      break;
    default:
      namVal='GO'
  }

  return (
    <div key={num.toString()} className='text-center animate-scaleUp text-2xl'>{namVal}</div>
  )
}

export default TextStartAnimation