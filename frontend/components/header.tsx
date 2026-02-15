'use client'

import { useStore } from '@/lib/store'
import { useAuthStore } from '@/lib/auth-store'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Bell, ExternalLink, Menu, PackageX, Search, User } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const sectionTitles: Record<string, string> = {
  dashboard: 'Dashboard',
  inventory: 'Gestión de Inventario',
  pos: 'Punto de Venta',
  'cash-register': 'Caja Registradora',
  invoices: 'Facturación',
  history: 'Historial de Ventas',
  analytics: 'Análisis y Reportes',
  settings: 'Configuración',
}

export function Header() {
  const { activeSection, products, toggleSidebar, navigateToInventory } = useStore()
  const { logout } = useAuthStore()
  const lowStockProducts = products.filter(p => p.stock <= p.reorderPoint && p.stock > 0).sort((a, b) => a.stock - b.stock)
  const outOfStockProducts = products.filter(p => p.stock === 0)
  const lowStockCount = lowStockProducts.length
  const outOfStockCount = outOfStockProducts.length
  const alertCount = lowStockCount + outOfStockCount
  
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:h-16 lg:h-18 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold text-foreground sm:text-xl lg:text-2xl">
          {sectionTitles[activeSection] || 'Dashboard'}
        </h1>
      </div>

      <div className="flex items-center gap-3 lg:gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar productos, facturas..."
            className="w-64 lg:w-80 xl:w-96 pl-9 bg-secondary border-none h-10 lg:h-11"
          />
        </div>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-10 w-10 lg:h-11 lg:w-11">
              <Bell className="h-5 w-5 lg:h-5.5 lg:w-5.5 text-muted-foreground" />
              {alertCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 lg:h-5.5 lg:w-5.5 items-center justify-center rounded-full bg-destructive text-[10px] lg:text-xs font-medium text-destructive-foreground">
                  {alertCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 lg:w-96 max-h-[70vh] overflow-y-auto">
            <DropdownMenuLabel className="text-sm lg:text-base">Notificaciones</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {outOfStockCount > 0 && (
              <>
                <DropdownMenuItem
                  className="flex items-center gap-2 py-2 cursor-pointer"
                  onClick={() => navigateToInventory('agotado')}
                >
                  <PackageX className="h-4 w-4 text-destructive shrink-0" />
                  <span className="text-sm font-medium text-destructive">Sin Stock ({outOfStockCount})</span>
                  <ExternalLink className="h-3 w-3 text-muted-foreground ml-auto shrink-0" />
                </DropdownMenuItem>
                {outOfStockProducts.slice(0, 4).map((product) => (
                  <DropdownMenuItem
                    key={product.id}
                    className="flex items-center gap-3 py-2 pl-6 cursor-pointer"
                    onClick={() => navigateToInventory('agotado', product.name)}
                  >
                    <span className="h-2 w-2 rounded-full bg-destructive shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                    </div>
                    <span className="text-xs font-medium text-destructive shrink-0">0 uds</span>
                  </DropdownMenuItem>
                ))}
                {outOfStockCount > 4 && (
                  <DropdownMenuItem
                    className="py-1.5 pl-6 cursor-pointer"
                    onClick={() => navigateToInventory('agotado')}
                  >
                    <span className="text-xs text-muted-foreground">
                      +{outOfStockCount - 4} productos más...
                    </span>
                  </DropdownMenuItem>
                )}
              </>
            )}
            {lowStockCount > 0 && outOfStockCount > 0 && <DropdownMenuSeparator />}
            {lowStockCount > 0 && (
              <>
                <DropdownMenuItem
                  className="flex items-center gap-2 py-2 cursor-pointer"
                  onClick={() => navigateToInventory('bajo')}
                >
                  <AlertTriangle className="h-4 w-4 text-warning shrink-0" />
                  <span className="text-sm font-medium text-warning">Stock Bajo ({lowStockCount})</span>
                  <ExternalLink className="h-3 w-3 text-muted-foreground ml-auto shrink-0" />
                </DropdownMenuItem>
                {lowStockProducts.slice(0, 4).map((product) => (
                  <DropdownMenuItem
                    key={product.id}
                    className="flex items-center gap-3 py-2 pl-6 cursor-pointer"
                    onClick={() => navigateToInventory('bajo', product.name)}
                  >
                    <span className="h-2 w-2 rounded-full bg-warning shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                    </div>
                    <span className="text-xs font-medium text-warning shrink-0">
                      {product.stock}/{product.reorderPoint}
                    </span>
                  </DropdownMenuItem>
                ))}
                {lowStockCount > 4 && (
                  <DropdownMenuItem
                    className="py-1.5 pl-6 cursor-pointer"
                    onClick={() => navigateToInventory('bajo')}
                  >
                    <span className="text-xs text-muted-foreground">
                      +{lowStockCount - 4} productos más...
                    </span>
                  </DropdownMenuItem>
                )}
              </>
            )}
            {alertCount === 0 && (
              <DropdownMenuItem className="py-3 text-sm lg:text-base text-muted-foreground">
                No hay alertas pendientes
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10 lg:h-11 lg:w-11">
              <div className="flex h-8 w-8 lg:h-9 lg:w-9 items-center justify-center rounded-full bg-primary">
                <User className="h-4 w-4 lg:h-5 lg:w-5 text-primary-foreground" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 lg:w-56">
            <DropdownMenuLabel className="text-sm lg:text-base">Mi Cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-sm lg:text-base">Perfil</DropdownMenuItem>
            <DropdownMenuItem className="text-sm lg:text-base">Preferencias</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-sm lg:text-base">Cerrar Sesión</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
