import { PrismaClient, wordLevel } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient()
export const revalidate = 0;
// should be called once a level change or initial rookie player.
export async function GET(request:Request){
    console.log('Words generation route called')
    try{

        const requestURL = new URL(request.url);
        const levels = (requestURL.searchParams.getAll('levels')) as wordLevel[]; // e.g ['easy','medium]
        console.log(levels);
        
        const words = await prisma.word.findMany({
            where:{
                level:{
                    in:levels
                },
                
            }
        })
        if (!words) throw new Error('No words found')
        const mappedWords = words.map(word =>({word:word.word,translate:word.translate,level:word.level}))
        return NextResponse.json(mappedWords);
    }
    catch(err:any){
        return NextResponse.json(err.message || 'error',{status:500});
    }
}