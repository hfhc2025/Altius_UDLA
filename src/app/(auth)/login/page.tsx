'use client'

import { Suspense, useState, useEffect, FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card'

/* ---------------------------- Componente Form ----------------------------- */
function LoginForm() {
  const router                = useRouter()
  const searchParams          = useSearchParams()
  const [email, setEmail]     = useState('')
  const [password, setPass]   = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  /* --------------------------- Submit al servidor -------------------------- */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      })

      if (res.ok) {
        const dest = searchParams.get('from') || '/dashboard'
        router.replace(dest)
        router.refresh()
      } else {
        const { error } = await res.json()
        setError(error ?? 'Credenciales inválidas')
      }
    } catch {
      setError('No se pudo conectar con el servidor')
    } finally {
      setLoading(false)
    }
  }

  /* ---------------------- Redirección si ya hay sesión --------------------- */
  useEffect(() => {
    ;(async () => {
      const r = await fetch('/api/auth/me', { credentials: 'include' })
      if (r.ok) {
        const dest = searchParams.get('from') || '/dashboard'
        router.replace(dest)
      }
    })()
  }, [router, searchParams])

  /* --------------------------------– UI ----------------------------------- */
  return (
    <div className="relative min-h-screen text-white font-sans">
      {/* ---------- Video de fondo ---------- */}
      <video
        className="absolute inset-0 -z-10 w-full h-full object-cover"
        src="/1.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* ---------- Overlay degradado ---------- */}
      <div className="absolute inset-0 -z-5 bg-gradient-to-tr from-black/80 via-black/60 to-[#FF6600]/40" />

      {/* ---------- Tarjeta de login ---------- */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-[0_8px_32px_rgba(255,255,255,0.10)] animate-in fade-in duration-500">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-extrabold text-center">
              Iniciar Sesión
            </CardTitle>
            <p className="text-center font-semibold text-orange-400">
              Bienvenido a Analytics UDLA
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <p
                role="alert"
                className="bg-red-500/20 border border-red-400/40 text-red-300 px-4 py-3 rounded"
              >
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm mb-1">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  className="bg-white/20 placeholder-white/50 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm mb-1">
                  Contraseña
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPass(e.target.value)}
                  disabled={loading}
                  required
                  className="bg-white/20 placeholder-white/50 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-gradient-to-r from-orange-500 to-orange-600 hover:brightness-110 text-white font-semibold shadow-lg transition-all"
              >
                {loading && (
                  <span className="h-5 w-5 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                {loading ? 'Iniciando…' : 'Iniciar Sesión'}
              </Button>
            </form>

            <p className="pt-8 text-center text-xs text-white/60">
              Desarrollado por <span className="font-semibold">Altius Ignite</span>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

/* -------------------------- Entry point de página ------------------------- */
export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}