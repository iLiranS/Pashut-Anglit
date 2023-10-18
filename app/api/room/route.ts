import { PrismaClient } from "@prisma/client";
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

            
            // push into new room
            const newRoom = await prisma.room.create({
                data:{
                    users:{
                        connect:{id:userId}
                    },
                    usersId:[userId],
                    words:{
                        connect:generatedWords
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

export async function DELETE(request:Request){
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    console.log('delete room called with id of ' + id);

    try{
        if (!id) throw new Error('missing game id');
        await prisma.room.delete({
        where:{
            id
        }
    })
    
    const winners = searchParams.getAll('winners'); // Get all values for the 'winners' parameter
    if (!winners) { console.log('game has been canceled');return NextResponse.json('game has been canceled');}
    console.log('room has been deleted with id of ' + id , 'total of'+winners.length +' winners');
    const scoreToAdd = winners.length > 1 ? 1 : 3; // 1 point for draw, 3 for a win.

    // for each user in winner id array
    for (const winnerId of winners){
        // find user first to get current score.
        const winnerUser = await prisma.user.findFirst({
            where:{
                id:winnerId
            }
        });
        if (!winnerUser) throw new Error(`couldn't find user`);
        // get current score.
        const currentScore = winnerUser.duelScore;
        // update new score
        await prisma.user.update({
            where:{
                id:winnerId
            },
            data:{
                duelScore:currentScore+scoreToAdd
            }
        })
    }
    return NextResponse.json('successfully ended match');
    }
    catch(err:any){
        return NextResponse.json(err.message || 'failed finalizing game',{status:500});
    }
}



export async function PUT(request:Request){
    console.log('update stage route called');

    try{

        const res = await request.json();
        const id:string = res.id;
    console.log('update stage called with id of ' + id);
    if (!id) return NextResponse.json('failed getting id',{status:404});
    await prisma.room.update({
        where:{
            id
        },
        data:{
            stage:1
        }
    })
    return NextResponse.json(true);
    }
    catch(err:any){
        return NextResponse.json('something went wrong',{status:500});
    }
}