export type Category = string

export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL'

export type ProductType = 'general' | 'alimentos' | 'bebidas' | 'ropa' | 'electronica' | 'farmacia' | 'ferreteria' | 'libreria' | 'juguetes' | 'cosmetica' | 'perfumes' | 'deportes' | 'hogar' | 'mascotas' | 'otros'

export type PaymentMethod = 'efectivo' | 'tarjeta' | 'transferencia' | 'fiado'

export type StockStatus = 'suficiente' | 'bajo' | 'agotado'

export type CreditStatus = 'pendiente' | 'parcial' | 'pagado'

export interface Product {
  id: string
  name: string
  category: Category
  productType: ProductType
  brand?: string
  model?: string
  description?: string
  purchasePrice: number
  salePrice: number
  sku: string
  barcode?: string
  stock: number
  reorderPoint: number
  supplier?: string
  supplierId?: string
  entryDate: string
  imageUrl?: string
  locationInStore?: string
  notes?: string
  tags?: string[]
  // Alimentos / Bebidas
  expiryDate?: string
  batchNumber?: string
  netWeight?: number
  weightUnit?: string
  sanitaryRegistration?: string
  storageTemperature?: string
  ingredients?: string
  nutritionalInfo?: string
  alcoholContent?: number
  allergens?: string
  // Ropa
  size?: string
  color?: string
  material?: string
  gender?: string
  season?: string
  garmentType?: string
  washingInstructions?: string
  countryOfOrigin?: string
  // Electronica
  serialNumber?: string
  warrantyMonths?: number
  technicalSpecs?: string
  voltage?: string
  powerWatts?: number
  compatibility?: string
  includesAccessories?: string
  productCondition?: string
  // Farmacia
  activeIngredient?: string
  concentration?: string
  requiresPrescription?: boolean
  administrationRoute?: string
  presentation?: string
  unitsPerPackage?: number
  laboratory?: string
  contraindications?: string
  // Ferreteria
  dimensions?: string
  weight?: number
  caliber?: string
  resistance?: string
  finish?: string
  recommendedUse?: string
  // Libreria
  author?: string
  publisher?: string
  isbn?: string
  pages?: number
  language?: string
  publicationYear?: number
  edition?: string
  bookFormat?: string
  // Juguetes
  recommendedAge?: string
  numberOfPlayers?: string
  gameType?: string
  requiresBatteries?: boolean
  packageDimensions?: string
  packageContents?: string
  safetyWarnings?: string
  // Ofertas
  isOnOffer?: boolean
  offerPrice?: number | null
  offerLabel?: string | null
  offerEnd?: string | null
  // Timestamps
  createdAt: string
  updatedAt: string
}

export interface CartItem {
  product: Product
  quantity: number
  discount: number
}

export interface Sale {
  id: string
  invoiceNumber: string
  items: SaleItem[]
  subtotal: number
  tax: number
  discount: number
  total: number
  paymentMethod: PaymentMethod
  amountPaid: number
  change: number
  customerId?: string
  customer?: Customer
  customerName?: string
  customerPhone?: string
  seller?: string
  sellerName?: string
  createdAt: string
  status: 'completada' | 'anulada'
  creditStatus?: CreditStatus
  dueDate?: string
  notes?: string
}

export interface SaleItem {
  productId: string
  productName: string
  sku?: string
  productSku?: string
  quantity: number
  unitPrice: number
  discount: number
  total?: number
  subtotal?: number
}

export interface Customer {
  cedula?: string
  name: string
  phone?: string
  email?: string
}

export interface CustomerFull {
  id: string
  cedula: string
  name: string
  phone?: string
  email?: string
  address?: string
  creditLimit: number
  notes?: string
  totalCredit: number
  totalPaid: number
  balance: number
  createdAt: string
  updatedAt: string
}

export interface CreditPayment {
  id: string
  saleId: string
  customerId: string
  amount: number
  paymentMethod: Exclude<PaymentMethod, 'fiado'>
  receiptNumber?: string
  notes?: string
  receivedBy?: string
  createdAt: string
}

export interface CreditDetail {
  sale: {
    id: string
    invoiceNumber: string
    customerId: string
    customerName: string
    customerPhone?: string
    subtotal: number
    tax: number
    discount: number
    total: number
    status: string
    dueDate?: string
    createdAt: string
  }
  totalAmount: number
  paidAmount: number
  remainingBalance: number
  status: CreditStatus
  payments: CreditPayment[]
}

export interface StoreInfo {
  name: string
  address: string
  phone: string
  taxId: string
  email: string
  invoiceGreeting: string
  invoicePolicy: string
}

export interface StockMovement {
  id: string
  productId: string
  type: 'entrada' | 'salida' | 'ajuste'
  quantity: number
  previousStock: number
  newStock: number
  reason: string
  createdAt: string
}

export interface DashboardMetrics {
  totalProducts: number
  totalInventoryValue: number
  dailySales: number
  weeklySales: number
  monthlySales: number
  lowStockProducts: number
  outOfStockProducts: number
  accountsReceivable?: number
  topSellingProducts: TopSellingProduct[]
  salesByCategory: SalesByCategory[]
  recentSales: Sale[]
}

export interface TopSellingProduct {
  productId: string
  productName: string
  totalSold: number
  revenue: number
}

export interface SalesByCategory {
  category: Category
  sales: number
  revenue: number
}

export interface SalesChartData {
  date: string
  sales: number
  revenue: number
}

export interface CategoryItem {
  id: string
  name: string
  description?: string
}

export const SIZES: Size[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']

// Cash Sessions
export type CashSessionStatus = 'abierta' | 'cerrada'
export type ClosingStatus = 'cuadrado' | 'sobrante' | 'faltante'
export type CashMovementType = 'entrada' | 'salida'

export interface CashSession {
  id: string
  openedBy: string
  openedByName: string
  openingAmount: number
  openedAt: string
  closedBy?: string
  closedByName?: string
  closedAt?: string
  totalCashSales: number
  totalCardSales: number
  totalTransferSales: number
  totalFiadoSales: number
  totalSalesCount: number
  totalChangeGiven: number
  totalCashEntries: number
  totalCashWithdrawals: number
  expectedCash?: number
  actualCash?: number
  difference?: number
  status: CashSessionStatus
  closingStatus?: ClosingStatus
  observations?: string
  createdAt: string
  updatedAt: string
}

export interface CashMovement {
  id: string
  sessionId: string
  type: CashMovementType
  amount: number
  reason: string
  notes?: string
  createdBy: string
  createdByName: string
  createdAt: string
}

export interface CashSessionTotals {
  cashSales: number
  cardSales: number
  transferSales: number
  fiadoSales: number
  salesCount: number
  changeGiven: number
  cashEntries: number
  cashWithdrawals: number
}

export const TAX_RATE = 0.19 // 19% IVA Colombia

// Auth Types
export type UserRole = 'superadmin' | 'comerciante' | 'vendedor'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  tenantId?: string | null
  isActive?: boolean
  createdAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

// Tenant Types
export type TenantStatus = 'activo' | 'suspendido' | 'cancelado'
export type TenantPlan = 'basico' | 'profesional' | 'empresarial'

export interface Tenant {
  id: string
  name: string
  slug: string
  ownerId?: string
  ownerName?: string
  ownerEmail?: string
  plan: TenantPlan
  status: TenantStatus
  maxUsers: number
  maxProducts: number
  totalUsers?: number
  totalProducts?: number
  totalSales?: number
  createdAt: string
  updatedAt: string
}
