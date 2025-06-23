// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // libera API, internals, estáticos y videos
  const isPublicAsset =
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.match(/\.(css|js|png|jpe?g|gif|svg|ico|mp4)$/i)   // ← añadimos mp4

  if (isPublicAsset) return NextResponse.next()

  // … resto de la lógica de auth sin cambios …
}

export const config = { matcher: ['/(.*)'] }