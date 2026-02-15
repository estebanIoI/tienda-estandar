'use client'

import { useStore } from '@/lib/store'
import { useAuthStore } from '@/lib/auth-store'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Receipt,
  History,
  TrendingUp,
  Settings,
  X,
  Users,
  CreditCard,
  Vault,
  Crown,
  Store,
  ClipboardList,
  Ticket,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const navigation = [
  { id: 'superadmin', name: 'Panel Admin', icon: Crown, adminOnly: true, superadminOnly: true },
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, adminOnly: true },
  { id: 'inventory', name: 'Inventario', icon: Package, adminOnly: true },
  { id: 'tienda', name: 'Tienda', icon: Store, adminOnly: true },
  { id: 'pedidos', name: 'Pedidos', icon: ClipboardList, adminOnly: true },
  { id: 'cupones', name: 'Cupones', icon: Ticket, adminOnly: true },
  { id: 'pos', name: 'Punto de Venta', icon: ShoppingCart, adminOnly: false },
  { id: 'cash-register', name: 'Caja', icon: Vault, adminOnly: false },
  { id: 'invoices', name: 'Facturación', icon: Receipt, adminOnly: true },
  { id: 'customers', name: 'Clientes', icon: Users, adminOnly: true },
  { id: 'fiados', name: 'Fiados', icon: CreditCard, adminOnly: true },
  { id: 'history', name: 'Historial', icon: History, adminOnly: false },
  { id: 'analytics', name: 'Análisis', icon: TrendingUp, adminOnly: true },
  { id: 'settings', name: 'Configuración', icon: Settings, adminOnly: true },
]

export function Sidebar() {
  const { activeSection, setActiveSection, sidebarOpen, setSidebarOpen } = useStore()
  const { user } = useAuthStore()
  const isSuperadmin = user?.role === 'superadmin'
  const isAdmin = user?.role === 'comerciante' || isSuperadmin
  const filteredNavigation = navigation.filter(item => {
    if (item.superadminOnly && !isSuperadmin) return false
    if (item.adminOnly && !isAdmin) return false
    return true
  })

  return (
    <>
      {/* Overlay para móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={cn(
        "fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-300 ease-in-out",
        "md:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-6">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/image/stockproicon.png" alt="StockPro" width={36} height={36} className="rounded-lg" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-sidebar-foreground">StockPro</span>
              <span className="text-xs text-muted-foreground">Gestion de Inventario</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {filteredNavigation.map((item) => {
            const isActive = activeSection === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-primary"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive && "text-primary")} />
                {item.name}
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4">
          <div className="rounded-lg bg-sidebar-accent p-3">
            <p className="text-xs text-muted-foreground">Versión 1.0.0</p>
            <p className="text-xs text-muted-foreground">StockPro by v0</p>
          </div>
        </div>
      </aside>
    </>
  )
}
