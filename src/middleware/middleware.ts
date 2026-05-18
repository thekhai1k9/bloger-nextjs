// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        }
      }
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Nếu truy cập vào các route /admin mà chưa login -> sút về trang sign-in
  if (request.nextUrl.pathname.startsWith('/admin') && !user) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  // Client đã login thì check role in database
  if (request.nextUrl.pathname.startsWith('/admin') && user) {
    const { data: dbUser} = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    // If role not admin --> error
    if (!dbUser || dbUser.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }


  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}