import { Suspense } from "react"
import WordCount from "@/src/components/Home/WordCount"
import UserName from "@/src/components/User/UserName"
import Link from "next/link"
import {LuSwords} from 'react-icons/lu'
import {MdOutlineGames} from 'react-icons/md'
import { HiOutlineBookOpen } from "react-icons/hi"
import { LiaLanguageSolid } from "react-icons/lia"
import StudyIllustration from "@/src/components/Home/Illustration"



export default  function Home() {
  return(
    <div className="min-h-[100dvh] overflow-x-hidden w-screen relative py-2 px-2 md:py-8 md:px-4 flex flex-col gap-4">

      <section className="grid grid-cols-1 lg:grid-cols-[max-content,1fr] w-full justify-between">
          <div className="hidden lg:block w-full">
            {/* img in here */}
            <StudyIllustration className='scale-50  lg:scale-75'/>
          </div>

          <div className="flex flex-col w-full ">
              <div className="flex items-center gap-1 w-full justify-end"> <UserName/> <p>,שלום</p> </div>
            <section className="w-fit relative self-end flex flex-col gap-3 pt-8">
              <h2 className="text-4xl font-bold  text-end">ללמוד אנגלית בדרך <span className="text-violet-500">מהנה</span></h2>
              <p dir="rtl" className="text-base opacity-80 font-bold">הרחב את אוצר המילים באמצעות משחקים ודרכים שונים</p>
              <p dir="rtl" className="text-base opacity-80 font-bold">תענה נכון על מנת לעלות רמות ולהיתקל במילים אפילו קשות יותר!</p>
              <p dir="rtl" className="text-base font-bold">איך זה עובד?</p>
              <ul dir="rtl" className="flex flex-col list-disc list-inside">
                <li>נרשמים לאתר ומתחילים מהרמה הראשונה</li>
                <li>מתחילים לענות נכון במערכת הלימוד</li>
                <li>עולים רמות ונפתחות רמות חדשות וקשות יותר של מילים</li>
              </ul>
            </section>
          </div>
      </section>

    <div className="flex flex-col gap-1 w-full md:w-fit mx-auto">
      <h2 dir="rtl" className="text-base opacity-80 font-bold md:pr-1">חלק ממה שהאתר מציע:</h2>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(192px,max-content))] md:grid-cols-4  gap-4 w-full justify-center">
        <SingleGrid icon={<HiOutlineBookOpen/>} name="מילון" desc="צפה במילים שכבר למדת" link="/dictionary"/>
        <SingleGrid icon={<MdOutlineGames/>} name="סנייק" desc="המשחק הידוע אבל עם טוויסט" link="/snake"/>
        <SingleGrid icon={<LuSwords/>} name="דו קרב" desc="חידון מילים באנגלית" link="/duel"/>
        <SingleGrid icon={<LiaLanguageSolid/>} name="מערכת לימוד" desc="למד מילים חדשות על פי רמתך" link="/study"/>
      </div>
    </div>
    
    <div className="text-center md:absolute md:bottom-4 md:left-1/2 md:-translate-x-1/2">
    <Suspense fallback={<p className="opacity-90">Currently there are <span className='text-violet-400 animate-pulse'>...</span> words.</p>}>
      <WordCount/>
    </Suspense>
    </div>

    </div>
  )
}

const SingleGrid:React.FC<{name:string,desc:string,link:string,icon:React.ReactNode}> = ({name,desc,link,icon}) =>{

  return(
    <Link  href={link} className="flex flex-col gap-1 inputStyle p-2 w-48">
      <section className="justify-between flex items-center"> {icon} <p>{name}</p></section>
      <p dir="rtl" className="opacity-80 text-sm truncate">{desc}</p>
    </Link>
  )
}

 