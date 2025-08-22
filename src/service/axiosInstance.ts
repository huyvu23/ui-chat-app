import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios'
import useAuth from '@/store/useAuth'

const https: AxiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API}`,
  paramsSerializer: {
    indexes: null
  },
  timeout: 300 * 1000
})
https.interceptors.request.use(
  async function (config) {
    const token: string | null = useAuth.getState().accessToken

    if (token) config.headers['Authorization'] = `Bearer ${token}`

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// const refreshToken = async (failedRequest: any) => {
//     const refreshToken: string | null = useAuth.getState().refreshToken
//     const { url } = failedRequest?.config
//     if (failedRequest?.response?.status !== 401 || url === 'auth/login') {
//         return Promise.reject(failedRequest)
//     }
//     if (!['/auth/get-access-token', '/auth/login']?.includes(url) && refreshToken) {
//         try {
//             useAuth.getState().setAccessToken(refreshToken as string)
//             const response = await https.get('/auth/get-access-token')
//             const { data } = response
//             useAuth.getState().setAccessToken(data.accessToken as string)
//             useAuth.getState().setRefreshToken(data.refreshToken as string)
//             // Cập nhật lại failed request với token mới
//             failedRequest.response.config.headers['Authorization'] = `Bearer ${data?.accessToken}`
//
//             return Promise.resolve()
//         } catch (error) {
//             useAuth.getState().logout()
//             return Promise.reject(error)
//         }
//     }
// }
//
// createAuthRefreshInterceptor(https, refreshToken, {
//     // Do lỗi thư viện chưa thể fix khi invalid refresh token sẽ ăn vào hàm catch nên phải viết như này (https://github.com/Flyrell/axios-auth-refresh/issues/191)
//     shouldRefresh: (error: any) => {
//         const { url } = error?.config
//         const { status } = error?.response
//         if (url === '/auth/get-access-token' && status === 401) {
//             return false
//         }
//         return true
//     }
// })

https.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => Promise.reject(error.response?.data)
)

export default https
