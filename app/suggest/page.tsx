import React from 'react'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import SuggestMain from '@/src/components/Suggest/SuggestMain';
import { role } from '@/utils/tsModels';


const getUserData = async()=>{
  const supabase =  createServerComponentClient({cookies});
  let user:role = 'anon'

    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) user = 'anon'
    else if (userId ===process.env.ADMIN_ID) user='admin';
    else user='user'
    
    return user
}

const page = async() => {
  const role:role = await getUserData();
  return (
    <SuggestMain role={role}/>
  )
}

export default page