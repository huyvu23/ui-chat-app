import https from '../axiosInstance'
import { TResponseConversation } from './type'

const getConversation = async () => {
  return https.get<TResponseConversation[]>('conversations')
}

export { getConversation }
