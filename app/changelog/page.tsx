import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  import Link from "next/link"

  
const page = () => {
    return (

        <div className='relative  pt-8 grid place-items-center gap-4'>
        <li dir="rtl" className="flex items-center gap-1 justify-center text-xs"><p className="text-green-400 underline underline-offset-2">חדש</p> <p className="opacity-100">דו קרב עכשיו זמין</p></li>
        
        <Accordion type="single" collapsible className="w-[500px] max-w-[95vw] ">

        <AccordionItem  value="item-0">
                <AccordionTrigger><p>Update 1.0.7 <span className='text-sm  text-violet-500'>(current)</span> <span className='text-[0.65em] opacity-75'>26/10/2023</span></p></AccordionTrigger>
                <AccordionContent>
                  <ul className=' list-disc list-inside gap-1 flex flex-col'>
                    <h3 className='text-violet-500'>Snake Game 🐍 </h3>
                    <ul className='pl-2 list-disc list-inside'>
                      <li>smoother game experience with new movement method in mobile</li>
                    </ul>
                  
                    <h3 className='text-violet-500'>Main page</h3>
                    <ul className='pl-2 list-disc list-inside'>
                      <li>Created basic landing page</li>
                    </ul>

                    
                  
                  </ul>
                </AccordionContent>
              </AccordionItem>
        
        <AccordionItem  value="item-1">
                <AccordionTrigger><p>Update 1.0.6<span className='text-[0.65em] opacity-75'>20/10/2023</span></p></AccordionTrigger>
                <AccordionContent>
                  <ul className=' list-disc list-inside gap-1 flex flex-col'>
                    <h3 className='text-violet-500'>Snake Game 🐍 </h3>
                    <ul className='pl-2 list-disc list-inside'>
                      <li>Brand new game, A sanke game with a twist.</li>
                      <li>still not 100% done but pretty challenging.</li>
                    </ul>
                  
                    <h3 className='text-violet-500'>Main Study & Duel</h3>
                    <ul className='pl-2 list-disc list-inside'>
                      <li>Smoother animations</li>
                    </ul>
                  
                  </ul>
                </AccordionContent>
              </AccordionItem>
        
              <AccordionItem  value="item-2">
                <AccordionTrigger><p>Update 1.0.5  <span className='text-[0.65em] opacity-75'>18/10/2023</span></p></AccordionTrigger>
                <AccordionContent>
                  <ul className=' list-disc list-inside gap-1 flex flex-col'>
                    <h3 className='text-violet-500'>Duel Game</h3>
                    <ul className='pl-2 list-disc list-inside'>
                      <li>leave detection before starting a match will now delete room instance.</li>
                      <li>some code improvement</li>
                    </ul>
        
                    <h3 className='text-violet-500'>Main Study</h3>
                    <ul className='pl-2 list-disc list-inside gap-2 flex flex-col'>
                      <li>there is now an indicator that explains the learning system.</li>
                      <li>friendlier UI and animations - bigger text and answer animation changed.</li>
                    </ul>
        
                    
                    <h3 className='text-violet-500'>SideBar</h3>
                    <ul className='pl-2 list-disc list-inside gap-2 flex flex-col'>
                      <li>bigger text and added icons for each option.</li>
                    </ul>
        
                  
                  </ul>
                </AccordionContent>
              </AccordionItem>
        
              <AccordionItem  value="item-3">
                <AccordionTrigger><p>Update 1.0.4  <span className='text-[0.65em] opacity-75'>17/10/2023</span></p></AccordionTrigger>
                <AccordionContent>
                  <ul className=' list-disc list-inside gap-1 flex flex-col'>
                    <h3 className='text-violet-500'>Duel Game</h3>
                    <ul className='pl-2 list-disc list-inside'>
                      <li>Duel game first version is out</li>
                      <li>You can enter a match against a random person to compete in a quiz game with words and translates.</li>
                      <li>there mightt be alot of bugs 🐞 which I will work to solve later on.</li>
                      <li>In addition, each user has duel score which depends on match results.</li>
                    </ul>
        
                    <h3 className='text-violet-500'>Main Study</h3>
                    <ul className='pl-2 list-disc list-inside gap-2 flex flex-col'>
                      <li>made the level color visibility, it was hard to see in light mode.</li>
                    </ul>
        
                    
                    <h3 className='text-violet-500'>Suggest</h3>
                    <ul className='pl-2 list-disc list-inside gap-2 flex flex-col'>
                      <li>admin panel approve list improvement ui</li>
                    </ul>
        
                  
                  </ul>
                </AccordionContent>
              </AccordionItem>
        
        
        
              <AccordionItem  value="item-4">
                <AccordionTrigger><p>Update 1.0.3  <span className='text-[0.65em] opacity-75'>13/10/2023</span></p></AccordionTrigger>
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
        
              <AccordionItem value="item-5">
                <AccordionTrigger ><p>Update 1.0.2 <span className='text-[0.65em] opacity-75'>10/10/2023</span></p></AccordionTrigger>
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
        
              <AccordionItem value="item-6">
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
            <p className='opacity-75 text-sm text-center'>הערה: נתוני המילים שנלמדו לא מאוחסנים בענן לכן תלויים במכשיר</p>
            <p className='opacity-75 text-sm text-center'>לכן מומלץ להשתמש באותו המכשיר למשך הלמידה עד שתהיה אפשרות לשיתוף</p>
            <Link className="text-orange-400 hover:underline text-sm" href={'/study'}>לחץ כדי להתחיל ללמוד</Link>
            </section>
        
        
        
        
            </div>
          )
        }
        

export default page