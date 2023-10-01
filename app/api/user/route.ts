import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient()


// get user by id , safe data.
export async function GET(request:Request){
    const requestUrl = new URL(request.url);
    const id = requestUrl.searchParams.get('id');
    try{
        if (!id) throw new Error('no id given');
        const user = await prisma.user.findUnique({
            where:{
                id:id
            }
        });
        if (!user) throw new Error('no user found with given id');
        return NextResponse.json(user);

    }


    catch(err:any){
        return NextResponse.json(err.message || 'error',{status:500});
    }
}