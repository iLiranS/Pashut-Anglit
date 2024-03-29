import Link from "next/link"
import React, { useEffect, useRef, useState } from "react";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from "@/components/ui/accordion"
import {FiSun,FiMoon} from 'react-icons/fi'
import { AiOutlineHome} from 'react-icons/ai'
import {HiOutlineBookOpen} from 'react-icons/hi'
import {BsLightbulb} from 'react-icons/bs'
import {LuSwords} from 'react-icons/lu'
import {LiaLanguageSolid} from 'react-icons/lia'
import {MdOutlineGames,MdUpdate} from 'react-icons/md'
import useThemeStore from '@/store/useThemeStore'
import useUserStore from "@/store/useUserStore";
import ExpProgress from "./ExpProgress";
import { toast } from "react-toastify";
import {  useRouter } from "next/navigation";
import { db } from "@/utils/db";
import { AiOutlineWarning } from "react-icons/ai";
let listener = false;

const Sidebar:React.FC<{isOpen:boolean,logOut:()=>void,closeSideBar:()=>void}> =({isOpen=true,logOut,closeSideBar})=> {
    const loadingToast = () => toast("Searching for a match...", { autoClose: false,closeButton:false,toastId:'matchLoading'});
    const notifyError= (msg:string) => toast.error(msg);
    const notifySuccess = (msg:string) => toast.success(msg);
    const router = useRouter();
    const themeStore =  useThemeStore();
    const userStore = useUserStore();
    const theme = themeStore.theme
    const navRef = useRef<HTMLDivElement>(null);
    const [isMatchLoading,setIsMatchLoading] = useState(false);

        const closeSideBarHandler = () => { closeSideBar();}

        const listenerHandler = (e:MouseEvent) =>{
            const sidebar = navRef.current;
            if(sidebar && !sidebar.contains(e.target as Node) &&
            !(e.target as HTMLElement)?.classList.contains('menuIcon')&&
            !(e.target instanceof(SVGElement))
            ){
                closeSideBarHandler();
            }
        }

        // toggle off nav if clicked outside and isOpen
        useEffect(()=>{
            if (listener) return;
            const sidebar = navRef.current;
            if (sidebar){
                // add listener and set to true
                document.addEventListener('click',listenerHandler);
                listener = true;
            }
            return()=>{
                document.removeEventListener('click',listenerHandler);
                listener = false;
            }
        },[navRef])


        const updateLoadingToast = (msg:string) =>{
            toast.update('matchLoading', {
                render: () => <div>{msg}</div>,
                type: toast.TYPE.INFO,
                autoClose: 5000
            });
        }

        // disabled for now.
        const duelSearchHandler = async() =>{
            if (isMatchLoading) return;
            setIsMatchLoading(true);
            
            try{
                loadingToast();
                if (userStore.id.length<2) {throw new Error('התחבר על מנת לשחק')};
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/room`,{
                    method:'POST',
                    body:JSON.stringify({userId:userStore.id}),
                    headers:{'Content-Type':'application/json'},
                    cache:'no-store'
            })
            const data = await response.json(); // room id or error message
            if (!response.ok) {updateLoadingToast('Failed entering a match'); throw new Error(data)};
            updateLoadingToast('✅ Redirecting to match');
            setTimeout(() => {
                toast.dismiss('matchLoading');
            }, 1000);
            router.push(`/duel/${data}`)
        }
        catch(err:any){
            updateLoadingToast(err.message || 'Error getting into a match');
        }
        setIsMatchLoading(false);
            }


            const resetProgressHandler = () =>{
                const answer = confirm('אישור פעולה זו תמחק את נתוני ההתקדמות שלך, האם להמשיך?');
                if (answer){
                    localStorage.removeItem('currentStreak');
                    localStorage.removeItem('lastAnswers');
                    db.words.clear();
                    db.doneWords.clear();
                    notifySuccess('נתוני ההתקדמות נמחקו');
                }
            }



    return ( 
        <div ref={navRef} className={`fixed top-0 left-0 h-[100dvh] w-56  transition-transform duration-200  px-2 py-4
        ${isOpen ? 'translate-x-0' :'-translate-x-full'} flex flex-col rounded-r-md
        bg-bgDark   text-textDark
        dark:bg-bg dark:text-text`}>
                <p className="opacity-75 self-end">שלום, {userStore.name.length>2?userStore.name:'אורח'}</p>


            <div dir="rtl" className="flex flex-col h-full justify-between text-lg">

                
                <Accordion type="single" collapsible className="w-full">

                    <AccordionItem value="item-1">
                        <AccordionTrigger>ראשי</AccordionTrigger>

                            <AccordionContent onClick={closeSideBarHandler} className="pr-2">
                                <Link href={'/'} className="hover:underline cursor-pointer flex items-center gap-1"> <AiOutlineHome/>דף הבית</Link>
                            </AccordionContent>

                            <AccordionContent onClick={closeSideBarHandler} className="pr-2">
                                <Link href={'/study'} className="hover:underline cursor-pointer flex items-center gap-1"><LiaLanguageSolid/>לימוד מילים</Link>
                            </AccordionContent>

                            <AccordionContent onClick={closeSideBarHandler} className="pr-2">
                                <Link className="hover:underline flex items-center gap-1" href={'/suggest'}><BsLightbulb/>הצע מילה</Link>
                            </AccordionContent>

                            <AccordionContent onClick={closeSideBarHandler} className="pr-2">
                                <Link className="hover:underline flex items-center gap-1" href={'/dictionary'}><HiOutlineBookOpen/>מילון</Link>
                            </AccordionContent>

                            <AccordionContent onClick={closeSideBarHandler} className="pr-2">
                                <Link className="hover:underline flex items-center gap-1" href={'/changelog'}><MdUpdate/>changelog</Link>
                            </AccordionContent>

                    </AccordionItem>

                    <AccordionItem value="item-2">
                        <AccordionTrigger>משחקים</AccordionTrigger>
                            <AccordionContent onClick={closeSideBarHandler} className="pr-2">
                                <p className={`hover:underline ${isMatchLoading ? 'cursor-not-allowed opacity-70' :'cursor-pointer'} flex items-center gap-1`} onClick={duelSearchHandler}><LuSwords/>דו קרב</p>
                            </AccordionContent>
                            <AccordionContent onClick={closeSideBarHandler} className="pr-2">
                            <Link className="hover:underline flex items-center gap-1" href={'/snake'}><MdOutlineGames/>סנייק</Link>
                            </AccordionContent>

                    </AccordionItem>
                    
                    {userStore.id.length>2 &&
                    <AccordionItem value="item-3">
                        <AccordionTrigger>חשבון</AccordionTrigger>
                            <AccordionContent onClick={closeSideBarHandler} className="pr-2">
                                <p className={`hover:underline ${isMatchLoading ? 'cursor-not-allowed opacity-70' :'cursor-not-allowed'} opacity-50`}>הגדרות חשבון </p>                                
                            </AccordionContent>
                            <AccordionContent onClick={resetProgressHandler} className="pr-2">
                                <li className="cursor-pointer flex items-center gap-1"><AiOutlineWarning className='text-red-600 '/><p className="hover:underline">איפוס התקדמות ומילון</p></li>                                
                            </AccordionContent>
                    </AccordionItem>
                    }

                </Accordion>



                <div className="flex flex-col gap-4 ">

                {userStore.id.length>1 &&<ExpProgress level={userStore.level} exp={userStore.exp}/>}
                <section  className="flex items-center justify-between  menuIcon">
                    <div  className={`cursor-pointer text-xl   select-none ${theme==='dark' ? 'rotate-0' : 'rotate-180'} transition-all duration-500`} onClick={()=>{themeStore.toggleTheme();}}>
                        {theme==='dark'?
                        <FiMoon className='animate-scaleUp'/>
                        :
                        <FiSun  className='animate-scaleUp'/>
                        }
                    </div>
                    {userStore.id.length>2?<p onClick={logOut} className="inputStyleReverse cursor-pointer">התנתק</p> : <Link href={'/auth/login'} className="inputStyleReverse">התחבר</Link>}
                    
                </section>
                </div>
            </div>
        
        </div>
    )
}
export default Sidebar;