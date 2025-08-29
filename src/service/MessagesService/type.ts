import { TUser } from '@/service/AuthService/type'

type TConversation = {
  id: number
  createdAt: string // ISO Date string
}

export type TResponseMessages = {
  id: number
  content: string
  createdAt: string // ISO Date string
  conversation: TConversation
  sender: TUser
  receiver: TUser
}
