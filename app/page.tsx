'use client'
import { FormEvent,useState } from 'react'
import {AiOutlineArrowLeft} from 'react-icons/ai'
import {  toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import 'react-toastify/dist/ReactToastify.css';
import useUserStore from '@/store/useUserStore';



export default function Home() {
 

  return (
    <div className='w-fit mx-auto relative py-4 grid place-items-center gap-4'>
      <p>Landing Page...</p>
    </div>
  )
}
