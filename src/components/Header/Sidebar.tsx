import Link from "next/link"
import React, { useEffect, useRef, useState } from "react";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from "@/components/ui/accordion"
import {FiSun,FiMoon} from 'react-icons/fi'
import useThemeStore from '@/store/useThemeStore'
import useUserStore from "@/store/useUserStore";
import ExpProgress from "./ExpProgress";
import { toast } from "react-toastify";
import {  useRouter } from "next/navigation";
let listener = false;

const Sidebar:React.FC<{isOpen:boolean,logOut:()=>void,closeSideBar:()=>void}> =({isOpen=true,logOut,closeSideBar})=> {
    const loadingToast = () => toast("Searching for a match...", { autoClose: false,closeButton:false,toastId:'matchLoading'});
    const notifyError= (msg:string) => toast.error(msg);
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

        const duelSearchHandler = async() =>{
            return;
            if (isMatchLoading) return;
            loadingToast();
            setIsMatchLoading(true);
            if (userStore.id.length<2) {throw new Error('Login to play!')};
            try{
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/room`,{
                    method:'POST',
                    body:JSON.stringify({userId:userStore.id}),
                    headers:{'Content-Type':'application/json'},
                    cache:'no-store'
            })
            const data = await response.json(); // room id or error message
            if (!response.ok) {updateLoadingToast('Failed entering a match'); throw new Error(data)};
            updateLoadingToast('✅ Redirecting to match');
            router.push(`/duel/${data}`)
        }
        catch(err:any){
            updateLoadingToast(err.message || 'Error getting into a match');
        }
        setIsMatchLoading(false);
            }



    return ( 
        <div ref={navRef} className={`fixed top-0 left-0 h-[100dvh] w-56  transition-transform duration-200  px-2 py-4
        ${isOpen ? 'translate-x-0' :'-translate-x-full'} flex flex-col rounded-r-md
        bg-bgDark   text-textDark
        dark:bg-bg dark:text-text`}>
                <p className="text-sm opacity-75 self-end">שלום, {userStore.name.length>2?userStore.name:'אורח'}</p>

        
    


            <div dir="rtl" className="flex flex-col h-full justify-between">
                
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>למידה</AccordionTrigger>
                            <AccordionContent onClick={closeSideBarHandler} className="pr-2">
                                <Link href={'/study'} className="hover:underline cursor-pointer">לימוד מילים</Link>
                            </AccordionContent>
                            <AccordionContent onClick={closeSideBarHandler} className="pr-2">
                                <Link className="hover:underline" href={'/suggest'}>הצע מילה</Link>
                            </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                        <AccordionTrigger>משחקים</AccordionTrigger>
                            <AccordionContent onClick={closeSideBarHandler} className="pr-2">
                                <p className={`hover:underline ${isMatchLoading ? 'cursor-not-allowed opacity-70' :'cursor-not-allowed'} opacity-50`} onClick={duelSearchHandler}>דו קרב-coming soon</p>
                            </AccordionContent>
                            <AccordionContent onClick={closeSideBarHandler} className="pr-2">
                                <p className=" opacity-50 cursor-not-allowed">coming soon</p>
                            </AccordionContent>

                    </AccordionItem>

                    <AccordionItem value="item-3">
                        <AccordionTrigger>חשבון</AccordionTrigger>
                            <AccordionContent onClick={closeSideBarHandler} className="pr-2">
                                איפוס סיסמה
                            </AccordionContent>
                            <AccordionContent onClick={closeSideBarHandler} className="pr-2">
                                שינוי שם
                            </AccordionContent>
                            <AccordionContent onClick={closeSideBarHandler} className="pr-2">
                                
                            </AccordionContent>
                    </AccordionItem>

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