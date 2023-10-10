'use client'
import { FormEvent,useState } from 'react'
import {AiOutlineArrowLeft} from 'react-icons/ai'
import {  toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import 'react-toastify/dist/ReactToastify.css';
import useUserStore from '@/store/useUserStore';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


export default function Home() {
 

  return (
    <div className='relative py-4 grid place-items-center gap-4 w-[100vw]'>

<Accordion type="single" collapsible className="w-[500px] max-w-full">

<AccordionItem value="item-1">
        <AccordionTrigger><p>Short Term Roadmap<span className='text-[0.65em] opacity-75'></span></p></AccordionTrigger>
        <AccordionContent>
          <ul className=' list-disc list-inside  gap-1 flex flex-col'>
            <h3 className='text-violet-300'>Duel System</h3>
            <ul className='pl-2 list-disc list-inside'>
              <li>Fully Functional basic 1v1 duel words game.</li>
            </ul>
            <h3 className='text-violet-300'>Landing Page</h3>
            <ul className='pl-2 list-disc list-inside'>
              <li>A real landing page with content and updates will move to deticated page</li>
            </ul>
            <h3 className='text-violet-300'>UI</h3>
            <ul className='pl-2 list-disc list-inside'>
              <li>Overall UI update and animations to feel more alive.</li>
            </ul>

          
          </ul>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-2">
        <AccordionTrigger className='text-orange-400'><p>Update 1.0.2 <span className='text-[0.65em] opacity-75'>10/3/2023</span></p></AccordionTrigger>
        <AccordionContent>
          <ul className=' list-disc list-inside gap-1 flex flex-col'>
            <h3 className='text-violet-300'>Suggest System</h3>
            <ul className='pl-2 list-disc list-inside'>
              <li>Admin Panel better UI and option to approve all words suggested at once.</li>
            </ul>
            <h3 className='text-violet-300'>Landing Page</h3>
            <ul className='pl-2 list-disc list-inside'>
              <li>Replaced landing page to display updates and previous updates.</li>
            </ul>
            <h3 className='text-violet-300'>SideBar</h3>
            <ul className='pl-2 list-disc list-inside'>
              <li>Fixed user points to be fixed one number after the dot.</li>
            </ul>
            <h3 className='text-violet-300'>Main Study</h3>
            <ul className='pl-2 list-disc list-inside'>
              <li>Slight animation change to word placeholder.</li>
            </ul>

          
          </ul>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-3">
        <AccordionTrigger><p> Update 1.0.1 <span className='text-[0.65em] opacity-75'>3/10/2023</span></p></AccordionTrigger>
        <AccordionContent>
          <ul className=' list-disc list-inside gap-1 flex flex-col'>
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
        </AccordionContent>
      </AccordionItem>
    </Accordion>

    <p>Currently there are over <span className='text-violet-400'>120</span> words.</p>




    </div>
  )
}
