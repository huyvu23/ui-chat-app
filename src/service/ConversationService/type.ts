import { TUser } from '../AuthService/type'

export type TResponseConversation = {
  createdAt: string
  createdBy: string
  creator: TUser
  id: string
  name: string | null
  participants: {
    conversationId: string
    id: string
    joinedAt: string
    lastReadAt: string | null
    user: TUser
    userId: string
  }[]
  type: 'DIRECT' | 'GROUP'
  updatedAt: string
}

export type TPayloadCreateConversation = {
  type: 'DIRECT' | 'GROUP'
  participantIds: string[]
  name?: string
}