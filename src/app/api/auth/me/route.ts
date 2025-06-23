import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

const TOKEN_COOKIE = 'auth_token'

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(TOKEN_COOKIE)?.value
    if (!token) {
      return NextResponse.json({ error: 'No autorizado: Sin token' }, { status: 401 })
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET ?? 'clave-secreta-por-defecto'
    )

    return NextResponse.json({ ok: true, user: decoded })
  } catch (error) {
    return NextResponse.json({ error: 'Token inválido o expirado' }, { status: 401 })
  }
}