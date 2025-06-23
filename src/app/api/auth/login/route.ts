// src/app/api/auth/login/route.ts

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'
import { getClient } from '@/lib/db'
import type { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  console.log('\n--- [API Login] Petición POST recibida ---')

  try {
    const body = await req.json()
    const { email, password } = body
    console.log('[API Login] Body recibido:', { email })

    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contraseña requeridos' }, { status: 400 })
    }

    const client = await getClient()
    console.log('[API Login] Conexión obtenida')

    const { rows } = await client.query(
      'SELECT id, email, nombre, password FROM usuarios WHERE email = $1',
      [email]
    )

    console.log(`[API Login] Usuarios encontrados: ${rows.length}`)

    const user = rows[0]
    if (!user) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
    }

    const passwordValida = await bcrypt.compare(password, user.password)
    if (!passwordValida) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
    }

    console.log('✅ [API Login] Contraseña válida. Generando token...')
    const token = jwt.sign(
      { id: user.id, email: user.email, nombre: user.nombre },
      process.env.JWT_SECRET ?? 'clave-secreta-por-defecto',
      { expiresIn: '1d' }
    )

    console.log('[API Login] Token generado. Seteando cookie...')

    const res = NextResponse.json({
      ok: true,
      user: { id: user.id, email: user.email, nombre: user.nombre },
    })

    res.cookies.set({
      name: 'auth_token',
      value: token,
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24,
    })

    console.log('✅ [API Login] Cookie seteada. Enviando respuesta...')
    return res
  } catch (error) {
    console.error('❌ [API Login] ERROR:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}