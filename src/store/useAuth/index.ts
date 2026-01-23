import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { TUser } from '@/service/AuthService/type'

export type TInformationUserLogin = {
  accessToken: string
  user: TUser
}

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: TUser | null
  setLoginData: (data: TInformationUserLogin) => void
  logout: () => void
  setAccessToken: (accessToken: string) => void
  setRefreshToken: (refreshToken: string) => void
  hasHydrated: boolean
  setHasHydrated: () => void
}

const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      hasHydrated: false,
      setLoginData: (data: TInformationUserLogin) => {
        set({
          accessToken: data.accessToken,
          user: data.user
        })
      },
      logout: () => {
        set({ accessToken: null, refreshToken: null, user: null })
      },
      setAccessToken: (accessToken: string) => {
        set({ accessToken })
      },
      setRefreshToken: (refreshToken: string) => {
        set({ refreshToken })
      },
      setHasHydrated: () => set({ hasHydrated: true })
    }),
    {
      name: 'auth-chat-storage', // Tên key trong local storage
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => state => {
        state?.setHasHydrated?.()
      }
    }
  )
)

export default useAuthStore
