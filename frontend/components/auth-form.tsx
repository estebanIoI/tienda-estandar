'use client'

import { useState } from 'react'
import { useAuthStore } from '@/lib/auth-store'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Mail, Lock, User, AlertCircle, Eye, EyeOff, BarChart3, Package, ShoppingCart, TrendingUp, ArrowLeft, ShieldX } from 'lucide-react'
import { AboutModal } from '@/components/about-modal'
import { DataPolicyModal } from '@/components/data-policy-modal'
import { ContactModal } from '@/components/contact-modal'

interface AuthFormProps {
  onGoBack?: () => void
}

export function AuthForm({ onGoBack }: AuthFormProps) {
  const { login, register } = useAuthStore()
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'vendedor' as 'comerciante' | 'vendedor'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        const result = await login(formData.email, formData.password)
        if (!result.success) {
          setError(result.error || 'Error al iniciar sesión')
        }
      } else {
        if (!formData.name.trim()) {
          setError('El nombre es requerido')
          setLoading(false)
          return
        }
        const result = await register(formData.email, formData.password, formData.name, formData.role)
        if (!result.success) {
          setError(result.error || 'Error al registrarse')
        }
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left side - GIF & Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/image/giflogin.gif"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-emerald-900/40" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/image/stockproicon.png" alt="StockPro" width={48} height={48} className="rounded-lg" />
            <span className="text-2xl font-bold tracking-tight">StockPro</span>
          </div>

          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold leading-tight">
                Gestión de inventario
                <br />
                <span className="text-emerald-400">inteligente y simple</span>
              </h1>
              <p className="mt-4 text-lg text-white/70 max-w-md">
                Controla tu stock, gestiona ventas y haz crecer tu negocio desde un solo lugar.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-md">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-500/20">
                  <Package className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Inventario</p>
                  <p className="text-xs text-white/50">Control total</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/20">
                  <ShoppingCart className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Punto de Venta</p>
                  <p className="text-xs text-white/50">Rápido y fácil</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-500/20">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Reportes</p>
                  <p className="text-xs text-white/50">Datos en tiempo real</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-500/20">
                  <TrendingUp className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Análisis</p>
                  <p className="text-xs text-white/50">Crece tu negocio</p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-sm text-white/40">© 2026 StockPro. Todos los derechos reservados.</p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Back button */}
          {onGoBack && (
            <button
              onClick={onGoBack}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio
            </button>
          )}

          {/* Mobile logo */}
          <div className="flex flex-col items-center lg:hidden space-y-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/image/stockproicon.png" alt="StockPro" width={56} height={56} className="rounded-xl" />
            <h1 className="text-2xl font-bold text-foreground">StockPro</h1>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              {isLogin ? 'Bienvenido de vuelta' : 'Crear cuenta'}
            </h2>
            <p className="text-muted-foreground">
              {isLogin ? 'Ingresa tus credenciales para continuar' : 'Completa tus datos para registrarte'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Nombre Completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Tu nombre"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pl-10 h-12 bg-secondary border-none rounded-xl"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Correo Electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10 h-12 bg-secondary border-none rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 pr-10 h-12 bg-secondary border-none rounded-xl"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium">Rol</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: 'comerciante' | 'vendedor') => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger className="h-12 bg-secondary border-none rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vendedor">Vendedor</SelectItem>
                    <SelectItem value="comerciante">Comerciante</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {error && (
              error.includes('desactivada') || error.includes('suspendido') ? (
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-500/15">
                      <ShieldX className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-amber-500">Acceso restringido</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{error}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground/70 pl-[52px]">
                    Si crees que esto es un error, comunícate con soporte.
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )
            )}

            <Button type="submit" className="w-full h-12 rounded-xl text-base font-semibold" disabled={loading}>
              {loading ? 'Cargando...' : isLogin ? 'Iniciar Sesión' : 'Registrarse'}
            </Button>
          </form>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
              }}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {isLogin ? '.' : '¿Ya tienes cuenta? Inicia sesión'}
            </button>
          </div>

          {/* About, Data Policy & Contact buttons */}
          <div className="flex items-center justify-center gap-2 pt-4 border-t border-border">
            <AboutModal />
            <span className="text-border">|</span>
            <DataPolicyModal />
            <span className="text-border">|</span>
            <ContactModal />
          </div>
        </div>
      </div>
    </div>
  )
}
