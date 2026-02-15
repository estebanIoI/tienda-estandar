'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from './types'
import { api } from './api'

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (email: string, password: string, name: string, role: 'comerciante' | 'vendedor') => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true })

        const result = await api.login(email, password)

        if (result.success && result.data) {
          set({
            user: result.data.user,
            isAuthenticated: true,
            isLoading: false
          })
          return { success: true }
        }

        set({ isLoading: false })
        return { success: false, error: result.error || 'Correo o contraseña incorrectos' }
      },

      register: async (email: string, password: string, name: string, role: 'comerciante' | 'vendedor') => {
        set({ isLoading: true })

        if (password.length < 6) {
          set({ isLoading: false })
          return { success: false, error: 'La contraseña debe tener al menos 6 caracteres' }
        }

        const result = await api.register(email, password, name, role)

        if (result.success && result.data) {
          set({
            user: result.data.user,
            isAuthenticated: true,
            isLoading: false
          })
          return { success: true }
        }

        set({ isLoading: false })
        return { success: false, error: result.error || 'Error al registrar usuario' }
      },

      logout: () => {
        api.logout()
        set({
          user: null,
          isAuthenticated: false
        })
      },

      updateProfile: async (updates: Partial<User>) => {
        const result = await api.updateProfile(updates)

        if (result.success && result.data) {
          set(state => ({
            user: state.user ? { ...state.user, ...result.data } : null
          }))
          return { success: true }
        }

        return { success: false, error: result.error || 'Error al actualizar perfil' }
      },

      checkAuth: async () => {
        const token = api.getToken()
        if (!token) {
          set({ user: null, isAuthenticated: false })
          return
        }

        const result = await api.getProfile()
        if (result.success && result.data) {
          set({
            user: result.data,
            isAuthenticated: true
          })
        } else {
          api.logout()
          set({ user: null, isAuthenticated: false })
        }
      }
    }),
    {
      name: 'stockpro-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)
