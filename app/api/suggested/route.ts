import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

const prisma = new PrismaClient()


export async function GET(request:Request){
    try{
        // check if admin indeed.
        const supabase = createRouteHandlerClient({cookies});
        const userId = (await supabase.auth.getUser()).data.user?.id;
        if (!userId || userId !== process.env.ADMIN_ID) throw new Error('Unauthorized');
        //  get skip value.
        const reqUrl = new URL(request.url);
        const skip = parseInt( reqUrl.searchParams.get('skip') as string); // convert string to number.
        // look for words
        const suggestedWords = await prisma.suggestedWord.findMany({
            take:20,
            skip:skip
        })
        // e.g -> skip 3 = start with the 4th.
        if (!suggestedWords) throw new Error('failed geting words');
        // if length 0 meaning no more words found. I think.
        if (suggestedWords.length ===0) throw new Error('empty');
        // ^^ might accure when no words left for suggested or any other error.
        return NextResponse.json({words:suggestedWords,skip:20+skip});
    }
    catch(err:any){
        return NextResponse.json(err.message ?? 'failed fetching suggested words',{status:401});
    }
}

export async function POST(request:Request){
    try{

        const res = await request.json();
        const {word,translate,wordLevel} = res;
        if (!word || !translate || !wordLevel) throw new Error('missing parameters');

        // check sanitize first
        const clearWord = word;
        const clearTranslate = translate;
        if (clearTranslate !== translate || word !==clearWord) throw new Error('Sanitize failed');

        // check if exists in suggested already
        const wordSuggestedExists = await prisma.suggestedWord.findFirst(
            {
            where:
            {
                word
            }
            }
        );
        if (wordSuggestedExists) throw new Error('word already suggested!');

        // check if exists in total words already
        const wordExists = await prisma.word.findFirst(
            {
                where:
                {
                    word
                }
            });
        if (wordExists) throw new Error('word already exists!');

        // word doesn't exists, create it.
        await prisma.suggestedWord.create({
            data:
            {
                word,
                translate,
                wordLevel

            }
        })
        // return valid response
        return NextResponse.json('success',{status:200});

    }



    catch(err:any){
        return NextResponse.json(err.message ?? 'error',{status:500})
    }
}



export async function DELETE(request:Request) {
    // remove suggested word by it's id. gained by url of the request.
    try{

        const requestURL = new URL(request.url);
        const id = parseInt(requestURL.searchParams.get('id') as string);
        if (!id) throw new Error('no id');
        await prisma.suggestedWord.delete({
            where:{
                id
            }
        })
        return NextResponse.json('success');
    }
    catch(err:any){
        return NextResponse.json(err.message || 'error' ,{status:500})
    }
    
}