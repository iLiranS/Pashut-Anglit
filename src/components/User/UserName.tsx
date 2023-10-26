'use client'

import useUserStore from "@/store/useUserStore";
import Link from "next/link";

const UserName = () => {
    const user = useUserStore(state => state.name);

    if (user.length<1){
        return(
            <Link className="inputStyle cursor-pointer" href="/auth/login">התחבר</Link>
        )
    }


    return (
        <p>{user}</p>
    )
}

export default UserName