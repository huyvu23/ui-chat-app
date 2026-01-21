import https from '../axiosInstance'
import { TResponseMessage } from './type'

const getMessageInConversationId = async (conversationId: string) => {
    return https.get<{
        messages: TResponseMessage[]
        total: number
        page: number
        totalPages: number
    }>(`messages/conversation/${conversationId}`)
}

export { getMessageInConversationId }