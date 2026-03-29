
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export async function proxy(req: NextRequest) {
    const token = req.cookies.get("token")?.value
    const pathname = req.nextUrl.pathname

    if( !token && pathname !== "/" ) {     
        return NextResponse.redirect(new URL('/', req.url))
    }

    if( token && pathname === "/" ) {
        return NextResponse.redirect(new URL('/home', req.url))
    }
}
 
// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }
 
export const config = {
  matcher: ['/','/home/:path*', '/group/:path*'],
}