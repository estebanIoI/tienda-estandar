'use client'

import { useEffect, useState } from 'react'
import { useStore } from '@/lib/store'
import { useAuthStore } from '@/lib/auth-store'
import { MainLayout } from '@/components/main-layout'
import { Dashboard } from '@/components/dashboard'
import { Analytics } from '@/components/analytics'
import { InventoryList } from '@/components/inventory-list'
import { PointOfSale } from '@/components/point-of-sale'
import { SalesHistory } from '@/components/sales-history'
import { Invoicing } from '@/components/invoicing'
import { Settings } from '@/components/settings'
import { Customers } from '@/components/customers'
import { Fiados } from '@/components/fiados'
import { CashRegister } from '@/components/cash-register'
import { TenantManagement } from '@/components/tenant-management'
import { AuthForm } from '@/components/auth-form'
import { LandingPage } from '@/components/landing-page'
import { Tienda } from '@/components/tienda'
import { Pedidos } from '@/components/pedidos'
import { Cupones } from '@/components/cupones'

export default function Home() {
  const { activeSection, setActiveSection } = useStore()
  const { isAuthenticated, checkAuth, user } = useAuthStore()
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  // Force vendedor users to POS section
  useEffect(() => {
    if (isAuthenticated && user?.role === 'vendedor' && activeSection !== 'pos' && activeSection !== 'history' && activeSection !== 'cash-register') {
      setActiveSection('pos')
    }
  }, [isAuthenticated, user?.role, activeSection, setActiveSection])

  // Redirect superadmin to their panel on login
  useEffect(() => {
    if (isAuthenticated && user?.role === 'superadmin' && activeSection === 'dashboard') {
      setActiveSection('superadmin')
    }
  }, [isAuthenticated, user?.role, activeSection, setActiveSection])

  // Prevent non-superadmin users from seeing superadmin section (stale localStorage)
  useEffect(() => {
    if (isAuthenticated && user?.role !== 'superadmin' && activeSection === 'superadmin') {
      setActiveSection('dashboard')
    }
  }, [isAuthenticated, user?.role, activeSection, setActiveSection])

  // Show login if not authenticated
  if (!isAuthenticated) {
    if (!showLogin) {
      return <LandingPage onGoToLogin={() => setShowLogin(true)} />
    }
    return <AuthForm onGoBack={() => setShowLogin(false)} />
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'superadmin':
        return user?.role === 'superadmin' ? <TenantManagement /> : <Dashboard />
      case 'dashboard':
        return <Dashboard />
      case 'inventory':
        return <InventoryList />
      case 'tienda':
        return <Tienda />
      case 'pedidos':
        return <Pedidos />
      case 'cupones':
        return <Cupones />
      case 'pos':
        return <PointOfSale />
      case 'cash-register':
        return <CashRegister />
      case 'history':
        return <SalesHistory />
      case 'invoices':
        return <Invoicing />
      case 'customers':
        return <Customers />
      case 'fiados':
        return <Fiados />
      case 'analytics':
        return <Analytics />
      case 'settings':
        return <Settings />
      default:
        return <Dashboard />
    }
  }

  return (
    <MainLayout>
      {renderSection()}
    </MainLayout>
  )
}
