import https from '@/service/axiosInstance'
import { TResponseMessages } from '@/service/MessagesService/type'

const getMessagesAccordingConversation = async (conservationId: number) => {
  return https.get<TResponseMessages[]>(`messages/conversation/${conservationId}`)
}

export { getMessagesAccordingConversation }
