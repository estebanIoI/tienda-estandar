'use client'

import { useState, useEffect, useMemo } from 'react'
import { api } from '@/lib/api'
import { formatCOP } from '@/lib/utils'
import type { Product } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Search,
  Plus,
  Edit,
  Trash2,
  FlaskConical,
  Package,
  X,
} from 'lucide-react'

interface RecipeIngredient {
  id: string
  ingredientId: string
  ingredientName: string
  ingredientSku: string
  quantity: number
  unitCost: number
  totalCost: number
}

interface RecipeGroup {
  productId: string
  productName: string
  productSku: string
  totalCost: number
  ingredients: RecipeIngredient[]
}

interface IngredientFormItem {
  ingredientId: string
  quantity: string
}

export function Recipes() {
  const [recipes, setRecipes] = useState<RecipeGroup[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [editingRecipe, setEditingRecipe] = useState<RecipeGroup | null>(null)
  const [deletingRecipe, setDeletingRecipe] = useState<RecipeGroup | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Form state
  const [selectedProductId, setSelectedProductId] = useState('')
  const [ingredientsList, setIngredientsList] = useState<IngredientFormItem[]>([
    { ingredientId: '', quantity: '' },
  ])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [recipesRes, productsRes] = await Promise.all([
        api.getRecipes(),
        api.getProducts({ limit: 100 }),
      ])

      if (recipesRes.success && recipesRes.data) {
        setRecipes(recipesRes.data as any)
      }
      if (productsRes.success && productsRes.data) {
        const prods = (productsRes.data as any).products || productsRes.data
        setProducts(Array.isArray(prods) ? prods : [])
      }
    } catch (error) {
      console.error('Error loading recipes:', error)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  // Products that can be finished goods (have sale price > 0)
  const finishedProducts = useMemo(
    () => products.filter((p) => p.salePrice > 0),
    [products]
  )

  // Products that can be ingredients (insumos or any product)
  const ingredientProducts = useMemo(
    () => products.filter((p) => p.category === 'insumos' || p.salePrice === 0),
    [products]
  )

  // All products as potential ingredients (fallback if no insumos category)
  const allIngredientOptions = useMemo(
    () => (ingredientProducts.length > 0 ? ingredientProducts : products),
    [ingredientProducts, products]
  )

  const filteredRecipes = useMemo(() => {
    if (!search) return recipes
    const q = search.toLowerCase()
    return recipes.filter(
      (r) =>
        r.productName.toLowerCase().includes(q) ||
        r.productSku.toLowerCase().includes(q)
    )
  }, [recipes, search])

  const openCreate = () => {
    setEditingRecipe(null)
    setSelectedProductId('')
    setIngredientsList([{ ingredientId: '', quantity: '' }])
    setIsFormOpen(true)
  }

  const openEdit = (recipe: RecipeGroup) => {
    setEditingRecipe(recipe)
    setSelectedProductId(recipe.productId)
    setIngredientsList(
      recipe.ingredients.map((ing) => ({
        ingredientId: ing.ingredientId,
        quantity: String(ing.quantity),
      }))
    )
    setIsFormOpen(true)
  }

  const openDelete = (recipe: RecipeGroup) => {
    setDeletingRecipe(recipe)
    setIsDeleteOpen(true)
  }

  const addIngredientRow = () => {
    setIngredientsList([...ingredientsList, { ingredientId: '', quantity: '' }])
  }

  const removeIngredientRow = (index: number) => {
    if (ingredientsList.length <= 1) return
    setIngredientsList(ingredientsList.filter((_, i) => i !== index))
  }

  const updateIngredient = (
    index: number,
    field: keyof IngredientFormItem,
    value: string
  ) => {
    const updated = [...ingredientsList]
    updated[index] = { ...updated[index], [field]: value }
    setIngredientsList(updated)
  }

  // Calculate total cost in real time
  const calculatedCost = useMemo(() => {
    let total = 0
    for (const item of ingredientsList) {
      if (!item.ingredientId || !item.quantity) continue
      const product = products.find((p) => p.id === item.ingredientId)
      if (product) {
        total += product.purchasePrice * parseFloat(item.quantity || '0')
      }
    }
    return total
  }, [ingredientsList, products])

  const handleSave = async () => {
    if (!selectedProductId) return

    const validIngredients = ingredientsList.filter(
      (i) => i.ingredientId && parseFloat(i.quantity) > 0
    )

    if (validIngredients.length === 0) return

    setIsSaving(true)
    try {
      const result = await api.saveRecipe(
        selectedProductId,
        validIngredients.map((i) => ({
          ingredientId: i.ingredientId,
          quantity: parseFloat(i.quantity),
        }))
      )

      if (result.success) {
        setIsFormOpen(false)
        await loadData()
      } else {
        alert(result.error || 'Error al guardar la receta')
      }
    } catch (error) {
      console.error('Error saving recipe:', error)
      alert('Error al guardar la receta')
    }
    setIsSaving(false)
  }

  const handleDelete = async () => {
    if (!deletingRecipe) return

    try {
      const result = await api.deleteRecipe(deletingRecipe.productId)
      if (result.success) {
        setIsDeleteOpen(false)
        setDeletingRecipe(null)
        await loadData()
      } else {
        alert(result.error || 'Error al eliminar la receta')
      }
    } catch (error) {
      console.error('Error deleting recipe:', error)
    }
  }

  // Products that already have a recipe (can't create duplicate)
  const usedProductIds = useMemo(
    () => new Set(recipes.map((r) => r.productId)),
    [recipes]
  )

  const availableFinishedProducts = useMemo(
    () =>
      editingRecipe
        ? finishedProducts
        : finishedProducts.filter((p) => !usedProductIds.has(p.id)),
    [finishedProducts, usedProductIds, editingRecipe]
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <FlaskConical className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl">Recetas BOM</CardTitle>
              <Badge variant="secondary" className="ml-2">
                {recipes.length}
              </Badge>
            </div>
            <Button onClick={openCreate} className="gap-2">
              <Plus className="h-4 w-4" />
              Nueva Receta
            </Button>
          </div>
          <div className="relative mt-4 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : filteredRecipes.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FlaskConical className="mx-auto h-12 w-12 mb-4 opacity-30" />
              <p className="text-lg font-medium">No hay recetas</p>
              <p className="text-sm">
                Crea una receta para definir los ingredientes de un producto
                compuesto
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Ingredientes</TableHead>
                    <TableHead className="text-right">Costo Total</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecipes.map((recipe) => (
                    <TableRow key={recipe.productId}>
                      <TableCell className="font-medium">
                        {recipe.productName}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{recipe.productSku}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {recipe.ingredients.map((ing) => (
                            <Badge
                              key={ing.id}
                              variant="secondary"
                              className="text-xs"
                            >
                              {ing.ingredientName} x{ing.quantity}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCOP(recipe.totalCost)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEdit(recipe)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openDelete(recipe)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingRecipe ? 'Editar Receta' : 'Nueva Receta'}
            </DialogTitle>
            <DialogDescription>
              Define los ingredientes y cantidades necesarias para producir una
              unidad del producto terminado.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Product Selection */}
            <div className="space-y-2">
              <Label>Producto Terminado *</Label>
              <Select
                value={selectedProductId}
                onValueChange={setSelectedProductId}
                disabled={!!editingRecipe}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un producto..." />
                </SelectTrigger>
                <SelectContent>
                  {availableFinishedProducts.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} ({p.sku})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Ingredients List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Ingredientes *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addIngredientRow}
                  className="gap-1"
                >
                  <Plus className="h-3 w-3" />
                  Agregar
                </Button>
              </div>

              <div className="space-y-2">
                {ingredientsList.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 rounded-lg border p-3"
                  >
                    <div className="flex-1">
                      <Select
                        value={item.ingredientId}
                        onValueChange={(val) =>
                          updateIngredient(index, 'ingredientId', val)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona insumo..." />
                        </SelectTrigger>
                        <SelectContent>
                          {allIngredientOptions.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.name} ({p.sku}) - {formatCOP(p.purchasePrice)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-28">
                      <Input
                        type="number"
                        step="0.001"
                        min="0.001"
                        placeholder="Cantidad"
                        value={item.quantity}
                        onChange={(e) =>
                          updateIngredient(index, 'quantity', e.target.value)
                        }
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeIngredientRow(index)}
                      disabled={ingredientsList.length <= 1}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Cost Summary */}
            <div className="rounded-lg bg-muted p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Costo estimado por unidad</span>
                </div>
                <span className="text-lg font-bold text-primary">
                  {formatCOP(calculatedCost)}
                </span>
              </div>
              {ingredientsList.filter((i) => i.ingredientId && i.quantity).length >
                0 && (
                <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                  {ingredientsList
                    .filter((i) => i.ingredientId && i.quantity)
                    .map((item, idx) => {
                      const product = products.find(
                        (p) => p.id === item.ingredientId
                      )
                      if (!product) return null
                      const cost =
                        product.purchasePrice * parseFloat(item.quantity || '0')
                      return (
                        <div key={idx} className="flex justify-between">
                          <span>
                            {product.name} x {item.quantity}
                          </span>
                          <span>{formatCOP(cost)}</span>
                        </div>
                      )
                    })}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={
                isSaving ||
                !selectedProductId ||
                ingredientsList.filter(
                  (i) => i.ingredientId && parseFloat(i.quantity) > 0
                ).length === 0
              }
            >
              {isSaving ? 'Guardando...' : 'Guardar Receta'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Receta</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de eliminar la receta de{' '}
              <strong>{deletingRecipe?.productName}</strong>? Esta acción no se
              puede deshacer. El producto dejará de ser compuesto.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
