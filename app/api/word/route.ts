import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient()

export async function POST(request:Request) {
    // posting word to words. called from suggested word admin panel only.
    try{

        const res = await request.json();
        const {word,translate,wordLevel} = res;

        await prisma.word.create({
            data:{
                word,
                translate,
                level:wordLevel
            }
        })
        return NextResponse.json('success');
    }
    catch(err:any){
        return NextResponse.json(err.message ?? 'error posting word',{status:500})
    }

    // no need to check if exists, happend in suggest already
    

    
}