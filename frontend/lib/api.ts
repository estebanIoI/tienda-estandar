const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

class ApiService {
  private token: string | null = null

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('authToken')
    }
  }

  setToken(token: string | null) {
    this.token = token
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('authToken', token)
      } else {
        localStorage.removeItem('authToken')
      }
    }
  }

  getToken() {
    return this.token
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ success: boolean; data?: T; error?: string; message?: string }> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    }

    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMsg = data.message || data.error || 'Error en la solicitud'
        const details = data.details

        // Force logout if account/tenant is suspended or deactivated (only if already logged in)
        if (response.status === 403 && this.token && (
          errorMsg.includes('suspendido') || errorMsg.includes('desactivada')
        )) {
          this.setToken(null)
          if (typeof window !== 'undefined') {
            window.location.reload()
          }
        }

        if (details && Array.isArray(details)) {
          console.error('Validation errors:', details)
        }
        return {
          success: false,
          error: details?.length
            ? `${errorMsg}: ${details.map((d: any) => `${d.field} - ${d.message}`).join(', ')}`
            : errorMsg,
        }
      }

      return data
    } catch (error) {
      console.error('API Error:', error)
      return {
        success: false,
        error: 'Error de conexión con el servidor',
      }
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const result = await this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })

    if (result.success && result.data?.token) {
      this.setToken(result.data.token)
    }

    return result
  }

  async register(email: string, password: string, name: string, role: 'comerciante' | 'vendedor' = 'vendedor') {
    const result = await this.request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, role }),
    })

    if (result.success && result.data?.token) {
      this.setToken(result.data.token)
    }

    return result
  }

  async getProfile() {
    return this.request<any>('/auth/profile')
  }

  async updateProfile(updates: { name?: string; email?: string }) {
    return this.request<any>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.request<any>('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    })
  }

  logout() {
    this.setToken(null)
  }

  // Users endpoints (admin only)
  async getUsers(params?: { page?: number; limit?: number }) {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', String(params.page))
    if (params?.limit) searchParams.set('limit', String(params.limit))
    const query = searchParams.toString()
    return this.request<{ users: any[]; pagination: any }>(`/users${query ? `?${query}` : ''}`)
  }

  async createUser(data: { email: string; password: string; name: string; role: 'comerciante' | 'vendedor' }) {
    return this.request<any>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async deleteUser(id: string) {
    return this.request<any>(`/users/${id}`, {
      method: 'DELETE',
    })
  }

  async resetUserPassword(id: string, newPassword: string) {
    return this.request<any>(`/users/${id}/reset-password`, {
      method: 'PUT',
      body: JSON.stringify({ newPassword }),
    })
  }

  // Products endpoints
  async getProducts(params?: {
    page?: number
    limit?: number
    category?: string
    stockStatus?: string
    search?: string
  }) {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', String(params.page))
    if (params?.limit) searchParams.set('limit', String(params.limit))
    if (params?.category) searchParams.set('category', params.category)
    if (params?.stockStatus) searchParams.set('stockStatus', params.stockStatus)
    if (params?.search) searchParams.set('search', params.search)

    const query = searchParams.toString()
    return this.request<{ products: any[]; pagination: any }>(`/products${query ? `?${query}` : ''}`)
  }

  async getProduct(id: string) {
    return this.request<any>(`/products/${id}`)
  }

  async createProduct(product: any) {
    return this.request<any>('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    })
  }

  async updateProduct(id: string, updates: any) {
    return this.request<any>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }

  async deleteProduct(id: string) {
    return this.request<any>(`/products/${id}`, {
      method: 'DELETE',
    })
  }

  async findProductByBarcode(barcode: string) {
    return this.request<any>(`/products/barcode/${encodeURIComponent(barcode)}`)
  }

  async getLowStockProducts() {
    return this.request<any[]>('/products/low-stock')
  }

  async getOutOfStockProducts() {
    return this.request<any[]>('/products/out-of-stock')
  }

  async bulkCreateProducts(products: Record<string, any>[]) {
    return this.request<{
      totalReceived: number
      totalCreated: number
      totalFailed: number
      errors: Array<{ row: number; sku: string; error: string }>
    }>('/products/bulk', {
      method: 'POST',
      body: JSON.stringify({ products }),
    })
  }

  // Sales endpoints
  async getSales(params?: {
    page?: number
    limit?: number
    status?: string
    paymentMethod?: string
  }) {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', String(params.page))
    if (params?.limit) searchParams.set('limit', String(params.limit))
    if (params?.status) searchParams.set('status', params.status)
    if (params?.paymentMethod) searchParams.set('paymentMethod', params.paymentMethod)

    const query = searchParams.toString()
    return this.request<{ sales: any[]; pagination: any }>(`/sales${query ? `?${query}` : ''}`)
  }

  async getSale(id: string) {
    return this.request<any>(`/sales/${id}`)
  }

  async getRecentSales() {
    return this.request<any[]>('/sales/recent')
  }

  async createSale(sale: {
    items: Array<{ productId: string; quantity: number; discount?: number; customAmount?: number }>
    paymentMethod: string
    amountPaid: number
    customerId?: string
    customerName?: string
    customerPhone?: string
    customerEmail?: string
    creditDays?: number
  }) {
    return this.request<any>('/sales', {
      method: 'POST',
      body: JSON.stringify(sale),
    })
  }

  async cancelSale(id: string, reason: string) {
    return this.request<any>(`/sales/${id}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    })
  }

  // Inventory endpoints
  async getInventoryMovements(params?: { page?: number; limit?: number; productId?: string }) {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', String(params.page))
    if (params?.limit) searchParams.set('limit', String(params.limit))
    if (params?.productId) searchParams.set('productId', params.productId)

    const query = searchParams.toString()
    return this.request<{ movements: any[]; pagination: any }>(`/inventory/movements${query ? `?${query}` : ''}`)
  }

  async adjustStock(productId: string, quantity: number, type: 'entrada' | 'salida' | 'ajuste', reason: string) {
    return this.request<any>('/inventory/adjust', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity, type, reason }),
    })
  }

  // Dashboard endpoints
  async getDashboardMetrics() {
    return this.request<any>('/dashboard/metrics')
  }

  async getSalesTrend(days?: number) {
    const query = days !== undefined ? `?days=${days}` : ''
    return this.request<Array<{ date: string; total: number; count: number }>>(`/dashboard/sales-trend${query}`)
  }

  async getMonthlyRevenueCosts(months = 6) {
    return this.request<Array<{ month: string; revenue: number; costs: number }>>(`/dashboard/monthly-revenue-costs?months=${months}`)
  }

  // Customers endpoints
  async getCustomers(params?: { page?: number; limit?: number; search?: string }) {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', String(params.page))
    if (params?.limit) searchParams.set('limit', String(params.limit))
    if (params?.search) searchParams.set('search', params.search)
    const query = searchParams.toString()
    return this.request<any>(`/customers${query ? `?${query}` : ''}`)
  }

  async searchCustomers(query: string) {
    return this.request<any[]>(`/customers/search?q=${encodeURIComponent(query)}`)
  }

  async getCustomer(id: string) {
    return this.request<any>(`/customers/${id}`)
  }

  async createCustomer(data: { cedula: string; name: string; phone?: string; email?: string; address?: string; creditLimit?: number; notes?: string }) {
    return this.request<any>('/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateCustomer(id: string, data: { cedula?: string; name?: string; phone?: string; email?: string; address?: string; creditLimit?: number; notes?: string }) {
    return this.request<any>(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteCustomer(id: string) {
    return this.request<any>(`/customers/${id}`, {
      method: 'DELETE',
    })
  }

  async getCustomerBalance(id: string) {
    return this.request<any>(`/customers/${id}/balance`)
  }

  // Credits endpoints
  async getPendingCredits(params?: { page?: number; limit?: number; customerId?: string; status?: string }) {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', String(params.page))
    if (params?.limit) searchParams.set('limit', String(params.limit))
    if (params?.customerId) searchParams.set('customerId', params.customerId)
    if (params?.status) searchParams.set('status', params.status)
    const query = searchParams.toString()
    return this.request<any>(`/credits${query ? `?${query}` : ''}`)
  }

  async getCreditDetail(saleId: string) {
    return this.request<any>(`/credits/${saleId}`)
  }

  async getCreditPayments(saleId: string) {
    return this.request<any[]>(`/credits/${saleId}/payments`)
  }

  async registerPayment(saleId: string, data: { amount: number; paymentMethod: string; notes?: string }) {
    return this.request<any>(`/credits/${saleId}/payments`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getCreditsSummary() {
    return this.request<{ totalPending: number; totalCredits: number; customersWithDebt: number }>('/credits/summary')
  }

  // Categories endpoints
  async getCategories() {
    return this.request<any[]>('/categories')
  }

  async createCategory(data: { id: string; name: string; description?: string }) {
    return this.request<any>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async deleteCategory(id: string) {
    return this.request<any>(`/categories/${id}`, {
      method: 'DELETE',
    })
  }

  // Cash Sessions endpoints
  async getActiveCashSession() {
    return this.request<any>('/cash-sessions/active')
  }

  async getCashSessions(params?: { page?: number; limit?: number; status?: string }) {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', String(params.page))
    if (params?.limit) searchParams.set('limit', String(params.limit))
    if (params?.status) searchParams.set('status', params.status)
    const query = searchParams.toString()
    return this.request<any>(`/cash-sessions${query ? `?${query}` : ''}`)
  }

  async getCashSession(id: string) {
    return this.request<any>(`/cash-sessions/${id}`)
  }

  async openCashSession(openingAmount: number, userName: string) {
    return this.request<any>('/cash-sessions/open', {
      method: 'POST',
      body: JSON.stringify({ openingAmount, userName }),
    })
  }

  async addCashMovement(sessionId: string, data: { type: 'entrada' | 'salida'; amount: number; reason: string; notes?: string; userName?: string }) {
    return this.request<any>(`/cash-sessions/${sessionId}/movements`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getCashMovements(sessionId: string) {
    return this.request<any>(`/cash-sessions/${sessionId}/movements`)
  }

  async getCashSessionTotals(sessionId: string) {
    return this.request<any>(`/cash-sessions/${sessionId}/totals`)
  }

  async closeCashSession(sessionId: string, data: { actualCash: number; observations?: string; userName?: string }) {
    return this.request<any>(`/cash-sessions/${sessionId}/close`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Tenants endpoints (superadmin only)
  async getTenants(params?: { page?: number; limit?: number; search?: string }) {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', String(params.page))
    if (params?.limit) searchParams.set('limit', String(params.limit))
    if (params?.search) searchParams.set('search', params.search)
    const query = searchParams.toString()
    return this.request<any>(`/tenants${query ? `?${query}` : ''}`)
  }

  async getTenant(id: string) {
    return this.request<any>(`/tenants/${id}`)
  }

  async createTenant(data: {
    name: string
    slug: string
    businessType?: string
    plan?: string
    maxUsers?: number
    maxProducts?: number
    ownerName: string
    ownerEmail: string
    ownerPassword: string
  }) {
    return this.request<any>('/tenants', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateTenant(id: string, data: { name?: string; businessType?: string; plan?: string; status?: string; maxUsers?: number; maxProducts?: number }) {
    return this.request<any>(`/tenants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async toggleTenantStatus(id: string) {
    return this.request<any>(`/tenants/${id}/toggle-status`, {
      method: 'PATCH',
    })
  }

  async getTenantStats() {
    return this.request<any>('/tenants/stats')
  }

  // =============================================
  // Storefront management endpoints (authenticated)
  // =============================================

  async getMyPublishedProducts() {
    return this.request<any[]>('/storefront/my-published')
  }

  async publishProduct(productId: string, published: boolean) {
    return this.request<any>(`/storefront/publish/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ published }),
    })
  }

  async bulkPublishProducts(productIds: string[], published: boolean) {
    return this.request<any>('/storefront/publish-bulk', {
      method: 'PUT',
      body: JSON.stringify({ productIds, published }),
    })
  }

  async toggleProductOffer(productId: string, data: {
    isOnOffer: boolean
    offerPrice?: number
    offerLabel?: string
    offerEnd?: string
  }) {
    return this.request<any>(`/storefront/offer/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // =============================================
  // Orders endpoints
  // =============================================

  async createPublicOrder(data: {
    customerName: string
    customerPhone: string
    customerEmail?: string
    customerCedula?: string
    department?: string
    municipality?: string
    address?: string
    neighborhood?: string
    notes?: string
    items: Array<{ productId: string; productName: string; quantity: number; unitPrice: number; productImage?: string; size?: string; color?: string }>
    tenantId?: string
    paymentMethod?: string
    shippingCost?: number
    discount?: number
  }) {
    return this.request<any>('/orders/public', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getOrders(params?: { page?: number; limit?: number; status?: string; search?: string }) {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', String(params.page))
    if (params?.limit) searchParams.set('limit', String(params.limit))
    if (params?.status) searchParams.set('status', params.status)
    if (params?.search) searchParams.set('search', params.search)
    const query = searchParams.toString()
    return this.request<any>(`/orders${query ? `?${query}` : ''}`)
  }

  async getOrder(id: string) {
    return this.request<any>(`/orders/${id}`)
  }

  async getOrderStats() {
    return this.request<any>('/orders/stats')
  }

  async updateOrderStatus(id: string, status: string) {
    return this.request<any>(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    })
  }

  // =============================================
  // Coupons endpoints
  // =============================================

  async getCoupons(params?: { page?: number; limit?: number; search?: string }) {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', String(params.page))
    if (params?.limit) searchParams.set('limit', String(params.limit))
    if (params?.search) searchParams.set('search', params.search)
    const query = searchParams.toString()
    return this.request<any>(`/coupons${query ? `?${query}` : ''}`)
  }

  async createCoupon(data: {
    code: string
    description?: string
    discountType: 'porcentaje' | 'fijo'
    discountValue: number
    minPurchase?: number
    maxUses?: number
    expiresAt?: string
  }) {
    return this.request<any>('/coupons', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateCoupon(id: string, data: {
    description?: string
    discountType?: 'porcentaje' | 'fijo'
    discountValue?: number
    minPurchase?: number | null
    maxUses?: number | null
    expiresAt?: string | null
    isActive?: boolean
  }) {
    return this.request<any>(`/coupons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteCoupon(id: string) {
    return this.request<any>(`/coupons/${id}`, {
      method: 'DELETE',
    })
  }

  async seedDefaultCoupons() {
    return this.request<any>('/coupons/seed-defaults', {
      method: 'POST',
    })
  }

  async validateCouponPublic(code: string, subtotal: number) {
    return this.request<any>('/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code, subtotal }),
    })
  }

  async useCouponPublic(code: string) {
    return this.request<any>('/coupons/use', {
      method: 'POST',
      body: JSON.stringify({ code }),
    })
  }

  // Recipes endpoints
  async getRecipes() {
    return this.request<any[]>('/recipes')
  }

  async getRecipe(productId: string) {
    return this.request<any>(`/recipes/${productId}`)
  }

  async saveRecipe(productId: string, ingredients: Array<{ ingredientId: string; quantity: number }>) {
    return this.request<any>('/recipes', {
      method: 'POST',
      body: JSON.stringify({ productId, ingredients }),
    })
  }

  async deleteRecipe(productId: string) {
    return this.request<any>(`/recipes/${productId}`, {
      method: 'DELETE',
    })
  }
}

export const api = new ApiService()
