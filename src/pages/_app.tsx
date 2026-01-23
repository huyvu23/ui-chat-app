import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import theme from '../theme'
import { SnackbarProvider } from 'notistack'
import { useRouter, NextRouter } from 'next/router'
import { usePathname } from 'next/navigation'
import useAuth from '@/store/useAuth'
import { useEffect, useState } from 'react'

export default function App(props: AppProps) {
  const { Component, pageProps } = props
  const router: NextRouter = useRouter()
  const pathname: string = usePathname()
  const { accessToken, hasHydrated } = useAuth()
  const [isReady, setIsReady] = useState<boolean>(false)
  useEffect(() => {
    if (!hasHydrated) return

    const hasToken: boolean = Boolean(accessToken)
    const publicPages: string[] = ['/dang-nhap', '/dang-ky']
    const isPublicPage: boolean = publicPages.includes(pathname)

    if (!hasToken && !isPublicPage) {
      // Chưa đăng nhập mà không ở trang public → redirect về login
      router.replace('/dang-nhap')
      return
    }

    // // Trường hợp hợp lệ mới cho hiển thị UI
    setIsReady(true)
  }, [hasHydrated, pathname])

  if (!isReady) return null

  return (
    <>
      <Head>
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        autoHideDuration={2500}
      >
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />

          <Component {...pageProps} />
        </ThemeProvider>
      </SnackbarProvider>
    </>
  )
}
