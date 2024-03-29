import Main from '@/src/components/Duel/Main'
import React from 'react'
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import { Word, wordLevel } from '@prisma/client';

const getDuelData = async(id:number,userId:string) =>{
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/room?id=${id}&userid=${userId}`,{cache:'no-cache'});
    if (!response.ok){
        return null;
    }
    if (!response.ok) return false;
    const data = await response.json();
    return data;
}

const page = async({params}:{params:{id:number}}) => {
    const supabase = createServerComponentClient({cookies});
    const user = (await supabase.auth.getUser()).data.user
    if (!user?.id)  redirect('/');
    const room = await getDuelData(params.id,user.id);
    if (!room || room.stage>0) return redirect('/'); // if room doesn't exist or already started redirect.

    // sort words array by asc level.
    const levelOrder:wordLevel[] = ["easy", "medium", "hard", "impossible"];
    const sortedWords = room.words.sort((a:Word,b:Word)=>{
        const levelA = levelOrder.indexOf(a.level);
        const levelB = levelOrder.indexOf(b.level);
        return levelA - levelB
    })


    return (
        <div className='grid mx-auto place-items-center py-4'>
            <Main id={room.id} words={sortedWords} usersInitial={room.users} user={user as any} />
        </div>
    )
}

export default page