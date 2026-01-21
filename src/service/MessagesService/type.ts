import { TUser } from '../AuthService/type'

export type TResponseMessage = {
    id: string
    content: string
    conversationId: string
    sender: TUser
    senderId: string
    updatedAt: string
    type: 'TEXT' | 'IMAGE' | 'VIDEO' | 'FILE'
}