import { NextRouter, useRouter } from 'next/router'
import { usePathname } from 'next/navigation'
import useAuth from '@/store/useAuth'
import { useEffect, useState } from 'react'

const Home = () => {
  const router: NextRouter = useRouter()
  const pathname: string = usePathname()
  const { accessToken, hasHydrated } = useAuth()
  const [isReady, setIsReady] = useState<boolean>(false)
  useEffect(() => {
    if (!hasHydrated) return

    const hasToken: boolean = Boolean(accessToken)
    const isPageDefault: boolean = ['/']?.includes(pathname)

    if (!hasToken && !isPageDefault) {
      // Chưa đăng nhập mà không ở trang login → redirect về login
      router.replace('/dang-nhap')
      return
    }

    // // Trường hợp hợp lệ mới cho hiển thị UI
    setIsReady(true)
  }, [hasHydrated, pathname])

  if (!isReady) return null

  return <div></div>
}

export default Home
