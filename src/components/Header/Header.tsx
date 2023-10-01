'use client'
import React , {useEffect,useState , useCallback} from 'react'
import useUserStore from '@/store/useUserStore'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { User } from '@prisma/client'
import Sidebar from './Sidebar'
import {CgMenuMotion} from 'react-icons/cg'
import MenuIcon from './MenuIcon'
import Link from 'next/link'



const Header = () => {
    const [isOpen,setIsOpen] = useState(false);
    const [isUserLoading,setIsUserLoading] = useState(true);
    const [isHydrated,setisHydrated] = useState(false);
    const userStore = useUserStore();
    const supabase = createClientComponentClient();


    const getUserSession =useCallback(async() =>{
      setIsUserLoading(true);
      try{
        const userData = (await supabase.auth.getUser()).data.user;
        if(!userData) throw new Error('no user logged in');
          const id = userData.id;
          const response = await fetch(`https://pashutanglit.vercel.app/api/user?id=${id}`,{cache:'no-store'});
          if (!response.ok) throw new Error('something went wrong with getting user data');
          const user = await response.json() as User;
          userStore.setId(user.id);
          userStore.setName(user.name);
          userStore.setExp(user.exp);
          userStore.setLevel(user.level);
          userStore.setDuelScore(user.duelScore);
      }
      catch(err:any){
        console.log(err.message || 'error getting user');
      }
      setIsUserLoading(false);      
    },[supabase.auth])



    useEffect(()=>{
      setisHydrated(true);
      getUserSession();

    },[getUserSession])


    const logoutHandler = async() =>{
      await supabase.auth.signOut();
      userStore.logout();
  }

  const toggleNav = () => setIsOpen(prev => !prev);
  const closeSideBar = () => setIsOpen(false);
  
  


    if (!isHydrated) return null
  return (
    <header className={`absolute top-0 w-full overflow-hidden z-30`}>
      <div onClick={toggleNav} className={`${isOpen ? 'translate-x-56' : 'translate-x-0'} py-4 px-4  transition-transform ease-in cursor-pointer menuIcon w-fit`}>
      <MenuIcon  isOpen={isOpen}/>
      </div>
      {!userStore.id && !isUserLoading && <Link className='absolute right-2 top-2 inputStyle' href={'/auth/login'}>התחבר</Link>}
      <Sidebar closeSideBar={closeSideBar} logOut={logoutHandler} isOpen={isOpen}/>
    </header>
  )
}

export default Header