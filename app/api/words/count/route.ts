import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";


const prisma = new PrismaClient()


// get amount of words 
export async function GET(request:Request){
    try{
        const count = await prisma.word.count();
        return NextResponse.json(count);
    }
    catch(err:any){
        return NextResponse.json(err.message || 'cant get words count',{status:500});
    }
}