'use client'
import React, { useEffect } from 'react'
import { toast } from 'react-toastify'
const NoAccess = () => {
    const notifyError = () => toast.error('התחבר על מנת לגשת לעמוד זה');

    useEffect(()=>{
        notifyError();
    },[])

  return (
    <div className='grid h-screen w-screen place-items-center'>
            <p>עליך להתחבר על מנת לגשת לעמוד זה</p>
            
        </div>
  )
}

export default NoAccess