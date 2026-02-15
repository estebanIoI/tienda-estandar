'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'

const formatCOP = (value: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value)
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  ChevronDown,
  Sparkles,
  Heart,
  Star,
  Eye,
  Target,
  Award,
  Mail,
  BookOpen,
  Instagram,
  Facebook,
  ShoppingCart,
  Plus,
  Minus,
  X,
  Search,
  MapPin,
  Menu, // Add Menu icon
} from 'lucide-react'
import { CheckoutView } from '@/components/checkout/CheckoutView'
import { ensureAbsoluteUrl } from '@/utils/url'
import type { ProductoCarrito, PedidoForm, PedidoConfirmado, CuponValidacion } from '@/types'

interface LandingPageProps {
  onGoToLogin: () => void
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

const TOTAL_FRAMES_1 = 142  // frames0 starts at frame_0003 (0,1,2 deleted)
const TOTAL_FRAMES_2 = 145
const frames0_OFFSET = 3    // first file is frame_0003.jpg
const LERP_FACTOR = 0.92

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v))
}

const catalogs = [
  {
    title: 'Catálogo Femenino',
    description: 'Fragancias exclusivas que realzan la esencia femenina. Descubre notas florales, orientales y frescas.',
    href: '/OK%20CATALOGO%20PERFUM%20MUA%20FEMENINO%20OK%20(1).pdf',
    gradient: 'from-rose-500 to-pink-600',
    icon: '🌸',
  },
  {
    title: 'Catálogo Masculino',
    description: 'Aromas que definen carácter y presencia. Maderas, especias y cítricos para el hombre moderno.',
    href: '/OK%20CATALOGO%20PERFUM%20MUA%20MASCULINO%20OK.pdf',
    gradient: 'from-slate-700 to-zinc-800',
    icon: '🖤',
  },
  {
    title: 'Catálogo Unisex',
    description: 'Fragancias versátiles sin género. Para quienes buscan aromas únicos que trasciendan lo convencional.',
    href: '/OK%20CATALOGO%20UNISEX%20PERFUM%20MUA%20OK.pdf',
    gradient: 'from-amber-500 to-yellow-600',
    icon: '✨',
  },
]

const values = [
  { icon: Heart, label: 'Amor', desc: 'Pasión por cada fragancia que ofrecemos' },
  { icon: Sparkles, label: 'Pasión', desc: 'Dedicación en cada experiencia de compra' },
  { icon: Award, label: 'Respeto', desc: 'Valoramos a cada uno de nuestros clientes' },
  { icon: Star, label: 'Responsabilidad Social', desc: 'Comprometidos con nuestra comunidad' },
]

function getFramePath(folder: string, index: number, offset = 0): string {
  const padded = String(index + offset).padStart(4, '0')
  return `/image/${folder}/frame_${padded}.jpg`
}

// ====== Storefront product type ======
interface StorefrontProduct {
  id: number
  name: string
  category: string
  brand: string
  description: string
  salePrice: number
  imageUrl: string
  stock: number
  color?: string
  size?: string
  gender?: string
}

export function LandingPage({ onGoToLogin }: LandingPageProps) {
  // ---- Scroll-driven frame animation state ----
  const [frame1Index, setFrame1Index] = useState(0)
  const [frame2Index, setFrame2Index] = useState(0)
  const [hero1Opacity, setHero1Opacity] = useState(1)
  const [hero1Folder, setHero1Folder] = useState('frames0')
  const [hero2ContentOpacity, setHero2ContentOpacity] = useState(0)
  const [hero2ContentY, setHero2ContentY] = useState(40)
  const hero1Ref = useRef<HTMLDivElement>(null)
  const hero2Ref = useRef<HTMLDivElement>(null)
  const canvas1Ref = useRef<HTMLCanvasElement>(null)
  const canvas2Ref = useRef<HTMLCanvasElement>(null)
  const [showCatalog, setShowCatalog] = useState(false)

  const frames0Ref = useRef<HTMLImageElement[]>([])
  const frames2Ref = useRef<HTMLImageElement[]>([])
  const animatedFrame1 = useRef(0)
  const animatedFrame2 = useRef(0)
  const targetFrame1 = useRef(0)
  const targetFrame2 = useRef(0)
  const rafId = useRef<number>(0)
  const rafRunning = useRef(false)
  const tickRef = useRef<(() => void) | null>(null)
  // performance helpers — recuerdan el último frame dibujado para evitar redraws innecesarios
  const lastDrawnFrame1 = useRef<number | null>(null)
  const lastDrawnFrame2 = useRef<number | null>(null)

  // ====== STOREFRONT STATE ======
  const [products, setProducts] = useState<StorefrontProduct[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [stores, setStores] = useState<{ id: string; name: string; slug: string; businessType: string | null }[]>([])
  const [selectedStore, setSelectedStore] = useState<string>('all')

  // ====== DECANT STATE ======
  const [showDecantModal, setShowDecantModal] = useState(false)
  const [decantProduct, setDecantProduct] = useState<StorefrontProduct | null>(null)
  const [decantSize, setDecantSize] = useState<'5ml' | '10ml'>('5ml')
  const [selectedPerfumeId, setSelectedPerfumeId] = useState<string>('')

  const handleConfirmDecant = () => {
    if (!decantProduct) return
    if (!selectedPerfumeId) {
      alert('Por favor selecciona un perfume')
      return
    }
    const perfumeName = products.find(p => String(p.id) === selectedPerfumeId)?.name || 'Desconocido'

    agregarAlCarrito(decantProduct, {
      isDecant: true,
      size: decantSize,
      perfume: perfumeName
    })
    setShowDecantModal(false)
    setDecantSize('5ml')
    setSelectedPerfumeId('')
  }

  // ====== CART STATE ======
  const [carrito, setCarrito] = useState<ProductoCarrito[]>([])
  const [showCart, setShowCart] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false) // New state for mobile menu

  // ====== CHECKOUT STATE ======
  const [formData, setFormData] = useState<PedidoForm>({
    nombre: '', telefono: '', email: '', cedula: '',
    departamento: '', municipio: '', direccion: '', barrio: '', notas: '',
  })
  const [enviandoEmail, setEnviandoEmail] = useState(false)
  const [mostrarModalExito, setMostrarModalExito] = useState(false)
  const [pedidoConfirmado, setPedidoConfirmado] = useState<PedidoConfirmado | null>(null)

  // ====== CART FUNCTIONS ======
  const totalCarrito = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0)
  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0)

  // ====== COUPON STATE ======
  const [cuponCodigo, setCuponCodigo] = useState('')
  const [cuponAplicado, setCuponAplicado] = useState<CuponValidacion | null>(null)
  const totalConDescuento = cuponAplicado?.valido && cuponAplicado?.descuento
    ? Math.max(0, totalCarrito - cuponAplicado.descuento)
    : totalCarrito

  const handleValidarCupon = async (codigo: string, subtotal: number): Promise<CuponValidacion> => {
    try {
      const res = await fetch(`${API_URL}/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: codigo, subtotal }),
      })
      const json = await res.json()
      if (json.success && json.data) {
        return json.data as CuponValidacion
      }
      return { valido: false, mensaje: 'Error al validar cupón' }
    } catch {
      return { valido: false, mensaje: 'Error de conexión al validar cupón' }
    }
  }

  const handleAplicarCupon = (codigo: string, resultado: CuponValidacion) => {
    setCuponCodigo(codigo)
    setCuponAplicado(resultado)
  }

  const handleRemoverCupon = () => {
    setCuponCodigo('')
    setCuponAplicado(null)
  }

  // ====== FETCH PRODUCTS ======
  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true)
      try {
        const storeParam = selectedStore !== 'all' ? `&store=${selectedStore}` : ''
        const res = await fetch(`${API_URL}/storefront/products?limit=50${storeParam}`)
        const json = await res.json()
        if (json.success && json.data?.products) {
          setProducts(json.data.products)
        }
      } catch (e) {
        console.error('Error fetching storefront products:', e)
      } finally {
        setLoadingProducts(false)
      }
    }
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/storefront/categories`)
        const json = await res.json()
        if (json.success && json.data) {
          setCategories(json.data)
        }
      } catch (e) {
        console.error('Error fetching categories:', e)
      }
    }
    fetchProducts()
    fetchCategories()
  }, [selectedStore])

  // ====== FETCH STORES ======
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await fetch(`${API_URL}/storefront/stores`)
        const json = await res.json()
        if (json.success && json.data) {
          setStores(json.data)
        }
      } catch (e) {
        console.error('Error fetching stores:', e)
      }
    }
    fetchStores()
  }, [])



  const agregarAlCarrito = (product: StorefrontProduct, options?: { size?: string, perfume?: string, isDecant?: boolean }) => {
    // Intercept Decant products
    if (!options?.isDecant && (product.category === 'DECANTS' || product.category === 'decants')) {
      setDecantProduct(product)

      // Auto-detect size from product details
      let detectedSize: '5ml' | '10ml' | null = null
      const lowerName = product.name.toLowerCase()
      const lowerSize = product.size?.toLowerCase() || ''

      if (lowerSize.includes('5ml') || lowerSize.includes('5 ml') || lowerName.includes('5ml') || lowerName.includes('5 ml')) {
        detectedSize = '5ml'
      } else if (lowerSize.includes('10ml') || lowerSize.includes('10 ml') || lowerName.includes('10ml') || lowerName.includes('10 ml')) {
        detectedSize = '10ml'
      }

      if (detectedSize) {
        setDecantSize(detectedSize)
      } else {
        setDecantSize('5ml') // Default
      }

      setShowDecantModal(true)
      return
    }

    setCarrito(prev => {
      // Generate unique tempId for cart item
      // For standard products, use ID string. For Decants, composite key.
      const newItemTempId = options?.isDecant
        ? `${product.id}-${options.size}-${options.perfume}`
        : String(product.id)

      const existingIndex = prev.findIndex(p => (p.tempId || String(p.id)) === newItemTempId)

      if (existingIndex >= 0) {
        const newCart = [...prev]
        newCart[existingIndex] = {
          ...newCart[existingIndex],
          cantidad: newCart[existingIndex].cantidad + 1
        }
        return newCart
      }

      return [...prev, {
        id: product.id,
        tempId: newItemTempId,
        nombre: options?.isDecant ? `${product.name} (${options.size})` : product.name,
        precio: product.salePrice,
        cantidad: 1,
        imagen: product.imageUrl || '',
        tallaSeleccionada: options?.size,
        perfumeSeleccionado: options?.perfume,
      }]
    })
    setShowCart(true) // Always show cart after adding
  }

  const actualizarCantidad = (id: number, cambio: number, tempId?: string) => {
    setCarrito(prev =>
      prev.map(p => {
        // Match by tempId if available (preferred), otherwise fallback to id
        const match = tempId ? (p.tempId === tempId) : (p.id === id)
        if (match) {
          const nueva = p.cantidad + cambio
          return nueva > 0 ? { ...p, cantidad: nueva } : p
        }
        return p
      }).filter(p => p.cantidad > 0)
    )
  }

  const removerProducto = (producto: ProductoCarrito) => {
    setCarrito(prev => prev.filter(p => {
      if (producto.tempId) return p.tempId !== producto.tempId
      return p.id !== producto.id
    }))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => {
      if (name === 'departamento') {
        return { ...prev, departamento: value, municipio: '' }
      }
      return { ...prev, [name]: value }
    })
  }

  const handleConfirmarPedido = async () => {
    if (!formData.nombre || !formData.telefono || !formData.email || !formData.cedula || !formData.departamento || !formData.municipio || !formData.direccion) {
      alert('Por favor completa todos los campos obligatorios')
      return
    }
    if (carrito.length === 0) {
      alert('El carrito está vacío')
      return
    }

    setEnviandoEmail(true)
    try {
      // 1. Create order in backend
      const orderPayload: Record<string, any> = {
        customerName: formData.nombre,
        customerPhone: formData.telefono,
        customerEmail: formData.email,
        customerCedula: formData.cedula,
        department: formData.departamento,
        municipality: formData.municipio,
        address: formData.direccion,
        neighborhood: formData.barrio,
        notes: formData.notas,
        items: carrito.map(p => ({
          productId: String(p.id),
          productName: p.nombre,
          quantity: p.cantidad,
          unitPrice: p.precio,
          productImage: p.imagen || undefined,
        })),
      }

      // Include discount info if coupon was applied
      if (cuponAplicado?.valido && cuponAplicado?.descuento) {
        orderPayload.discount = cuponAplicado.descuento
        orderPayload.couponCode = cuponCodigo
      }

      let numeroPedido = `PM-${Date.now().toString(36).toUpperCase()}`
      try {
        const orderRes = await fetch(`${API_URL}/orders/public`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload),
        })
        const orderJson = await orderRes.json()
        if (orderJson.success && orderJson.data?.orderNumber) {
          numeroPedido = orderJson.data.orderNumber
        }
        // Register coupon usage
        if (cuponCodigo && cuponAplicado?.valido) {
          try {
            await fetch(`${API_URL}/coupons/use`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ code: cuponCodigo }),
            })
          } catch (e2) {
            console.error('Error registering coupon use:', e2)
          }
        }
      } catch (e) {
        console.error('Error saving order to backend:', e)
      }

      const fecha = new Date().toLocaleDateString('es-CO', {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
      })

      const pedido: PedidoConfirmado = {
        numeroPedido,
        email: formData.email,
        productos: carrito,
        total: totalConDescuento,
        fecha,
      }

      setPedidoConfirmado(pedido)
      setMostrarModalExito(true)
    } catch (error) {
      console.error('Error al procesar pedido:', error)
      alert('Error al procesar el pedido. Intenta de nuevo.')
    } finally {
      setEnviandoEmail(false)
    }
  }

  const handleCerrarModal = () => {
    setMostrarModalExito(false)
    setPedidoConfirmado(null)
    setCarrito([])
    setShowCheckout(false)
    setCuponCodigo('')
    setCuponAplicado(null)
    setFormData({
      nombre: '', telefono: '', email: '', cedula: '',
      departamento: '', municipio: '', direccion: '', barrio: '', notas: '',
    })
  }

  // ====== FILTERED PRODUCTS ======
  const filteredProducts = products.filter(p => {
    const matchCategory = selectedCategory === 'all' || p.category === selectedCategory
    const matchSearch = !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchCategory && matchSearch
  })

  // ---- Frame preload (progressive, idle-friendly) ----
  useEffect(() => {
    // Precarga prioritaria: primero los primeros 8 frames, luego el resto en lotes pequeños
    const loadFrames = (folder: string, store: React.MutableRefObject<HTMLImageElement[]>, count: number, offset = 0) => {
      const imgs: HTMLImageElement[] = new Array(count);
      const batchSize = 3; // aún más pequeño para evitar bloqueos
      // Precarga prioritaria de los primeros 8 frames
      for (let i = 0; i < Math.min(8, count); i++) {
        const img = new Image();
        try { img.decoding = 'async'; } catch (e) {}
        img.src = getFramePath(folder, i, offset);
        img.decode?.().catch(() => {});
        imgs[i] = img;
      }
      store.current = imgs;
      // El resto en lotes pequeños y en idle
      const schedule = (cb: () => void) => {
        if ((window as any).requestIdleCallback) {
          (window as any).requestIdleCallback(cb, { timeout: 500 });
        } else {
          setTimeout(cb, 200);
        }
      };
      const loadBatch = (start: number) => {
        const end = Math.min(start + batchSize, count);
        for (let i = start; i < end; i++) {
          if (imgs[i]) continue; // ya precargado
          const img = new Image();
          try { img.decoding = 'async'; } catch (e) {}
          img.src = getFramePath(folder, i, offset);
          img.decode?.().catch(() => {});
          imgs[i] = img;
        }
        store.current = imgs;
        if (end < count) schedule(() => loadBatch(end));
      };
      if (count > 8) schedule(() => loadBatch(8));
    };
    // Detect mobile para frames0 vs frames0c
    const isMobile = window.innerWidth < 768;
    const frames0Folder = isMobile ? 'frames0c' : 'frames0';
    setHero1Folder(frames0Folder);
    loadFrames(frames0Folder, frames0Ref, TOTAL_FRAMES_1, frames0_OFFSET);
    loadFrames('frames2', frames2Ref, TOTAL_FRAMES_2);
  }, []);

  const drawFrame = useCallback((canvas: HTMLCanvasElement | null, frames: HTMLImageElement[], index: number,
    options: { fit: 'cover' | 'contain', alignY?: 'top' | 'center' | 'bottom' } | boolean = false) => {
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const img = frames[Math.round(index)]
    if (!img || !img.complete) return

    let fit = 'cover'
    let alignY = 'center'
    if (typeof options === 'boolean') {
      fit = options ? 'contain' : 'cover'
    } else {
      fit = options.fit
      alignY = options.alignY || 'center'
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2) // cap DPR to avoid excessively large canvas sizes on very high‑DPI screens
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.scale(dpr, dpr)
    }

    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, w, h)

    const imgRatio = img.naturalWidth / img.naturalHeight
    const canvasRatio = w / h

    if (fit === 'contain') {
      let dw: number, dh: number, dx: number, dy: number
      if (imgRatio > canvasRatio) {
        dw = w; dh = w / imgRatio; dx = 0
      } else {
        dh = h; dw = h * imgRatio; dx = (w - dw) / 2
      }

      if (alignY === 'top') dy = 0
      else if (alignY === 'bottom') dy = h - dh
      else dy = (h - dh) / 2

      ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, dx, dy, dw, dh)
    } else {
      let sw = img.naturalWidth, sh = img.naturalHeight, sx = 0, sy = 0
      if (imgRatio > canvasRatio) {
        // crop horizontal
        sw = img.naturalHeight * canvasRatio
        sx = (img.naturalWidth - sw) / 2
      } else {
        // crop vertical
        sh = img.naturalWidth / canvasRatio
        sy = (img.naturalHeight - sh) / 2
      }
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h)
    }
  }, [])

  useEffect(() => {
    const tick = () => {
      rafRunning.current = true
      // LERP smoothing
      animatedFrame1.current += (targetFrame1.current - animatedFrame1.current) * LERP_FACTOR
      animatedFrame2.current += (targetFrame2.current - animatedFrame2.current) * LERP_FACTOR

      const rounded1 = Math.round(animatedFrame1.current)
      const rounded2 = Math.round(animatedFrame2.current)
      const isMobile = window.innerWidth < 768

      const opts1 = isMobile
        ? { fit: 'contain' as const, alignY: 'bottom' as const }
        : { fit: 'cover' as const }

      const opts2 = isMobile
        ? { fit: 'contain' as const, alignY: 'top' as const }
        : { fit: 'cover' as const }

      // LOG: Estado de animación y frames
      if (process.env.NODE_ENV !== 'production') {
        console.log('[tick] frame1', { animated: animatedFrame1.current, target: targetFrame1.current, rounded1, framesLoaded: frames0Ref.current.length });
        console.log('[tick] frame2', { animated: animatedFrame2.current, target: targetFrame2.current, rounded2, framesLoaded: frames2Ref.current.length });
      }

      // ONLY redraw / setState when the visible (rounded) frame actually changes.
      if (rounded1 !== lastDrawnFrame1.current) {
        lastDrawnFrame1.current = rounded1
        setFrame1Index(rounded1)
        drawFrame(canvas1Ref.current, frames0Ref.current, animatedFrame1.current, opts1)
      }

      if (rounded2 !== lastDrawnFrame2.current) {
        lastDrawnFrame2.current = rounded2
        setFrame2Index(rounded2)
        drawFrame(canvas2Ref.current, frames2Ref.current, animatedFrame2.current, opts2)
      }

      // Decide si continuar el loop: si la diferencia es mínima, parar RAF para ahorrar CPU
      const need1 = Math.abs(targetFrame1.current - animatedFrame1.current) > 0.003
      const need2 = Math.abs(targetFrame2.current - animatedFrame2.current) > 0.003
      if (need1 || need2) {
        rafId.current = requestAnimationFrame(tick)
      } else {
        rafRunning.current = false
        rafId.current = 0
      }
    }

    // expose tick so other effects (scroll) puedan reiniciarlo
    tickRef.current = tick
    // start once (will stop when settled)
    rafId.current = requestAnimationFrame(tick)
    return () => { if (rafId.current) cancelAnimationFrame(rafId.current) }
  }, [drawFrame])

  useEffect(() => {
    // Mejor throttle: solo 1 update cada 40ms (25fps máx)
    let lastCall = 0;
    let rafPending = false;
    const handle = () => {
      rafPending = false;
      const now = performance.now();
      if (now - lastCall < 40) return; // 25fps máx
      lastCall = now;
      if (hero1Ref.current) {
        const rect = hero1Ref.current.getBoundingClientRect();
        const sectionH = hero1Ref.current.offsetHeight;
        const scrolled = Math.max(-rect.top - 64, 0);
        const progress = clamp(scrolled / (sectionH - window.innerHeight - 64), 0, 1);
        const newTarget = clamp(Math.floor(progress * (TOTAL_FRAMES_1 - 1)), 0, TOTAL_FRAMES_1 - 1);
        const prevTarget1 = targetFrame1.current;
        if (process.env.NODE_ENV !== 'production') {
          console.log('[scroll] hero1', { scrolled, progress, newTarget, prevTarget1 });
        }
        if (prevTarget1 !== newTarget) targetFrame1.current = newTarget;
        const fadeStart = 0.65;
        const textOpacity = progress < fadeStart ? 1 : clamp(1 - easeOutCubic((progress - fadeStart) / (1 - fadeStart)), 0, 1);
        setHero1Opacity(textOpacity);
        // Si cambió el target y la animación no está corriendo, reiniciar RAF
        if (prevTarget1 !== newTarget && !rafRunning.current && tickRef.current) {
          rafId.current = requestAnimationFrame(tickRef.current);
        }
      }
      if (hero2Ref.current) {
        const rect = hero2Ref.current.getBoundingClientRect();
        const sectionH = hero2Ref.current.offsetHeight;
        const scrolled = -rect.top;
        const progress = clamp(scrolled / ((sectionH - window.innerHeight) * 0.65), 0, 1);
        const newTarget = clamp(Math.floor(progress * (TOTAL_FRAMES_2 - 1)), 0, TOTAL_FRAMES_2 - 1);
        const prevTarget2 = targetFrame2.current;
        if (process.env.NODE_ENV !== 'production') {
          console.log('[scroll] hero2', { scrolled, progress, newTarget, prevTarget2 });
        }
        if (prevTarget2 !== newTarget) targetFrame2.current = newTarget;
        const viewportEntry = clamp(1 - (rect.top / window.innerHeight), 0, 1);
        const revealProgress = clamp(viewportEntry * 2, 0, 1);
        const eased = easeOutCubic(revealProgress);
        setHero2ContentOpacity(eased);
        setHero2ContentY(40 * (1 - eased));
        if (prevTarget2 !== newTarget && !rafRunning.current && tickRef.current) {
          rafId.current = requestAnimationFrame(tickRef.current);
        }
      }
    };
    const onScroll = () => {
      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(handle);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    handle();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToDiscover = () => {
    if (hero2Ref.current) {
      const top = hero2Ref.current.getBoundingClientRect().top + window.scrollY
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  const scrollToCatalog = () => {
    setShowCatalog(true)
    setTimeout(() => {
      document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const scrollToAbout = () => {
    document.getElementById('nosotros')?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToContact = () => {
    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToPerfumes = () => {
    document.getElementById('perfumes')?.scrollIntoView({ behavior: 'smooth' })
  }

  // ====== IF CHECKOUT VIEW IS ACTIVE ======
  if (showCheckout) {
    return (
      <CheckoutView
        carrito={carrito}
        totalCarrito={totalCarrito}
        formData={formData}
        enviandoEmail={enviandoEmail}
        mostrarModalExito={mostrarModalExito}
        pedidoConfirmado={pedidoConfirmado}
        cuponCodigo={cuponCodigo}
        cuponAplicado={cuponAplicado}
        totalConDescuento={totalConDescuento}
        onValidarCupon={handleValidarCupon}
        onAplicarCupon={handleAplicarCupon}
        onRemoverCupon={handleRemoverCupon}
        onInputChange={handleInputChange}
        onActualizarCantidad={actualizarCantidad}
        onRemoverProducto={removerProducto}
        onConfirmar={handleConfirmarPedido}
        onCerrarModal={handleCerrarModal}
        onVolver={() => setShowCheckout(false)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden" style={{ scrollBehavior: 'smooth' }}>
      {/* ========== NAVBAR ========== */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/60 border-b border-white/10 transition-all duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-2 text-white/70 hover:text-white transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="text-xl font-light tracking-[0.3em] text-white uppercase">Perfum Mua</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm tracking-wide">
            <button onClick={scrollToDiscover} className="text-white/60 hover:text-white transition-colors uppercase text-xs tracking-[0.2em]">Descubre</button>
            <button onClick={scrollToPerfumes} className="text-white/60 hover:text-white transition-colors uppercase text-xs tracking-[0.2em]">Perfumes</button>
            <button onClick={() => { setShowCatalog(true); setTimeout(() => document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' }), 100) }} className="text-white/60 hover:text-white transition-colors uppercase text-xs tracking-[0.2em]">Catálogo</button>
            <button onClick={scrollToAbout} className="text-white/60 hover:text-white transition-colors uppercase text-xs tracking-[0.2em]">Nosotros</button>
            <button onClick={scrollToContact} className="text-white/60 hover:text-white transition-colors uppercase text-xs tracking-[0.2em]">Contacto</button>
          </div>
          <div className="flex items-center gap-3">
            {totalItems > 0 && (
              <button
                onClick={() => setShowCart(true)}
                className="relative p-2 text-white/70 hover:text-white transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-amber-500 text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              </button>
            )}
            <button
              onClick={onGoToLogin}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 flex items-center justify-center transition-all duration-300 group"
              title="Ingresar"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white/70 group-hover:text-white transition-colors">
                <circle cx="12" cy="8" r="4" />
                <path d="M20 21a8 8 0 1 0-16 0" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* ========== MOBILE SIDEBAR MENU ========== */}
      {mobileMenuOpen && (
        <>
          <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed top-0 left-0 h-full w-[280px] bg-zinc-950 border-r border-white/10 z-[70] p-6 animate-in slide-in-from-left duration-300 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <span className="text-lg font-light tracking-[0.3em] text-white uppercase">Perfum Mua</span>
              <button onClick={() => setMobileMenuOpen(false)} className="text-white/50 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex flex-col gap-6 text-sm font-light tracking-widest text-white/70">
              <button onClick={() => { scrollToDiscover(); setMobileMenuOpen(false) }} className="text-left py-2 hover:text-amber-400 transition-colors uppercase border-b border-white/5">Descubre</button>
              <button onClick={() => { scrollToPerfumes(); setMobileMenuOpen(false) }} className="text-left py-2 hover:text-amber-400 transition-colors uppercase border-b border-white/5">Perfumes</button>
              <button onClick={() => { setShowCatalog(true); setMobileMenuOpen(false); setTimeout(() => document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' }), 100) }} className="text-left py-2 hover:text-amber-400 transition-colors uppercase border-b border-white/5">Catálogo</button>
              <button onClick={() => { scrollToAbout(); setMobileMenuOpen(false) }} className="text-left py-2 hover:text-amber-400 transition-colors uppercase border-b border-white/5">Nosotros</button>
              <button onClick={() => { scrollToContact(); setMobileMenuOpen(false) }} className="text-left py-2 hover:text-amber-400 transition-colors uppercase border-b border-white/5">Contacto</button>
            </div>
          </div>
        </>
      )}

      {/* ========== HERO - FRAME 1 ========== */}
      <section ref={hero1Ref} className="relative" style={{ height: '140vh', marginBottom: 0 }}>
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <canvas ref={canvas1Ref} className="absolute inset-0 w-full h-full" />
          {frame1Index === 0 && (
            // eslint-disable-next-line @next/next/no-img-element
            <img decoding="async" src={getFramePath(hero1Folder, 0, frames0_OFFSET)} alt="Perfum Mua — Presentación" className="absolute inset-0 w-full h-full object-cover bg-black" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/40 pointer-events-none" />

          {/* Content overlay — DOS BOTONES PRINCIPALES */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pt-60">
            <div
              className="space-y-6 max-w-3xl bg-black/70 rounded-2xl shadow-2xl px-6 py-10 border border-white/10 backdrop-blur-md"
              style={{
                opacity: hero1Opacity,
                transform: `translateY(${(1 - hero1Opacity) * -30}px) scale(${0.95 + hero1Opacity * 0.05})`,
                transition: 'transform 0.1s cubic-bezier(0.16, 1, 0.3, 1)',
                willChange: 'opacity, transform',
                boxShadow: '0 8px 32px 0 rgba(0,0,0,0.45)',
              }}
            >
              <p className="text-amber-400/90 uppercase tracking-[0.5em] text-xs sm:text-sm font-semibold drop-shadow-lg"></p>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extralight tracking-tight leading-tight drop-shadow-xl">
                El Arte de<br />
                <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent font-light drop-shadow-lg">
                  Dejar Huella
                </span>
              </h1>
              <p className="text-white/80 text-base sm:text-lg font-light max-w-xl mx-auto leading-relaxed drop-shadow-lg">
                Descubre la esencia que define tu identidad. Perfumes exclusivos que dejan huella.
              </p>

              {/* ====== DOS BOTONES PRINCIPALES ====== */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <a
                  href="https://www.google.com/maps/place/Perfum+Mua+Perfumer%C3%ADa/@1.14572,-76.647563,16z/data=!4m14!1m7!3m6!1s0x8e28b3f8cce25647:0xa825c168e298a3e6!2sPerfum+Mua+Perfumer%C3%ADa!8m2!3d1.14572!4d-76.6475632!16s%2Fg%2F11tf33r38x!3m5!1s0x8e28b3f8cce25647:0xa825c168e298a3e6!8m2!3d1.14572!4d-76.6475632!16s%2Fg%2F11tf33r38x?hl=es&entry=ttu&g_ep=EgoyMDI2MDIxMS4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:border-amber-400/50 text-white px-8 py-4 transition-all duration-500 uppercase text-xs tracking-[0.2em] font-light shadow-md"
                  title="Perfum Mua Perfumería, Carrera 8 #8-32, Cl. 7 #5-59 Local 102, Mocoa, Putumayo"
                >
                  <MapPin className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                  <span>
                    Visítanos<br />
                    <span className="block text-[10px] text-white/80 font-normal normal-case mt-1">Carrera 8 #8-32, Cl. 7 #5-59 Local 102, Mocoa, Putumayo</span>
                  </span>
                  <ArrowRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                </a>
                <button
                  onClick={scrollToPerfumes}
                  className="group inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black px-8 py-4 transition-all duration-500 uppercase text-xs tracking-[0.2em] font-medium hover:shadow-lg hover:shadow-amber-500/30 shadow-md"
                >
                  <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Ver Perfumes</span>
                  <ChevronDown className="w-4 h-4 animate-bounce" />
                </button>
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
            <div className="w-px h-16 bg-white/10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full bg-amber-400/60 transition-none" style={{ height: `${(frame1Index / (TOTAL_FRAMES_1 - 1)) * 100}%` }} />
            </div>
          </div>
        </div>
      </section>

      {/* ========== HERO 2 - FRAME 2 ========== */}
      <section ref={hero2Ref} className="relative bg-black" style={{ height: '150vh', marginTop: 0 }}>
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
          <canvas ref={canvas2Ref} className="absolute inset-0 w-full h-full" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            decoding="async"
            src={getFramePath('frames2', 0)}
            alt="Perfum Mua — Lo mejor"
            className="absolute inset-0 w-full h-full object-contain bg-black"
            style={{ opacity: frame2Index <= 1 ? 1 : 0, transition: 'opacity 0.3s ease' }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />

          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div
                className="max-w-lg space-y-8"
                style={{ opacity: hero2ContentOpacity, transform: `translateY(${hero2ContentY}px)`, willChange: 'opacity, transform' }}
              >
                <div className="space-y-2">
                  <p className="text-amber-400/80 uppercase tracking-[0.5em] text-xs font-light">Lo Mejor de</p>
                  <h2 className="text-3xl sm:text-5xl font-extralight tracking-tight">Perfum Mua</h2>
                </div>

                <div className="space-y-5 text-white/70 text-sm sm:text-base font-light leading-relaxed">
                  {[
                    { icon: Sparkles, text: 'Fragancias únicas para una experiencia inolvidable', delay: 0 },
                    { icon: Star, text: '10 años de experiencia en el mercado perfumero', delay: 0.05 },
                    { icon: Heart, text: 'Asesoría personalizada para encontrar tu aroma ideal', delay: 0.1 },
                    { icon: Award, text: 'La más alta calidad en cada producto', delay: 0.15 },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3"
                      style={{
                        opacity: clamp((hero2ContentOpacity - item.delay) / (1 - item.delay), 0, 1),
                        transform: `translateX(${20 * (1 - clamp((hero2ContentOpacity - item.delay) / (1 - item.delay), 0, 1))}px)`,
                        willChange: 'opacity, transform',
                      }}
                    >
                      <item.icon className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <p>{item.text}</p>
                    </div>
                  ))}
                </div>

                <p
                  className="text-white/50 text-sm font-light italic border-l-2 border-amber-500/30 pl-4"
                  style={{ opacity: clamp((hero2ContentOpacity - 0.2) / 0.8, 0, 1) }}
                >
                  &ldquo;Nuestro compromiso va más allá del perfume: te guiamos para encontrar ese aroma que hable por ti, que refleje tu personalidad y deje una huella inolvidable.&rdquo;
                </p>

                <div style={{ opacity: clamp((hero2ContentOpacity - 0.3) / 0.7, 0, 1), transform: `translateY(${10 * (1 - clamp((hero2ContentOpacity - 0.3) / 0.7, 0, 1))}px)` }}>
                  <Button
                    onClick={scrollToPerfumes}
                    size="lg"
                    className="bg-amber-500 hover:bg-amber-400 text-black rounded-none uppercase tracking-[0.2em] text-xs px-10 h-12 mt-4 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-500"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Ver Perfumes
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
            <div className="w-px h-16 bg-white/10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full bg-amber-400/60 transition-none" style={{ height: `${(frame2Index / (TOTAL_FRAMES_2 - 1)) * 100}%` }} />
            </div>
          </div>
        </div>
      </section>

      {/* ========== TAGLINE SECTION ========== */}
      <RevealSection className="py-24 sm:py-32 bg-gradient-to-b from-black via-zinc-950 to-black relative">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-rose-500 rounded-full blur-[120px]" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <p className="text-amber-400/60 uppercase tracking-[0.5em] text-xs">Perfum Mua</p>
          <h2 className="text-3xl sm:text-5xl font-extralight tracking-tight leading-tight">
            ¡Perfumes exclusivos que<br />
            <span className="bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">dejan huella!</span>
          </h2>
          <p className="text-white/50 text-base sm:text-lg font-light max-w-2xl mx-auto leading-relaxed">
            Descubre fragancias únicas para una experiencia inolvidable. ✨ Encuentra el aroma que te define y deja tu marca en cada momento. 💫
          </p>
          <div className="flex items-center justify-center gap-8 pt-4">
            <CountUpStat value={10} suffix="+" label="Años" />
            <div className="w-px h-12 bg-white/10" />
            <CountUpStat value={100} suffix="+" label="Fragancias" />
            <div className="w-px h-12 bg-white/10" />
            <CountUpStat value={1000} suffix="+" label="Clientes" />
          </div>
        </div>
      </RevealSection>

      {/* ========== PERFUMES / TIENDA ONLINE ========== */}
      <RevealSection id="perfumes" className="py-24 sm:py-32 bg-zinc-950 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <p className="text-amber-400/60 uppercase tracking-[0.5em] text-xs">Tienda Online</p>
            <h2 className="text-3xl sm:text-4xl font-extralight tracking-tight">Nuestros Perfumes</h2>
            <p className="text-white/40 text-sm font-light max-w-md mx-auto">
              Explora nuestra colección y añade tus favoritos al carrito. Envío a todo Colombia.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10 max-w-3xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                placeholder="Buscar perfume..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 text-white placeholder-white/30 font-light text-sm focus:border-amber-500/50 focus:outline-none transition-colors rounded-none"
              />
            </div>
            {stores.length > 1 && (
              <select
                value={selectedStore}
                onChange={e => setSelectedStore(e.target.value)}
                className="px-4 py-3 bg-white/5 border border-white/10 text-white text-sm font-light focus:border-amber-500/50 focus:outline-none transition-colors rounded-none appearance-none cursor-pointer"
              >
                <option value="all" className="bg-zinc-900">Todas las tiendas</option>
                {stores.map(store => (
                  <option key={store.id} value={store.slug} className="bg-zinc-900">{store.name}</option>
                ))}
              </select>
            )}
          </div>
          <div className="flex gap-2 flex-wrap justify-center mb-10">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 text-xs uppercase tracking-wider border transition-all duration-300 ${selectedCategory === 'all'
                ? 'bg-amber-500 text-black border-amber-500'
                : 'bg-transparent text-white/50 border-white/10 hover:border-white/30'
                }`}
            >
              Todos
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs uppercase tracking-wider border transition-all duration-300 ${selectedCategory === cat
                  ? 'bg-amber-500 text-black border-amber-500'
                  : 'bg-transparent text-white/50 border-white/10 hover:border-white/30'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          {loadingProducts ? (
            <div className="text-center py-20">
              <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-white/40 text-sm font-light">Cargando perfumes...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <Sparkles className="w-12 h-12 text-white/10 mx-auto mb-4" />
              <p className="text-white/40 text-sm font-light">
                {products.length === 0
                  ? 'Próximamente — Nuestros perfumes estarán disponibles aquí.'
                  : 'No se encontraron perfumes con ese criterio.'}
              </p>
              {products.length === 0 && (
                <button onClick={scrollToCatalog} className="mt-4 text-amber-400 text-sm font-light hover:text-amber-300 transition-colors underline underline-offset-4">
                  Ver catálogos en PDF
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map(product => {
                const inCart = carrito.find(c => c.id === product.id)
                return (
                  <div key={product.id} className="group relative bg-white/5 border border-white/10 hover:border-amber-500/30 transition-all duration-500 overflow-hidden">
                    {/* Product Image */}
                    <div className="relative aspect-square bg-black/50 overflow-hidden">
                      {product.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={ensureAbsoluteUrl(product.imageUrl)} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><Sparkles className="w-8 h-8 text-white/10" /></div>
                      )}
                      {/* Quick Add overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <button
                          onClick={() => agregarAlCarrito(product)}
                          className="bg-amber-500 hover:bg-amber-400 text-black px-6 py-3 text-xs uppercase tracking-wider font-medium transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 flex items-center gap-2"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          {inCart ? `En carrito (${inCart.cantidad})` : 'Agregar'}
                        </button>
                      </div>
                      {product.brand && (
                        <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm px-2 py-1 text-[10px] text-white/70 uppercase tracking-wider">{product.brand}</div>
                      )}
                    </div>
                    {/* Product Info */}
                    <div className="p-3 sm:p-4 space-y-1">
                      <h3 className="text-sm font-light text-white truncate">{product.name}</h3>
                      {product.description && <p className="text-xs text-white/30 font-light line-clamp-2">{product.description}</p>}
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-amber-400 font-light text-sm">{formatCOP(product.salePrice)}</span>
                        <button onClick={() => agregarAlCarrito(product)} className="p-2 text-white/30 hover:text-amber-400 transition-colors" title="Agregar al carrito">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </RevealSection>

      {/* ========== CATÁLOGO ========== */}
      {showCatalog && (
        <section id="catalogo" className="py-24 sm:py-32 bg-zinc-950 relative">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 space-y-4">
              <p className="text-amber-400/60 uppercase tracking-[0.5em] text-xs">Explora</p>
              <h2 className="text-3xl sm:text-4xl font-extralight tracking-tight">Nuestros Catálogos</h2>
              <p className="text-white/40 text-sm font-light max-w-md mx-auto">
                Descarga nuestros catálogos y descubre toda nuestra colección de fragancias exclusivas.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {catalogs.map((catalog, i) => (
                <a key={i} href={catalog.href} target="_blank" rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-amber-500/30 transition-all duration-500 hover:-translate-y-2">
                  <div className={`absolute inset-0 bg-gradient-to-br ${catalog.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  <div className="p-8 space-y-6">
                    <span className="text-4xl">{catalog.icon}</span>
                    <div className="space-y-2">
                      <h3 className="text-lg font-light tracking-wide text-white">{catalog.title}</h3>
                      <p className="text-sm text-white/40 font-light leading-relaxed">{catalog.description}</p>
                    </div>
                    <div className="flex items-center gap-2 text-amber-400 text-xs uppercase tracking-[0.2em] font-light group-hover:gap-4 transition-all">
                      <Eye className="w-4 h-4" /><span>Ver catálogo</span><ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <CatalogTrigger onVisible={() => setShowCatalog(true)} />

      {!showCatalog && (
        <section id="catalogo" className="py-24 sm:py-32 bg-zinc-950 relative">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 space-y-4">
              <p className="text-amber-400/60 uppercase tracking-[0.5em] text-xs">Explora</p>
              <h2 className="text-3xl sm:text-4xl font-extralight tracking-tight">Nuestros Catálogos</h2>
              <p className="text-white/40 text-sm font-light max-w-md mx-auto">
                Descarga nuestros catálogos y descubre toda nuestra colección de fragancias exclusivas.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {catalogs.map((catalog, i) => (
                <a key={i} href={catalog.href} target="_blank" rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-amber-500/30 transition-all duration-500 hover:-translate-y-2">
                  <div className={`absolute inset-0 bg-gradient-to-br ${catalog.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  <div className="p-8 space-y-6">
                    <span className="text-4xl">{catalog.icon}</span>
                    <div className="space-y-2">
                      <h3 className="text-lg font-light tracking-wide text-white">{catalog.title}</h3>
                      <p className="text-sm text-white/40 font-light leading-relaxed">{catalog.description}</p>
                    </div>
                    <div className="flex items-center gap-2 text-amber-400 text-xs uppercase tracking-[0.2em] font-light group-hover:gap-4 transition-all">
                      <Eye className="w-4 h-4" /><span>Ver catálogo</span><ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========== NOSOTROS ========== */}
      <RevealSection id="nosotros" className="py-24 sm:py-32 bg-black relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 space-y-4">
            <p className="text-amber-400/60 uppercase tracking-[0.5em] text-xs">Conócenos</p>
            <h2 className="text-3xl sm:text-4xl font-extralight tracking-tight">Nosotros</h2>
          </div>
          <div className="max-w-3xl mx-auto text-center mb-20 space-y-6">
            <p className="text-white/60 text-base sm:text-lg font-light leading-relaxed">
              Somos una perfumería con <span className="text-amber-400">10 años de experiencia</span> en el mercado, la cual se ha caracterizado por brindar a sus clientes la mejor calidad en sus productos y por medio de sus asesores de venta brindar la mejor experiencia en su compra.
            </p>
            <p className="text-white/50 text-sm sm:text-base font-light leading-relaxed">
              Valores como el amor, la pasión, el respeto y la responsabilidad social han sido esenciales para que nuestros clientes se lleven consigo nuestra marca y sea quien los defina con un aroma particular de sí mismos.
            </p>
            <div className="mt-8 space-y-3">
              <p className="text-lg text-amber-400 font-semibold">💋 Mucho más que una fragancia</p>
              <p className="text-white/80 text-base">✨ Perfumería original, réplica y granel</p>
              <p className="text-white/80 text-base">🧑🏽‍🔬 Asesoría personalizada</p>
              <p className="text-white/80 text-base">📍 MOCOA-PTYO</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8">
              <img src="/image/local.png" alt="Local principal Perfum Mua" className="rounded-xl shadow-lg w-full sm:w-1/2 object-cover max-h-72" />
              <img src="/image/extencion.png" alt="Extensión Perfum Mua" className="rounded-xl shadow-lg w-full sm:w-1/2 object-cover max-h-72" />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {values.map((v, i) => (
              <div key={i} className="text-center group">
                <div className="w-16 h-16 mx-auto rounded-full border border-amber-500/20 bg-amber-500/5 flex items-center justify-center mb-4 group-hover:border-amber-500/50 group-hover:bg-amber-500/10 transition-all duration-500">
                  <v.icon className="w-6 h-6 text-amber-400" />
                </div>
                <h4 className="text-sm font-light text-white tracking-wide mb-1">{v.label}</h4>
                <p className="text-xs text-white/30 font-light">{v.desc}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 sm:p-10 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm space-y-4 hover:border-amber-500/20 transition-colors">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-light tracking-wide uppercase text-xs tracking-[0.2em]">Nuestra Misión</h3>
              </div>
              <p className="text-white/50 text-sm font-light leading-relaxed">
                Brindar a nuestros clientes fragancias de la más alta calidad, ofreciendo una experiencia de compra personalizada a través de nuestros asesores expertos. Nos guiamos por valores como el amor, la pasión, el respeto y la responsabilidad social, para que cada persona encuentre en nuestros perfumes una esencia única que los represente.
              </p>
            </div>
            <div className="p-8 sm:p-10 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm space-y-4 hover:border-amber-500/20 transition-colors">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-light tracking-wide uppercase text-xs tracking-[0.2em]">Nuestra Visión</h3>
              </div>
              <p className="text-white/50 text-sm font-light leading-relaxed">
                Ser la perfumería de referencia en el mercado, reconocida por la excelencia en calidad, innovación y servicio al cliente. Buscamos expandir nuestra presencia, ofreciendo experiencias sensoriales únicas y consolidándonos como una marca que define la identidad de cada persona a través de sus fragancias.
              </p>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* ========== CONTACTO ========== */}
      <RevealSection id="contacto" className="py-24 sm:py-32 bg-zinc-950 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div className="space-y-4">
            <p className="text-amber-400/60 uppercase tracking-[0.5em] text-xs">Encuéntranos</p>
            <h2 className="text-3xl sm:text-4xl font-extralight tracking-tight">Contáctanos</h2>
            <p className="text-white/40 text-sm font-light max-w-md mx-auto">
              Síguenos en nuestras redes sociales y descubre las últimas novedades en fragancias.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <a href="https://www.instagram.com/perfum_mua_/" target="_blank" rel="noopener noreferrer"
              className="group flex flex-col items-center gap-3 p-6 rounded-2xl border border-white/10 bg-white/5 hover:border-pink-500/30 hover:bg-pink-500/5 transition-all duration-300">
              <Instagram className="w-7 h-7 text-white/50 group-hover:text-pink-400 transition-colors" />
              <span className="text-xs text-white/40 group-hover:text-white/60 transition-colors uppercase tracking-widest">Instagram</span>
            </a>
            <a href="https://api.whatsapp.com/send/?phone=573136896274&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer"
              className="group flex flex-col items-center gap-3 p-6 rounded-2xl border border-green-500/30 bg-white/5 hover:border-green-500/60 hover:bg-green-500/5 transition-all duration-300">
              <svg className="w-7 h-7 text-white/50 group-hover:text-green-400 transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M20.52 3.48A12.07 12.07 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.12.55 4.19 1.6 6.02L0 24l6.18-1.62A12.07 12.07 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.21-1.25-6.23-3.48-8.52zM12 22c-1.85 0-3.68-.5-5.26-1.44l-.38-.22-3.67.96.98-3.58-.25-.37A9.94 9.94 0 0 1 2 12C2 6.48 6.48 2 12 2c2.54 0 4.93.99 6.73 2.77A9.48 9.48 0 0 1 22 12c0 5.52-4.48 10-10 10zm5.2-7.6c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.12-.12.28-.32.42-.48.14-.16.18-.28.28-.46.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47-.16-.01-.34-.01-.52-.01-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.3 0 1.36.98 2.68 1.12 2.87.14.18 1.93 2.95 4.68 4.02.65.28 1.16.45 1.56.58.65.21 1.24.18 1.7.11.52-.08 1.65-.67 1.88-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.18-.53-.32z"/></svg>
              <span className="text-xs text-white/40 group-hover:text-green-400 transition-colors uppercase tracking-widest">WhatsApp</span>
            </a>
            <a href="https://www.tiktok.com/@perfummua" target="_blank" rel="noopener noreferrer"
              className="group flex flex-col items-center gap-3 p-6 rounded-2xl border border-white/10 bg-white/5 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all duration-300">
              <svg className="w-7 h-7 text-white/50 group-hover:text-cyan-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.83a8.28 8.28 0 004.76 1.5v-3.4a4.85 4.85 0 01-1-.24z" />
              </svg>
              <span className="text-xs text-white/40 group-hover:text-white/60 transition-colors uppercase tracking-widest">TikTok</span>
            </a>
            <a href="https://www.facebook.com/perfum.mua/" target="_blank" rel="noopener noreferrer"
              className="group flex flex-col items-center gap-3 p-6 rounded-2xl border border-white/10 bg-white/5 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all duration-300">
              <Facebook className="w-7 h-7 text-white/50 group-hover:text-blue-400 transition-colors" />
              <span className="text-xs text-white/40 group-hover:text-white/60 transition-colors uppercase tracking-widest">Facebook</span>
            </a>
            <a href="mailto:perfummua1@gmail.com"
              className="group flex flex-col items-center gap-3 p-6 rounded-2xl border border-white/10 bg-white/5 hover:border-amber-500/30 hover:bg-amber-500/5 transition-all duration-300">
              <Mail className="w-7 h-7 text-white/50 group-hover:text-amber-400 transition-colors" />
              <span className="text-xs text-white/40 group-hover:text-white/60 transition-colors uppercase tracking-widest">Email</span>
            </a>
          </div>
          <div className="pt-8">
            <Button onClick={onGoToLogin} size="lg"
              className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black rounded-none uppercase tracking-[0.2em] text-xs px-12 h-14">
              Ingresar a la tienda
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </RevealSection>

      {/* ========== FOOTER ========== */}
      <footer className="border-t border-white/10 bg-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-6">
            <span className="text-lg font-light tracking-[0.4em] text-white/60 uppercase">Perfum Mua</span>
            <p className="text-white/30 text-xs font-light text-center max-w-md">
              El arte de dejar huella. Fragancias exclusivas que definen tu identidad.
            </p>
            <div className="flex items-center gap-6">
              <a href="https://www.instagram.com/perfum_mua_/" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-pink-400 transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="https://www.tiktok.com/@perfummua" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-cyan-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.83a8.28 8.28 0 004.76 1.5v-3.4a4.85 4.85 0 01-1-.24z" /></svg>
              </a>
              <a href="https://www.facebook.com/perfum.mua/" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-blue-400 transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="mailto:perfummua1@gmail.com" className="text-white/30 hover:text-amber-400 transition-colors"><Mail className="w-5 h-5" /></a>
            </div>
            <div className="w-16 h-px bg-white/10" />
            <p className="text-white/20 text-xs tracking-wider">© 2026 Perfum Mua — Todos los derechos reservados</p>
          </div>
        </div>
      </footer>

      {/* ========== FLOATING CART BUTTON ========== */}
      {totalItems > 0 && !showCart && (
        <button
          onClick={() => setShowCart(true)}
          className="fixed bottom-6 right-6 z-40 bg-amber-500 hover:bg-amber-400 text-black p-4 rounded-full shadow-2xl shadow-amber-500/30 transition-all duration-300 hover:scale-110 group"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute -top-2 -right-2 bg-black text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-amber-500">
            {totalItems}
          </span>
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-black/90 text-white text-xs font-light px-3 py-1.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {formatCOP(totalCarrito)}
          </span>
        </button>
      )}

      {/* ========== CART SIDEBAR ========== */}
      {showCart && (
        <>
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => setShowCart(false)} />
          <div className="fixed top-0 right-0 h-full w-full max-w-md z-50 bg-zinc-950 border-l border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-light tracking-wide text-white">
                  Mi Carrito <span className="text-white/40 text-sm">({totalItems})</span>
                </h2>
              </div>
              <button onClick={() => setShowCart(false)} className="p-2 text-white/40 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {carrito.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingCart className="w-12 h-12 text-white/10 mx-auto mb-4" />
                  <p className="text-white/40 text-sm font-light">Tu carrito está vacío</p>
                  <button onClick={() => { setShowCart(false); scrollToPerfumes() }} className="mt-4 text-amber-400 text-sm font-light hover:text-amber-300 transition-colors underline underline-offset-4">
                    Explorar perfumes
                  </button>
                </div>
              ) : (
                carrito.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="flex gap-4 pb-4 border-b border-white/5 last:border-0">
                    <div className="w-16 h-16 bg-white/5 flex-shrink-0 overflow-hidden">
                      {item.imagen ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={ensureAbsoluteUrl(item.imagen)} alt={item.nombre} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><Sparkles className="w-4 h-4 text-white/10" /></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-light text-white truncate">{item.nombre}</h4>
                      {item.perfumeSeleccionado && <p className="text-xs text-white/50">Perfume: {item.perfumeSeleccionado}</p>}
                      <p className="text-xs text-amber-400/70 mt-1">{formatCOP(item.precio)} c/u</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => actualizarCantidad(item.id, -1, item.tempId)} className="w-7 h-7 border border-white/10 text-white/50 flex items-center justify-center hover:border-white/30 hover:text-white transition-colors">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm text-white font-light w-6 text-center">{item.cantidad}</span>
                        <button onClick={() => actualizarCantidad(item.id, 1, item.tempId)} className="w-7 h-7 border border-white/10 text-white/50 flex items-center justify-center hover:border-white/30 hover:text-white transition-colors">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button onClick={() => removerProducto(item)} className="p-1 text-white/20 hover:text-red-400 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                      <span className="text-sm font-light text-white">{formatCOP(item.precio * item.cantidad)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {carrito.length > 0 && (
              <div className="border-t border-white/10 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/50 font-light uppercase tracking-wider">Total</span>
                  <span className="text-xl text-white font-light">{formatCOP(totalCarrito)}</span>
                </div>
                <button onClick={() => { setShowCart(false); setShowCheckout(true) }} className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black py-4 font-medium uppercase tracking-[0.2em] text-xs transition-all duration-300">
                  Finalizar Compra
                </button>
                <button onClick={() => { setShowCart(false); scrollToPerfumes() }} className="w-full text-center text-white/40 text-xs font-light hover:text-white/60 transition-colors py-2">
                  Seguir comprando
                </button>
              </div>
            )}
          </div>
        </>
      )}
      {/* ========== DECANT MODAL ========== */}
      {/* ========== DECANT MODAL ========== */}
      {showDecantModal && decantProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-zinc-950 border border-white/10 w-full max-w-md p-6 sm:p-8 space-y-8 relative shadow-2xl shadow-amber-500/10">
            <button
              onClick={() => setShowDecantModal(false)}
              className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <p className="text-amber-500 text-xs uppercase tracking-[0.2em]">Personaliza tu</p>
              <h3 className="text-2xl font-light text-white">{decantProduct.name}</h3>
              <p className="text-white/40 text-xs font-light">Stock disponible (envases): {decantProduct.stock}</p>
            </div>

            <div className="space-y-6">


              {/* Perfume Selector */}
              <div className="space-y-3">
                <label className="text-xs text-white/50 uppercase tracking-widest">Elige el perfume</label>
                <div className="relative">
                  <select
                    value={selectedPerfumeId}
                    onChange={(e) => setSelectedPerfumeId(e.target.value)}
                    className="w-full appearance-none bg-white/5 border border-white/10 text-white py-4 px-4 pr-10 focus:border-amber-500 focus:outline-none rounded-none text-sm font-light cursor-pointer"
                  >
                    <option value="" className="bg-zinc-900 text-white/50">Selecciona una fragancia...</option>
                    {products
                      .filter(p => !p.category.toLowerCase().includes('decant') && p.id !== decantProduct.id)
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map(p => {
                        const isAvailable = p.stock > 0
                        return (
                          <option key={p.id} value={p.id} disabled={!isAvailable} className="bg-zinc-900 text-white disabled:text-white/20">
                            {p.name} {p.brand ? `— ${p.brand}` : ''} ({isAvailable ? `Stock: ${p.stock}` : 'Agotado'})
                          </option>
                        )
                      })
                    }
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                </div>
              </div>

              <Button
                onClick={handleConfirmDecant}
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black py-6 rounded-none uppercase tracking-[0.2em] text-xs font-bold mt-4"
              >
                Agregar al Carrito
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ========== RevealSection ========== */
function RevealSection({ children, className = '', id }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect() } },
      { threshold: 0.08, rootMargin: '0px 0px -60px 0px' }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} id={id} className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transition: 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'opacity, transform',
      }}>
      {children}
    </section>
  )
}

/* ========== CountUpStat ========== */
function CountUpStat({ value, suffix = '', label }: { value: number; suffix?: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) { setStarted(true); observer.disconnect() } },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [started])

  useEffect(() => {
    if (!started) return
    const duration = 1800
    const startTime = performance.now()
    const animate = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * value))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [started, value])

  return (
    <div ref={ref} className="text-center">
      <p className="text-3xl font-light text-amber-400">{count}{suffix}</p>
      <p className="text-xs text-white/40 uppercase tracking-widest mt-1">{label}</p>
    </div>
  )
}

/* ========== CatalogTrigger ========== */
function CatalogTrigger({ onVisible }: { onVisible: () => void }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { onVisible() } },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [onVisible])

  return <div ref={ref} className="h-1" />
}
