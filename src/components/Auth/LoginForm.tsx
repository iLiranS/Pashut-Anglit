'use client'
import React, { FormEvent, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import PasswordValidator from 'password-validator';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import useUserStore from '@/store/useUserStore';
import LoginOAuth from './LoginOAuth';

const nameFromEmail = (email:string) =>{
  return email.split('@')[0];
}


const LoginForm = () => {
    const notifySuccess = (msg:string) => toast.success(msg);
    const router = useRouter();
    const notifyError = (err:string) => toast.error(err);
    const supabase = createClientComponentClient();
    const userStore = useUserStore();

    const {register,handleSubmit} = useForm();
    const [isLogin,setIsLogin] = useState(true);
    const [isLoading,setIsLoading] = useState(false);
    const [error,setError] = useState<boolean|string>(false);
    let schema = new PasswordValidator();
    schema.is().min(8).is().max(100).has().uppercase().has().lowercase().has().digits(1).has().not().spaces();
        // 8-100 , upper , lower , number . no spaces allowed


        // oauth check in user in database. for some reason redirect cause problems. maybe cookies not arrived yet.
      






    const loginEmailHandler = async(email:string,password:string)=>{
      try{
        const result = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if(!result.data.session) throw new Error(result.error?.message || 'ההתחברות נכשלה');
        // success , return
        return true;
        
      }
      catch(err:any){
        return err.message;
      }
    }
    const signUpEmailHandler =async (email:string,password:string) => {
      const result = await supabase.auth.signUp({
          email,
          password,
          options:{
              emailRedirectTo:`${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`
          }
      })
      // if success
      if (result.data.session) 
      {
        // success, return true and try to checkIn to db.
        const user = result.data.session.user;
        return true;
      }
      // failed to register
      return result.error?.message || 'ההרשמה נכשלה';
  }



    const onSubmit = async(d:any) => {
      // clean check
      const cleanEmail = (d.email);
      const cleanPassword = (d.password);
      if (cleanEmail !== d.email || cleanPassword!=d.password){
        // not clean text
        notifyError('password or email are not valid!');
        return;
      }
      try{

        if (isLoading) return;
        setIsLoading(true);
        
        // login
        if (isLogin){
        if (d.email.trim().length >0 && d.password.trim().length >0){
          // login attempt
          const result = await loginEmailHandler(d.email,d.password);
          // login sucess
          if (result===true){
            notifySuccess('התחברת בהצלחה');
            //
            router.push('/');
          }
          // login failed
          else throw new Error(result);
        }
      }
      // sign up
      else{
        if (d.password === d.password_verify){
          // verify schema
          if(schema.validate(d.password)){
            // sign up valid
            setError(false);
            // sign up attempt
            const result = await signUpEmailHandler(d.email,d.password);
            // sign up success
            if (result === true) notifySuccess('נרשמת בהצלחה!, בדוק אימייל לאישור');
            // sign up failed
            else throw new Error(result);
          }
          else{
            setError('סיסמה צריכה להיות בין 8 ל100 ספרות ולהכיל  אות גדולה וקטנה')
          }
        } 
        else{
          // not matching
          setError('סיסמאות לא תואמות');
        }
      }
      
      setIsLoading(false);
    }
    catch(err:any){
      notifyError(err.message);
      setIsLoading(false);
    }
    }






  return (
    <form  onSubmit={handleSubmit(onSubmit)} className='w-fit mx-auto relative py-4 grid place-items-center gap-4'>
            <h2 className='h2 underline'>{isLogin ? 'התחברות' : 'הרשמה'}</h2>
            <label>
              <p className='text-end'>אימייל</p>
              <input {...register("email")} placeholder='example@email.com' type='email' className='inputStyle'/>
            </label>

            <label>
              <p className='text-end'>סיסמה</p>
              <input {...register("password")} placeholder='*********' type='password' className='inputStyle'/>
            </label>

            {!isLogin &&
            <label>
              <p className='text-end'>אישור סיסמה</p>
              <input {...register("password_verify")} placeholder='*********' type='password' className='inputStyle'/>
            </label>
            }

            <p onClick={()=>{setIsLogin(prev=>!prev)}} className='text-sm opacity-75 cursor-pointer'>{isLogin? 'אין משתמש ? לחץ להרשמה' : 'כבר יש לך משתמש? התחבר'}</p>
            {error && <p className='text-sm text-red-500'>{error}</p>}

            <button disabled={isLoading} className='inputStyle disabled:cursor-not-allowed disabled:opacity-70 flex items-center gap-1'>
              {isLoading &&  <p className=' animate-spin'><AiOutlineLoading3Quarters/></p>}
              <p className='p-1'>{isLogin ? 'התחבר' : 'הירשם'}</p>
            </button>
          
          <section className='flex flex-col items-center w-full'>
            <div className='relative w-full justify-center flex'>
            <p className='w-fit bg-bg dark:bg-bgDark px-2'>התחבר באמצעות</p>
            <section className='w-full h-[2px] bg-bgDark/20 dark:bg-bg/20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10'/>
            </div>

            <LoginOAuth/>

          </section>



        </form>
  )
}

export default LoginForm