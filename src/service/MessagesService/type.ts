// Minimal sender info needed for displaying messages
export type TMessageSender = {
  id: string
  username: string
  email: string
  avatar: string | null
}

export type TResponseMessage = {
  id: string
  content: string
  conversationId: string
  sender: TMessageSender
  senderId: string
  updatedAt: string
  type: 'TEXT' | 'IMAGE' | 'VIDEO' | 'FILE'
}
