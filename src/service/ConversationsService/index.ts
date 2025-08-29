import https from '@/service/axiosInstance'
import { TPayloadCheckConversation, TResponseConversation } from './type'

const checkConversation = async (payload: TPayloadCheckConversation) => {
  return https.post<TResponseConversation>('conversations', payload)
}

export { checkConversation }
