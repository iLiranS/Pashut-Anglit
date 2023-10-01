import Header from '@/src/components/Header/Header'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import {Rubik} from 'next/font/google'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css';

export const dynamic = 'force-dynamic'

const inter = Inter({ subsets: ['latin'] })
const rubik = Rubik({subsets:['latin']})

export const metadata: Metadata = {
  title: 'פשוט אנגלית',
  description: 'ללמוד אנגלית בדרך טובה',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${rubik.className} bg-bg text-text h-[100dvh] w-screen dark:bg-bgDark dark:text-textDark relative`}>
        <Header/>
        <main>
        {children}
        <ToastContainer/>
        </main>
        </body>
    </html>
  )
}
