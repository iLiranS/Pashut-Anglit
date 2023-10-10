import { PrismaClient, Word, wordLevel } from "@prisma/client";
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

export async function POST(request:Request) {
    // posting words to words. called from suggested word admin panel only.
    try{

        const res = await request.json();
        const words = res as Word[];

        await prisma.word.createMany({
            data:words
        })
        return NextResponse.json('successfully added words');
    }
    catch(err:any){
        return NextResponse.json(err.message ?? 'error posting words',{status:500})
    }

    // no need to check if exists, happend in suggest already
    
}


export async function DELETE(request:Request) {
    // remove all suggested words , after accepting all.
    try{
        await prisma.suggestedWord.deleteMany({});
        return NextResponse.json('success');
    }
    catch(err:any){
        return NextResponse.json(err.message || 'error' ,{status:500})
    }
    
}