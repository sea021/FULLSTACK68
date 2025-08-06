import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value
  const url = req.nextUrl.pathname

  const isProtectedRoute = url.startsWith('/dashboard')
  const isAuthPage = url === '/login' || url === '/register'

  const secret = new TextEncoder().encode(process.env.JWT_KEY)

  if (token) {
    try {
      // verify token และดึง payload
      const { payload } = await jwtVerify(token, secret)

      // ตรวจสอบ role จาก payload (สมมติชื่อ key ว่า role)
      const userRole = payload.role as string | undefined

      // ถ้า user เข้า /dashboard แต่ role ไม่ใช่ admin ให้รีไดเรกต์ไปหน้าอื่น (เช่น /)
      if (isProtectedRoute && userRole !== 'admin') {
        return NextResponse.redirect(new URL('/', req.url))
      }

      // ถ้าเป็นหน้าล็อกอิน/สมัคร แล้วล็อกอินแล้ว ให้รีไดเรกต์ไป dashboard
      if (isAuthPage) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }

      return NextResponse.next()
    } catch (err) {
      console.error('Token verification failed:', err)

      if (isProtectedRoute) {
        return NextResponse.redirect(new URL('/login', req.url))
      }

      return NextResponse.next()
    }
  } else {
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    '/dashboard',
    '/login',
    '/register',
  ],
}
