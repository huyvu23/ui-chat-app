/**
 * WebSocket Events Definition
 * Tập trung quản lý tất cả các event names và payload types cho WebSocket
 */

// ==========================================
// EVENT NAMES - Client gửi lên Server
// ==========================================

export const CLIENT_EVENTS = {
  /** Đăng ký user online sau khi connect */
  USER_JOIN: 'user:join',

  /** Gửi tin nhắn mới */
  MESSAGE_SEND: 'message:send',

  /** Bắt đầu nhập tin nhắn */
  TYPING_START: 'typing:start',

  /** Dừng nhập tin nhắn */
  TYPING_STOP: 'typing:stop',

  /** Tham gia room của conversation */
  CONVERSATION_JOIN: 'conversation:join',

  /** Rời room của conversation */
  CONVERSATION_LEAVE: 'conversation:leave'
} as const

// ==========================================
// EVENT NAMES - Server gửi xuống Client
// ==========================================

export const SERVER_EVENTS = {
  /** User đã online */
  USER_ONLINE: 'user:online',

  /** User đã offline */
  USER_OFFLINE: 'user:offline',

  /** Tin nhắn mới (broadcast tới tất cả clients) */
  MESSAGE_NEW: 'message:new',

  /** Trạng thái đang nhập của user */
  TYPING_USER: 'typing:user'
} as const

// ==========================================
// PAYLOAD TYPES - Client → Server
// ==========================================

/** Payload cho event message:send */
export interface SendMessagePayload {
  conversationId: string
  content: string
}

/** Payload cho event typing:start và typing:stop */
export interface TypingPayload {
  conversationId: string
}

/** Payload cho event conversation:join và conversation:leave */
export interface ConversationRoomPayload {
  conversationId: string
}

// ==========================================
// PAYLOAD TYPES - Server → Client
// ==========================================

/** Payload cho event user:online */
export interface UserOnlinePayload {
  userId: string
  username: string
}

/** Payload cho event user:offline */
export interface UserOfflinePayload {
  userId: string
}

/** Payload cho event message:new */
export interface NewMessagePayload {
  id: string
  conversationId: string
  senderId: string
  content: string
  type: 'TEXT' | 'IMAGE' | 'FILE'
  metadata: Record<string, unknown> | null
  createdAt: string
  updatedAt: string
  sender: {
    id: string
    username: string
    email: string
    avatar: string | null
  }
  conversation: {
    id: string
    name: string | null
    type: 'DIRECT' | 'GROUP'
  }
}

/** Payload cho event typing:user */
export interface TypingUserPayload {
  conversationId: string
  userId: string
  username: string
  isTyping: boolean
}

// ==========================================
// RESPONSE TYPES - Server trả về cho Client sau khi emit
// ==========================================

/** Response cho event user:join */
export interface UserJoinResponse {
  status: 'joined'
  userId: string
}

/** Response cho event message:send */
export interface MessageSendResponse {
  id: string
  conversationId: string
  content: string
  createdAt: string
  error?: string
}

/** Response cho event typing:start/stop */
export interface TypingResponse {
  status: 'typing_started' | 'typing_stopped'
}

/** Response cho event conversation:join/leave */
export interface ConversationRoomResponse {
  status: 'joined' | 'left'
  conversationId: string
}

// ==========================================
// TYPE EXPORTS cho dễ sử dụng
// ==========================================

export type ClientEventName = (typeof CLIENT_EVENTS)[keyof typeof CLIENT_EVENTS]
export type ServerEventName = (typeof SERVER_EVENTS)[keyof typeof SERVER_EVENTS]
