import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import WordCount from "@/src/components/Home/WordCount"
import Link from "next/link"
import { Suspense } from "react"




export default  function Home() {

  return (

<div className='relative py-6 grid place-items-center gap-4 w-[100vw]'>

<Accordion type="single" collapsible className="w-[500px] max-w-[95vw]">

<AccordionItem value="item-0">
        <AccordionTrigger><p>To Do<span className='text-[0.65em] opacity-75'></span></p></AccordionTrigger>
        <AccordionContent>
          <ul className=' list-disc list-inside  gap-1 flex flex-col'>
            <h3 className='text-violet-500'>Duel System</h3>
            <ul className='pl-2 list-disc list-inside'>
              <li className='flex items-center gap-2'> <p className='text-orange-400 text-xs w-max'>on hold</p>  Fully Functional basic 1v1 duel words game.</li>
            </ul>
            <h3 className='text-violet-500'>Landing Page</h3>
            <ul className='pl-2 list-disc list-inside'>
              <li>A real landing page with content and updates will move to deticated page</li>
            </ul>
            <h3 className='text-violet-500'>UI</h3>
            <ul className='pl-2 list-disc list-inside'>
              <li>Overall UI update and animations to feel more alive.</li>
            </ul>
            <h3 className='text-violet-500'>Data</h3>
            <ul className='pl-2 list-disc list-inside'>
              <li className='flex items-center gap-2'> <p className='text-green-500 text-xs w-max'>passive</p> Add more words</li>
              <li>Cross platform/device dictionary - might be premium</li>
            </ul>
            <h3 className='text-violet-500'>User</h3>
            <ul className='pl-2 list-disc list-inside'>
              <li>Option to update password / username</li>
            </ul>

          
          </ul>
        </AccordionContent>
      </AccordionItem>


      <AccordionItem  value="item-1">
        <AccordionTrigger><p>Update 1.0.3 <span className='text-sm  text-violet-500'>(current)</span> <span className='text-[0.65em] opacity-75'>13/3/2023</span></p></AccordionTrigger>
        <AccordionContent>
          <ul className=' list-disc list-inside gap-1 flex flex-col'>
            <h3 className='text-violet-500'>Dictionary</h3>
            <ul className='pl-2 list-disc list-inside'>
              <li>Fixed to not care about lower/upper case of search value</li>
            </ul>
            <h3 className='text-violet-500'>Main Study</h3>
            <ul className='pl-2 list-disc list-inside gap-2 flex flex-col'>
              <li>
                Changed how the main study works :
                <p className='my-2'>Now you have to answer a certain word 3 times correctly in order to {`"learn"`} this word.</p>
                <p>only words which the user answered correctly 3 times will be added to dictionary and might show up again only upon old words revisits.</p>
              </li>
              <li>System of which words that have been displayed in the last 10 {`"rounds"`}  wont be able to show again until at least 10 {`"rounds"`} have been passed.</li>
              <li>bug fix of edge case that caused the possibility of the same transalte to show twice.</li>
            </ul>

          
          </ul>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-2">
        <AccordionTrigger ><p>Update 1.0.2 <span className='text-[0.65em] opacity-75'>10/3/2023</span></p></AccordionTrigger>
        <AccordionContent>
          <ul className=' list-disc list-inside gap-1 flex flex-col'>
            <h3 className='text-violet-500'>Suggest System</h3>
            <ul className='pl-2 list-disc list-inside'>
              <li>Admin Panel better UI and option to approve all words suggested at once.</li>
            </ul>
            <h3 className='text-violet-500'>Landing Page</h3>
            <ul className='pl-2 list-disc list-inside'>
              <li>Replaced landing page to display updates and previous updates.</li>
            </ul>
            <h3 className='text-violet-500'>SideBar</h3>
            <ul className='pl-2 list-disc list-inside'>
              <li>Fixed user points to be fixed one number after the dot.</li>
            </ul>
            <h3 className='text-violet-500'>Main Study</h3>
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
            <h3 className='text-violet-500'>Dictionary</h3>
            <ul className='pl-2 list-disc list-inside'>
              <li>Dictionary UX fixes.</li>
            </ul>
            <h3 className='text-violet-500'>Main Study</h3>
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

    <section className="flex flex-col text-center">
      <Suspense fallback={<p>Currently there are <span className='text-violet-400 animate-pulse'>._.</span> words.</p>}>
        <WordCount/>
      </Suspense>
    <p className='opacity-75 text-sm text-center'>הערה: נתוני המילים שנלמדו לא מאוחסנים בענן לכן תלויים במכשיר</p>
    <p className='opacity-75 text-sm text-center'>לכן מומלץ להשתמש באותו המכשיר למשך הלמידה עד שתהיה אפשרות לשיתוף</p>
    <Link className="text-orange-400 hover:underline text-sm" href={'/study'}>לחץ כדי להתחיל ללמוד</Link>
    </section>




    </div>
  )
}
