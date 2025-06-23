// app/api/auth/login/route.ts (Versión para Depuración)

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

import { getClient } from '@/lib/db';

export async function POST(req: Request) {
  console.log('\n--- [API Login] Petición POST recibida ---');
  try {
    const body = await req.json();
    console.log('[API Login] Body recibido:', body);
    const { email, password } = body;
    
    if (!email || !password) {
      console.error('❌ [API Login] Error: Faltan email o contraseña.');
      return NextResponse.json({ error: 'Email y contraseña son requeridos' }, { status: 400 });
    }

    const client = await getClient();
    console.log('[API Login] Conexión a la base de datos obtenida.');
    
    try {
      const { rows } = await client.query(
        'SELECT id, email, nombre, password FROM usuarios WHERE email = $1',
        [email]
      );
      console.log(`[API Login] Query ejecutada. Se encontraron ${rows.length} usuarios.`);
      
      const user = rows[0];
      if (!user) {
        console.warn('❌ [API Login] Usuario no encontrado en la base de datos.');
        return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
      }

      console.log('[API Login] Usuario encontrado. Comparando contraseñas...');
      const passwordIsValid = await bcrypt.compare(password, user.password);
      
      if (!passwordIsValid) {
        console.warn('❌ [API Login] La contraseña es incorrecta.');
        return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
      }

      console.log('✅ [API Login] Contraseña válida. Creando token JWT...');
      const token = jwt.sign(
        { id: user.id, email: user.email, nombre: user.nombre },
        process.env.JWT_SECRET ?? 'tu-clave-secreta-por-defecto',
        { expiresIn: '1d' }
      );
      console.log('[API Login] Token creado.');

      const response = NextResponse.json({ ok: true, user: { id: user.id, email: user.email, nombre: user.nombre } });
      console.log('[API Login] Creando la cookie...');
      
      response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 24 * 60 * 60
      });
      console.log('✅ [API Login] Cookie configurada en la respuesta.');
      
      // Si ves este último log, todo debería haber funcionado.
      console.log('--- [API Login] Enviando respuesta exitosa al navegador. ---');
      return response;
      
    } finally {
      client.release();
      console.log('[API Login] Conexión a la base de datos liberada.');
    }
    
  } catch (error) {
    console.error('❌ [API Login] ERROR CATASTRÓFICO EN EL BLOQUE TRY-CATCH:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}