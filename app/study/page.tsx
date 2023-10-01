import MainStudy from '@/src/components/Study/MainStudy'
import { User } from '@prisma/client';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react'





const page = () => {
    return (
        <MainStudy/>
    )
}

export default page