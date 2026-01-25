import https from '../axiosInstance'
import { TPayloadCreateConversation, TResponseConversation } from './type'

const getConversation = async () => {
  return https.get<TResponseConversation[]>('conversations')
}

const createConversation = async (payload: TPayloadCreateConversation) => {
  return https.post<TResponseConversation>('conversations', payload)
}

export { getConversation, createConversation }
