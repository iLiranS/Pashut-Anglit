import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse , NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req, res })
    const session =  (await supabase.auth.getSession()).data.session;
    if(!session) return NextResponse.redirect(new URL('/no-access', req.url))
}

export const config = {
    matcher: ['/duel/:path*', '/suggest','/study'],
}