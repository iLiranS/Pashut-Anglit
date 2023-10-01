import LoginForm from '@/src/components/Auth/LoginForm'
import { Metadata } from 'next'


export const metadata: Metadata = {
    title: 'פשוט אנגלית - רישום',
    description: 'הכנס למערכת',
}

const page = () => {


    return (
        <LoginForm/>
    )
}

export default page