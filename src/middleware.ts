// src/middleware.ts

import { NextRequest, NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'

// Rutas públicas que no necesitan sesión
const PUBLIC_PATHS = ['/login', '/api/auth']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get('auth_token')?.value

  // Si es un asset, deja pasar (ej: favicon, _next, static, etc.)
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg')
  ) {
    return NextResponse.next()
  }

  // ✅ Usuario ya logueado → lo redirigimos si intenta ir a /login
  if (pathname === '/login' && token) {
    try {
      verify(token, process.env.JWT_SECRET ?? 'clave-secreta-por-defecto')
      return NextResponse.redirect(new URL('/dashboard', req.url))
    } catch {
      // Token inválido, lo dejamos ir a login
      return NextResponse.next()
    }
  }

  // 🔒 Usuario no logueado → si intenta ir a rutas privadas, lo mandamos a login
  if (!token && !PUBLIC_PATHS.some((publicPath) => pathname.startsWith(publicPath))) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/dashboard', '/login', '/api/:path*'],
}