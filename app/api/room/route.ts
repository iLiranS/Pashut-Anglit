import { PrismaClient, wordLevel } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient()
export const revalidate = 0;

//TODO: generate words algorithm , look into random prisma attribute.
// maybe don't add 5 ,5 ,5 ,5 but let it be random.



export async function POST(request:Request){
    try{
        const res = await request.json();
        const userId:string = res.userId;
        console.log('Room Creating or searching with id of' + userId)
        if (!userId) throw new Error('no user id given');        
        // find the room with the least users in it. if exists and count is 2...
        const room = await prisma.room.findFirst({
            orderBy:{
                users:{
                    _count:'asc'
                }
            },
            include:{
                users:true
            }
        })
        if (!room || room.users.length>1){
            console.log('no available room found!')
            // there is no valid room to enter , create a new room
            //  generate words.
            const wordsCount = await prisma.word.count();
            if (wordsCount < 20) throw new Error('20 words needed in db for generating');
            const randomIndexes:number[] = [];
            while (randomIndexes.length<21){
                const rnd = Math.floor(Math.random()*wordsCount);
                if (!randomIndexes.includes(rnd)) randomIndexes.push(rnd);
            }
            // get words by id which is indexes. [word id's are 0-infintie]
            const generatedWords = await prisma.word.findMany({
                where:{
                    id:{in:randomIndexes}
                }
            });
            //order by level
            // generatedWords.sort()
            const levelOrder:wordLevel[] = ["easy", "medium", "hard", "impossible"];
            const sortedWords = generatedWords.sort((a,b)=>{
                const levelA = levelOrder.indexOf(a.level);
                const levelB = levelOrder.indexOf(b.level);
                return levelA - levelB
            })
            
            // push into new room
            const newRoom = await prisma.room.create({
                data:{
                    users:{
                        connect:{id:userId}
                    },
                    usersId:[userId],
                    words:{
                        connect:sortedWords
                    }
                }
            })
            return NextResponse.json(newRoom.id);
        }
        else{
            // found a valid room
            // validate if not same person
            if (room.usersId[0]===userId){
                throw new Error('player already in game');
            }
            const updateRoom = await prisma.room.update({
                where:{
                    id:room.id
                },
                data:{
                    users:{
                        connect:[
                            {id:room.users[0].id},
                            {id:userId}
                        ]
                    },
                    usersId:[room.usersId[0],userId]
                }
            })
            return NextResponse.json(updateRoom.id);
        }
    }
    
    catch(err:any){
        console.log(err);
        return NextResponse.json(err.message || 'error entering a duel match',{status:500})
    }
}

export async function GET(request:Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userid');
    try{
        if(!id || !userId) throw new Error('missing id');
        const room = await prisma.room.findUnique({
            where:{
                id:id
            },
            include:{
                users:true,
                words:true
            }
        })
        if (!room){
            console.log('no room found');
            throw new Error('failed finding match');
        }
        if (!room.usersId.includes(userId)) {
            console.log('user not in match');
            throw new Error('UnAuthorized')
        }
        return NextResponse.json(room);
    }
    catch(err:any){
        return NextResponse.json(err.message || 'error',{status:401});
    }
}