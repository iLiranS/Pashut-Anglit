import { updatedUserStats } from "@/utils/functions";
import { PrismaClient, userLevel } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PUT(request:Request){
    try{

        const requestUrl = new URL(request.url);
        const id = requestUrl.searchParams.get('id');
        const exp = requestUrl.searchParams.get('exp');

        if (!id || !exp) throw new Error('no id or exp given');
        const user = await prisma.user.findUnique({where:{id}});
        if (!user) throw new Error('no user found');
        const numExp = parseInt(exp);
        const updatedData = updatedUserStats(user.level,numExp,user.exp);
        
        await prisma.user.update({
            where:{
                id
            },
            data:{
                exp:updatedData.updatedExp,
                level:updatedData.updatedLevel
            }
        })
        return NextResponse.json('successfully updated')
    }
    catch(err:any){
        return NextResponse.json(err.message || 'error updating db exp',{status:500});
    }
}
