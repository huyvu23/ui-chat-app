import https from '../axiosInstance'
import { TUser } from '@/service/AuthService/type'

const getAllUsers = async () => {
  return https.get<TUser[]>('users')
}

export { getAllUsers }
