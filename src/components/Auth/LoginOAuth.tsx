import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import React from 'react'
import { AiFillGithub,AiFillGoogleCircle } from 'react-icons/ai';

const LoginOAuth = () => {
    const supabase = createClientComponentClient();
    const githubLoginHandler = async() =>{

        await supabase.auth.signInWithOAuth({
            provider:'github',
            options:{
                redirectTo:`https://pashutanglit.vercel.app/auth/callback/oauth`,
            }
        })
    }
    const googleLoginHandler = async()=>{

        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options:{
                redirectTo:`https://pashutanglit.vercel.app/auth/callback/oauth`
            }
        })
    }

    return (
        <div className='flex items-center justify-center gap-4 w-full py-4'>
            <section onClick={githubLoginHandler} className='inputStyle inputHover cursor-pointer text-2xl w-fit grid place-items-center border-2 border-bg/50 dark:border-bgDark/50 p-2'>
            <AiFillGithub/>
            </section>
            <section onClick={googleLoginHandler} className='inputStyle cursor-pointer inputHover text-2xl w-fit grid place-items-center border-2 border-bg/50 dark:border-bgDark/50 p-2'>
            <AiFillGoogleCircle/>
            </section>
        </div>
    )
}

export default LoginOAuth