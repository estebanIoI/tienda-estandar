'use client'

import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Store,
  Search,
  Eye,
  EyeOff,
  Package,
  CheckCircle,
  XCircle,
  RefreshCw,
  Filter,
  Globe,
  ShoppingBag,
} from 'lucide-react'

interface StoreProduct {
  id: string
  name: string
  category: string
  brand: string | null
  salePrice: number
  imageUrl: string | null
  stock: number
  publishedInStore: boolean
}

export function Tienda() {
  const [products, setProducts] = useState<StoreProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [filterPublished, setFilterPublished] = useState<'all' | 'published' | 'unpublished'>('all')
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set())
  const [selectMode, setSelectMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [stats, setStats] = useState({ total: 0, published: 0, unpublished: 0 })
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const result = await api.getMyPublishedProducts()
      if (result.success && result.data) {
        const prods = (Array.isArray(result.data) ? result.data : []).map((p: any) => ({
          ...p,
          // Ensure publishedInStore is a proper boolean (handle Buffer/number from MySQL)
          publishedInStore: p.publishedInStore === true || p.publishedInStore === 1 || Number(p.publishedInStore) === 1,
        }))
        setProducts(prods)
        const published = prods.filter((p: StoreProduct) => p.publishedInStore).length
        setStats({ total: prods.length, published, unpublished: prods.length - published })
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Auto-dismiss error messages
  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => setErrorMsg(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [errorMsg])

  const togglePublish = async (productId: string, currentState: boolean) => {
    setTogglingIds(prev => new Set(prev).add(productId))
    setErrorMsg(null)
    try {
      const result = await api.publishProduct(productId, !currentState)
      if (result.success) {
        setProducts(prev => prev.map(p =>
          p.id === productId ? { ...p, publishedInStore: !currentState } : p
        ))
        setStats(prev => ({
          ...prev,
          published: prev.published + (currentState ? -1 : 1),
          unpublished: prev.unpublished + (currentState ? 1 : -1),
        }))
      } else {
        setErrorMsg(result.error || 'Error al cambiar la visibilidad del producto')
        // Re-fetch to ensure state consistency
        await fetchProducts()
      }
    } catch (error) {
      console.error('Error toggling publish:', error)
      setErrorMsg('Error de conexión al cambiar la visibilidad del producto')
      await fetchProducts()
    } finally {
      setTogglingIds(prev => {
        const next = new Set(prev)
        next.delete(productId)
        return next
      })
    }
  }

  const bulkPublish = async (publish: boolean) => {
    if (selectedIds.size === 0) return
    const ids = Array.from(selectedIds)
    try {
      const result = await api.bulkPublishProducts(ids, publish)
      if (result.success) {
        await fetchProducts()
        setSelectedIds(new Set())
        setSelectMode(false)
      }
    } catch (error) {
      console.error('Error bulk publish:', error)
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectAll = () => {
    if (selectedIds.size === filteredProducts.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredProducts.map(p => p.id)))
    }
  }

  // Get unique categories
  const categories = Array.from(new Set(products.map(p => p.category))).sort()

  // Filter products
  const filteredProducts = products.filter(p => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false
    if (filterPublished === 'published' && !p.publishedInStore) return false
    if (filterPublished === 'unpublished' && p.publishedInStore) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return (
        p.name.toLowerCase().includes(q) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q)
      )
    }
    return true
  })

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Store className="h-7 w-7 text-primary" />
            Mi Tienda Online
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestiona qué productos se muestran en tu catálogo público
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchProducts} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button
            variant={selectMode ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setSelectMode(!selectMode)
              setSelectedIds(new Set())
            }}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            {selectMode ? 'Cancelar selección' : 'Selección múltiple'}
          </Button>
        </div>
      </div>

      {/* Error Banner */}
      {errorMsg && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
          <XCircle className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm">{errorMsg}</span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
              <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Productos</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
              <Globe className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Publicados</p>
              <p className="text-2xl font-bold text-green-600">{stats.published}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
              <EyeOff className="h-5 w-5 text-gray-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sin publicar</p>
              <p className="text-2xl font-bold text-gray-500">{stats.unpublished}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="all">Todas las categorías</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <div className="flex gap-1">
              {(['all', 'published', 'unpublished'] as const).map(f => (
                <Button
                  key={f}
                  variant={filterPublished === f ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterPublished(f)}
                >
                  {f === 'all' ? 'Todos' : f === 'published' ? 'Publicados' : 'Sin publicar'}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectMode && selectedIds.size > 0 && (
        <div className="flex items-center gap-3 rounded-lg border bg-muted/50 p-3">
          <span className="text-sm font-medium">{selectedIds.size} producto(s) seleccionado(s)</span>
          <Button size="sm" variant="default" onClick={() => bulkPublish(true)}>
            <Eye className="h-4 w-4 mr-1" /> Publicar
          </Button>
          <Button size="sm" variant="outline" onClick={() => bulkPublish(false)}>
            <EyeOff className="h-4 w-4 mr-1" /> Ocultar
          </Button>
          <Button size="sm" variant="ghost" onClick={selectAll}>
            {selectedIds.size === filteredProducts.length ? 'Deseleccionar todo' : 'Seleccionar todo'}
          </Button>
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No se encontraron productos</h3>
            <p className="text-muted-foreground text-sm mt-1">
              {products.length === 0
                ? 'Agrega productos en el módulo de Inventario para publicarlos aquí'
                : 'Prueba con otros filtros de búsqueda'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map(product => {
            const isPublished = !!product.publishedInStore
            const isToggling = togglingIds.has(product.id)
            const isSelected = selectedIds.has(product.id)

            return (
              <Card
                key={product.id}
                className={`overflow-hidden transition-all ${
                  isSelected ? 'ring-2 ring-primary' : ''
                } ${isPublished ? 'border-green-200 dark:border-green-800' : ''}`}
              >
                {selectMode && (
                  <div className="absolute top-2 left-2 z-10">
                    <button
                      onClick={() => toggleSelect(product.id)}
                      className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-primary border-primary text-primary-foreground'
                          : 'bg-white border-gray-300 dark:bg-gray-800 dark:border-gray-600'
                      }`}
                    >
                      {isSelected && <CheckCircle className="h-4 w-4" />}
                    </button>
                  </div>
                )}

                <div className="relative">
                  {product.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <div className="w-full h-40 bg-muted flex items-center justify-center">
                      <Package className="h-10 w-10 text-muted-foreground" />
                    </div>
                  )}

                  {/* Published indicator */}
                  <div className="absolute top-2 right-2">
                    <Badge variant={isPublished ? 'default' : 'secondary'} className="text-xs">
                      {isPublished ? (
                        <>
                          <Eye className="h-3 w-3 mr-1" /> Visible
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3 w-3 mr-1" /> Oculto
                        </>
                      )}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{product.category}</Badge>
                      {product.brand && (
                        <span className="text-xs text-muted-foreground">{product.brand}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">
                      {formatCurrency(product.salePrice)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Stock: {product.stock}
                    </span>
                  </div>

                  <Button
                    variant={isPublished ? 'outline' : 'default'}
                    size="sm"
                    className="w-full"
                    disabled={isToggling}
                    onClick={() => togglePublish(product.id, isPublished)}
                  >
                    {isToggling ? (
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    ) : isPublished ? (
                      <EyeOff className="h-4 w-4 mr-2" />
                    ) : (
                      <Eye className="h-4 w-4 mr-2" />
                    )}
                    {isToggling ? 'Actualizando...' : isPublished ? 'Ocultar del catálogo' : 'Publicar en catálogo'}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
