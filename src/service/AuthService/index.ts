import https from '../axiosInstance'
import { AxiosResponse } from 'axios'
import { TResponseLogin } from '@/service/AuthService/type'
import { TFormLogin } from '@/service/AuthService/type'

const login = async (payload: TFormLogin): Promise<AxiosResponse<TResponseLogin>> => {
  return https.post<TResponseLogin>('auth/login', payload)
}

export { login }
