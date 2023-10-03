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


      <h2 className='text-2xl text-violet-500 w-full'>Update 1.0.1</h2>
      <ul className=' list-disc list-inside w-full'>
      
        <h3 className='text-violet-300'>Dictionary</h3>
        <ul className='pl-2 list-disc list-inside'>
          <li>Dictionary UX fixes.</li>
        </ul>

        <h3 className='text-violet-300'>Main Study</h3>
        <ul className='pl-2 list-disc list-inside'>
          <li>Balanced points after answering correctly.</li>
          <li>Added more randomness to word levels.</li>
          <li>Mobile hover stays upon answering fix.</li>
          <li>Added to study random words that the user answered in the past (only old words)</li>
        </ul>
      </ul>


      <h3 className='text-xl w-full'>
      Roadmap
      </h3>

      <ul className=' list-disc list-inside'>
        <li className=' line-through decoration-white/60 dark:decoration-black/50'>
        Main System :word correct and wrong loop
        </li>

        <li className='line-through decoration-white/60 dark:decoration-black/50'>
        Dictionary page of words that left and done filter
        </li>

        <li>
        Duel system - almost done - missing delete on complete and update user score, also friend vs friend
        </li>

        <li>
        User settings - such as password reset , name change and more.
        </li>

        <li>
        SMTP for authentication
        </li>

        <li>
        More games
        </li>

        <li>
          Design for the website - Landing page, overall design, maybe user profiles and more.
        </li>

        <li>
          More words and translates - currently not enough to level up probably.
        </li>
      </ul>

      <h3 className='text-xl w-full'>
      Current Features
      </h3>

      <ul className='list-disc list-inside w-full'>
        <li>Word Quiz main system.</li>
        <li>Suggest word system.</li>
        <li>Authentication with database which contains users levels and progress.</li>
        <li>Dictionary to revisit words the user already answered correctly.</li>
        <li>Duel System is <span className='text-orange-400'>Almost</span> done - Just need to finish edge cases</li>

      </ul>

      <section className='w-full'>
      <p className='w-full'><span className='text-green-400'>Overall</span> this site is useable to learn new words and I update and add words occasionally.</p>
      <p className='text-sm opacity-80 w-full'>Please note that you have to authenticate in order to use the website features</p>
      </section>




    </div>
  )
}
