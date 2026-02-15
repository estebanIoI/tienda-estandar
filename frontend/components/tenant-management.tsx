'use client'

import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api'
import type { Tenant, TenantPlan, TenantStatus } from '@/lib/types'
import { formatCOP } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Building2,
  Users,
  Package,
  ShoppingCart,
  TrendingUp,
  Search,
  Plus,
  Eye,
  Edit,
  Power,
  RefreshCw,
  Crown,
  Store,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Mail,
  User,
  Lock,
  Globe,
} from 'lucide-react'
import { toast } from 'sonner'

interface PlatformStats {
  totalTenants: number
  activeTenants: number
  suspendedTenants: number
  totalUsers: number
  totalProducts: number
  totalSales: number
  totalRevenue: number
}

interface TenantDetail extends Tenant {
  businessType?: string
  totalCustomers?: number
  inventoryValue?: number
}

export function TenantManagement() {
  const [tenants, setTenants] = useState<TenantDetail[]>([])
  const [stats, setStats] = useState<PlatformStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Create dialog
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [createForm, setCreateForm] = useState({
    name: '',
    slug: '',
    businessType: '',
    plan: 'basico' as TenantPlan,
    maxUsers: 5,
    maxProducts: 500,
    ownerName: '',
    ownerEmail: '',
    ownerPassword: '',
  })

  // Edit dialog
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [editingTenant, setEditingTenant] = useState<TenantDetail | null>(null)
  const [editForm, setEditForm] = useState({
    name: '',
    plan: 'basico' as TenantPlan,
    maxUsers: 5,
    maxProducts: 500,
  })

  // Detail dialog
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [detailTenant, setDetailTenant] = useState<TenantDetail | null>(null)

  const fetchTenants = useCallback(async () => {
    setIsLoading(true)
    const result = await api.getTenants({ page, limit: 20, search: search || undefined })
    if (result.success && result.data) {
      setTenants(Array.isArray(result.data) ? result.data : result.data.tenants || [])
      if (result.data.totalPages) setTotalPages(result.data.totalPages)
    }
    setIsLoading(false)
  }, [page, search])

  const fetchStats = useCallback(async () => {
    const result = await api.getTenantStats()
    if (result.success && result.data) {
      setStats(result.data)
    }
  }, [])

  useEffect(() => {
    fetchTenants()
    fetchStats()
  }, [fetchTenants, fetchStats])

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleCreateTenant = async () => {
    if (!createForm.name || !createForm.slug || !createForm.ownerName || !createForm.ownerEmail || !createForm.ownerPassword) {
      toast.error('Complete todos los campos requeridos')
      return
    }
    if (createForm.ownerPassword.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setIsCreating(true)
    const result = await api.createTenant({
      name: createForm.name,
      slug: createForm.slug,
      plan: createForm.plan,
      maxUsers: createForm.maxUsers,
      maxProducts: createForm.maxProducts,
      ownerName: createForm.ownerName,
      ownerEmail: createForm.ownerEmail,
      ownerPassword: createForm.ownerPassword,
    })

    if (result.success) {
      toast.success('Comercio creado exitosamente')
      setIsCreateOpen(false)
      setCreateForm({
        name: '', slug: '', businessType: '', plan: 'basico',
        maxUsers: 5, maxProducts: 500, ownerName: '', ownerEmail: '', ownerPassword: '',
      })
      fetchTenants()
      fetchStats()
    } else {
      toast.error(result.error || 'Error al crear comercio')
    }
    setIsCreating(false)
  }

  const handleUpdateTenant = async () => {
    if (!editingTenant) return
    setIsUpdating(true)
    const result = await api.updateTenant(editingTenant.id, {
      name: editForm.name,
      plan: editForm.plan,
      maxUsers: editForm.maxUsers,
      maxProducts: editForm.maxProducts,
    })
    if (result.success) {
      toast.success('Comercio actualizado')
      setIsEditOpen(false)
      fetchTenants()
    } else {
      toast.error(result.error || 'Error al actualizar')
    }
    setIsUpdating(false)
  }

  const handleToggleStatus = async (tenant: TenantDetail) => {
    const action = tenant.status === 'activo' ? 'suspender' : 'activar'
    const result = await api.toggleTenantStatus(tenant.id)
    if (result.success) {
      toast.success(`Comercio ${action === 'suspender' ? 'suspendido' : 'activado'}`)
      fetchTenants()
      fetchStats()
    } else {
      toast.error(result.error || `Error al ${action}`)
    }
  }

  const openEdit = (tenant: TenantDetail) => {
    setEditingTenant(tenant)
    setEditForm({
      name: tenant.name,
      plan: tenant.plan,
      maxUsers: tenant.maxUsers,
      maxProducts: tenant.maxProducts,
    })
    setIsEditOpen(true)
  }

  const openDetail = async (tenant: TenantDetail) => {
    const result = await api.getTenant(tenant.id)
    if (result.success && result.data) {
      setDetailTenant(result.data)
    } else {
      setDetailTenant(tenant)
    }
    setIsDetailOpen(true)
  }

  const statusConfig: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
    activo: { label: 'Activo', className: 'bg-green-500/15 text-green-500 border-green-500/30', icon: <CheckCircle2 className="h-3 w-3" /> },
    suspendido: { label: 'Suspendido', className: 'bg-yellow-500/15 text-yellow-500 border-yellow-500/30', icon: <AlertTriangle className="h-3 w-3" /> },
    cancelado: { label: 'Cancelado', className: 'bg-red-500/15 text-red-500 border-red-500/30', icon: <XCircle className="h-3 w-3" /> },
  }

  const planConfig: Record<string, { label: string; className: string }> = {
    basico: { label: 'Básico', className: 'bg-secondary text-secondary-foreground' },
    profesional: { label: 'Profesional', className: 'bg-blue-500/15 text-blue-500 border-blue-500/30' },
    empresarial: { label: 'Empresarial', className: 'bg-purple-500/15 text-purple-500 border-purple-500/30' },
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-foreground flex items-center gap-2">
            <Crown className="h-6 w-6 text-amber-500" />
            Panel Superadmin
          </h2>
          <p className="text-sm lg:text-base text-muted-foreground">
            Gestión de comercios y plataforma
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => { fetchTenants(); fetchStats() }} className="gap-1">
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </Button>
          <Button size="sm" onClick={() => setIsCreateOpen(true)} className="gap-1">
            <Plus className="h-4 w-4" />
            Nuevo Comercio
          </Button>
        </div>
      </div>

      {/* Platform Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          <StatCard title="Comercios" value={stats.totalTenants} icon={<Building2 className="h-5 w-5 text-primary" />} />
          <StatCard title="Activos" value={stats.activeTenants} icon={<CheckCircle2 className="h-5 w-5 text-green-500" />} />
          <StatCard title="Suspendidos" value={stats.suspendedTenants} icon={<AlertTriangle className="h-5 w-5 text-yellow-500" />} />
          <StatCard title="Usuarios" value={stats.totalUsers} icon={<Users className="h-5 w-5 text-blue-500" />} />
          <StatCard title="Productos" value={stats.totalProducts} icon={<Package className="h-5 w-5 text-purple-500" />} />
          <StatCard title="Ventas" value={stats.totalSales} icon={<ShoppingCart className="h-5 w-5 text-orange-500" />} />
          <StatCard title="Ingresos" value={formatCOP(stats.totalRevenue || 0)} icon={<TrendingUp className="h-5 w-5 text-green-500" />} isText />
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar comercio por nombre o email..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          className="pl-9"
        />
      </div>

      {/* Tenants Table */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base lg:text-lg flex items-center gap-2">
            <Store className="h-5 w-5 text-muted-foreground" />
            Comercios Registrados
          </CardTitle>
          <CardDescription>
            {tenants.length} comercio{tenants.length !== 1 ? 's' : ''} encontrado{tenants.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : tenants.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Building2 className="h-12 w-12 mb-3 opacity-50" />
              <p className="font-medium">No hay comercios registrados</p>
              <p className="text-sm mt-1">Crea uno nuevo para comenzar</p>
            </div>
          ) : (
            <Table className="min-w-[900px]">
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-muted-foreground">Comercio</TableHead>
                  <TableHead className="text-muted-foreground">Propietario</TableHead>
                  <TableHead className="text-muted-foreground text-center">Plan</TableHead>
                  <TableHead className="text-muted-foreground text-center">Estado</TableHead>
                  <TableHead className="text-muted-foreground text-right">Usuarios</TableHead>
                  <TableHead className="text-muted-foreground text-right">Productos</TableHead>
                  <TableHead className="text-muted-foreground text-right">Ventas</TableHead>
                  <TableHead className="text-muted-foreground text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenants.map((tenant) => {
                  const sc = statusConfig[tenant.status] || statusConfig.activo
                  const pc = planConfig[tenant.plan] || planConfig.basico
                  return (
                    <TableRow key={tenant.id} className="border-border">
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm text-foreground">{tenant.name}</p>
                          <p className="text-xs text-muted-foreground">{tenant.slug}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm text-foreground">{tenant.ownerName || '-'}</p>
                          <p className="text-xs text-muted-foreground">{tenant.ownerEmail || '-'}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={`text-xs ${pc.className}`}>
                          {pc.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={`text-xs gap-1 ${sc.className}`}>
                          {sc.icon}
                          {sc.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {tenant.totalUsers ?? 0}/{tenant.maxUsers}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {tenant.totalProducts ?? 0}/{tenant.maxProducts}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {tenant.totalSales ?? 0}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openDetail(tenant)} title="Ver detalle">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(tenant)} title="Editar">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`h-8 w-8 ${tenant.status === 'activo' ? 'text-yellow-500 hover:text-yellow-600' : 'text-green-500 hover:text-green-600'}`}
                            onClick={() => handleToggleStatus(tenant)}
                            title={tenant.status === 'activo' ? 'Suspender' : 'Activar'}
                          >
                            <Power className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {page} de {totalPages}
          </span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
            Siguiente
          </Button>
        </div>
      )}

      {/* ===== Create Tenant Dialog ===== */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Nuevo Comercio
            </DialogTitle>
            <DialogDescription>
              Crea un nuevo comercio con su propietario. Se generarán automáticamente las secuencias y configuración inicial.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Business Info */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Información del Negocio</p>
              <div className="space-y-2">
                <Label>Nombre del Comercio <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <Store className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Ej: Tienda La Esquina"
                    value={createForm.name}
                    onChange={(e) => {
                      const name = e.target.value
                      setCreateForm(f => ({ ...f, name, slug: generateSlug(name) }))
                    }}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Slug (URL) <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="tienda-la-esquina"
                    value={createForm.slug}
                    onChange={(e) => setCreateForm(f => ({ ...f, slug: e.target.value }))}
                    className="pl-9"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Identificador único, solo letras minúsculas, números y guiones</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label>Plan</Label>
                  <Select value={createForm.plan} onValueChange={(v) => setCreateForm(f => ({ ...f, plan: v as TenantPlan }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basico">Básico</SelectItem>
                      <SelectItem value="profesional">Profesional</SelectItem>
                      <SelectItem value="empresarial">Empresarial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Máx. Usuarios</Label>
                  <Input
                    type="number"
                    min={1}
                    value={createForm.maxUsers}
                    onChange={(e) => setCreateForm(f => ({ ...f, maxUsers: parseInt(e.target.value) || 5 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Máx. Productos</Label>
                  <Input
                    type="number"
                    min={1}
                    value={createForm.maxProducts}
                    onChange={(e) => setCreateForm(f => ({ ...f, maxProducts: parseInt(e.target.value) || 500 }))}
                  />
                </div>
              </div>
            </div>

            {/* Owner Info */}
            <div className="space-y-3 border-t border-border pt-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Propietario (Comerciante)</p>
              <div className="space-y-2">
                <Label>Nombre <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Nombre del propietario"
                    value={createForm.ownerName}
                    onChange={(e) => setCreateForm(f => ({ ...f, ownerName: e.target.value }))}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="email@ejemplo.com"
                    value={createForm.ownerEmail}
                    onChange={(e) => setCreateForm(f => ({ ...f, ownerEmail: e.target.value }))}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Contraseña <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={createForm.ownerPassword}
                    onChange={(e) => setCreateForm(f => ({ ...f, ownerPassword: e.target.value }))}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreateTenant} disabled={isCreating}>
              {isCreating ? 'Creando...' : 'Crear Comercio'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== Edit Tenant Dialog ===== */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-primary" />
              Editar Comercio
            </DialogTitle>
            <DialogDescription>
              {editingTenant?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm(f => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Plan</Label>
              <Select value={editForm.plan} onValueChange={(v) => setEditForm(f => ({ ...f, plan: v as TenantPlan }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basico">Básico</SelectItem>
                  <SelectItem value="profesional">Profesional</SelectItem>
                  <SelectItem value="empresarial">Empresarial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Máx. Usuarios</Label>
                <Input
                  type="number"
                  min={1}
                  value={editForm.maxUsers}
                  onChange={(e) => setEditForm(f => ({ ...f, maxUsers: parseInt(e.target.value) || 5 }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Máx. Productos</Label>
                <Input
                  type="number"
                  min={1}
                  value={editForm.maxProducts}
                  onChange={(e) => setEditForm(f => ({ ...f, maxProducts: parseInt(e.target.value) || 500 }))}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancelar</Button>
            <Button onClick={handleUpdateTenant} disabled={isUpdating}>
              {isUpdating ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== Detail Dialog ===== */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Detalle del Comercio
            </DialogTitle>
          </DialogHeader>

          {detailTenant && (
            <div className="space-y-4 py-2">
              {/* Status + Plan */}
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`${statusConfig[detailTenant.status]?.className || ''} gap-1`}>
                  {statusConfig[detailTenant.status]?.icon}
                  {statusConfig[detailTenant.status]?.label}
                </Badge>
                <Badge variant="outline" className={planConfig[detailTenant.plan]?.className || ''}>
                  {planConfig[detailTenant.plan]?.label}
                </Badge>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <InfoRow label="Nombre" value={detailTenant.name} />
                <InfoRow label="Slug" value={detailTenant.slug} />
                <InfoRow label="Propietario" value={detailTenant.ownerName || '-'} />
                <InfoRow label="Email" value={detailTenant.ownerEmail || '-'} />
                <InfoRow label="Creado" value={new Date(detailTenant.createdAt).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })} />
                <InfoRow label="Tipo" value={detailTenant.businessType || 'General'} />
              </div>

              {/* Limits & Usage */}
              <div className="rounded-lg border border-border p-3 space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Uso y Límites</p>
                <div className="grid grid-cols-2 gap-3">
                  <UsageBar label="Usuarios" current={detailTenant.totalUsers || 0} max={detailTenant.maxUsers} />
                  <UsageBar label="Productos" current={detailTenant.totalProducts || 0} max={detailTenant.maxProducts} />
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-md bg-secondary p-2">
                    <p className="text-xs text-muted-foreground">Ventas</p>
                    <p className="text-sm font-semibold">{detailTenant.totalSales || 0}</p>
                  </div>
                  <div className="rounded-md bg-secondary p-2">
                    <p className="text-xs text-muted-foreground">Clientes</p>
                    <p className="text-sm font-semibold">{detailTenant.totalCustomers || 0}</p>
                  </div>
                  <div className="rounded-md bg-secondary p-2">
                    <p className="text-xs text-muted-foreground">Inventario</p>
                    <p className="text-sm font-semibold">{formatCOP(detailTenant.inventoryValue || 0)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>Cerrar</Button>
            {detailTenant && (
              <Button onClick={() => { setIsDetailOpen(false); openEdit(detailTenant) }}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ===== Helper Components =====

function StatCard({ title, value, icon, isText }: { title: string; value: number | string; icon: React.ReactNode; isText?: boolean }) {
  return (
    <Card className="border-border bg-card">
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] sm:text-xs text-muted-foreground">{title}</span>
          {icon}
        </div>
        <p className="text-sm sm:text-lg font-semibold text-foreground truncate">
          {isText ? value : typeof value === 'number' ? value.toLocaleString('es-CO') : value}
        </p>
      </CardContent>
    </Card>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  )
}

function UsageBar({ label, current, max }: { label: string; current: number; max: number }) {
  const pct = max > 0 ? Math.min((current / max) * 100, 100) : 0
  const color = pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-yellow-500' : 'bg-green-500'
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-xs font-medium">{current}/{max}</span>
      </div>
      <div className="w-full bg-secondary rounded-full h-1.5">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
