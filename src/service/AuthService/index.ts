import https from '../axiosInstance'
import { AxiosResponse } from 'axios'
import { TResponseLogin, TFormLogin, TFormRegister } from '@/service/AuthService/type'

const login = async (payload: TFormLogin): Promise<AxiosResponse<TResponseLogin>> => {
  return https.post<TResponseLogin>('auth/login', payload)
}

const register = async (payload: TFormRegister): Promise<AxiosResponse<void>> => {
  return https.post<void>('auth/register', payload)
}

export { login, register }
