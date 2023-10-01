
import { PrismaClient } from "@prisma/client";
import {  createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const prisma = new PrismaClient()
const nameFromEmail = (email:string) =>{
    return email.split('@')[0];
}



export async function GET(request:Request) {
    console.log('oauth callback called');
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    if(!code) return;
    // need to get user from cookies.
    try{
        const supabase = createRouteHandlerClient({cookies});
        const user = (await supabase.auth.exchangeCodeForSession(code)).data.user;

        // check if exists
        if (!user) throw new Error('failed getting user');
        // name handler , preferred or from email or guest.
        let name =  user.user_metadata.preferred_username || user.user_metadata.user_name ;
        if(!name) name = user.email ? nameFromEmail(user.email as string) : 'Guest';
        console.log(name);
        // search if user already exists in db
            const userCount = await prisma.user.count({
                where:{
                    id:user.id
                }
            });
            if (userCount===0){
                // user doesn't exist in database
                // add new user to db
                const result = await prisma.user.create({
                    data:{
                    id:user.id,
                    name,
                    level:'Rookie'
                    }
                });
                console.log('successfully added user to db')
                return NextResponse.redirect(requestUrl.origin);
            }
            else{
                // user alreadt exists in db
                throw new Error('user already exists in db, no need to add again.');
            }

    }
    catch(err:any){
        console.log(err.message || 'error in oauth callback');
        return NextResponse.redirect(requestUrl.origin);
    }
    
}
