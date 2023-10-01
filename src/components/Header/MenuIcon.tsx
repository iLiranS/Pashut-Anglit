import React, { useEffect } from 'react'

const MenuIcon:React.FC<{isOpen:boolean}> = ({isOpen}) => {
  return (
    <div  className='flex flex-col gap-1 menuIcon w-fit'>
        <section className={` h-[2px] bg-bgDark dark:bg-bg rounded-md ${isOpen ? 'w-3' : 'w-4'}   transition-transform duration-500 menuIcon`}/>
        <section className={`h-[2px] bg-bgDark dark:bg-bg rounded-md ${isOpen ? 'w-4' : 'w-3'} transition-transform duration-500 menuIcon`}/>
        <section className={` h-[2px] bg-bgDark dark:bg-bg rounded-md ${isOpen ? 'w-3' : 'w-4'} transition-transform duration-500 menuIcon`}/>
    </div>
  )
}

export default MenuIcon