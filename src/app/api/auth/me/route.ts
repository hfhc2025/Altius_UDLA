// src/app/api/auth/me/route.ts
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // 1. Intenta obtener el token de la cookie
    const token = req.cookies.get('token')?.value;

    if (!token) {
      // Si no hay token, no hay sesión activa
      return NextResponse.json(
        { error: 'No autorizado: No se proveyó un token' },
        { status: 401 }
      );
    }

    // 2. Verifica que el token sea válido y no haya expirado
    const decodedPayload = jwt.verify(
      token,
      process.env.JWT_SECRET ?? 'tu-clave-secreta-por-defecto'
    );

    // Si la verificación es exitosa, devuelve los datos del usuario
    return NextResponse.json({
      ok: true,
      user: decodedPayload,
    });
  } catch (error) {
    // ⬇️  Type-safe: validamos que sea instancia de Error antes de usar .message
    if (error instanceof Error) {
      console.error(
        '❌ [API auth/me] Fallo en la verificación del token:',
        error.message
      );
    } else {
      console.error('❌ [API auth/me] Error desconocido:', error);
    }

    return NextResponse.json(
      { error: 'No autorizado: Token inválido o expirado' },
      { status: 401 }
    );
  }
}