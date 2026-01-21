import { io, Socket } from 'socket.io-client'
import useAuthStore from '@/store/useAuth'

// Socket configuration
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001'

// Socket events constants
export const SOCKET_EVENTS = {
  // Connection events
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error',

  // Chat events
  JOIN_CONVERSATION: 'join_conversation',
  LEAVE_CONVERSATION: 'leave_conversation',
  SEND_MESSAGE: 'send_message',
  RECEIVE_MESSAGE: 'receive_message',
  MESSAGE_SENT: 'message_sent',

  // Typing events
  TYPING_START: 'typing_start',
  TYPING_STOP: 'typing_stop',
  USER_TYPING: 'user_typing',

  // Presence events
  USER_ONLINE: 'user_online',
  USER_OFFLINE: 'user_offline',

  // Read receipts
  MESSAGE_READ: 'message_read',
  MESSAGES_READ: 'messages_read'
} as const

// Socket instance - lazy initialization
let socket: Socket | null = null

/**
 * Creates and returns a socket instance with authentication
 * Uses lazy initialization pattern to avoid connecting on import
 */
export const getSocket = (): Socket | null => {
  return socket
}

/**
 * Initializes socket connection with authentication token
 * Should be called when user enters chat page
 */
export const initializeSocket = (): Socket => {
  // Return existing socket if already connected
  if (socket?.connected) {
    return socket
  }

  // Get auth token from store
  const accessToken = useAuthStore.getState().accessToken

  // Create new socket instance with auth
  socket = io(SOCKET_URL, {
    transports: ['websocket'],
    withCredentials: true,
    autoConnect: false, // Manual connection control
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 10000,
    auth: {
      token: accessToken
    }
  })

  // Setup default event handlers
  setupSocketEventHandlers(socket)

  // Connect
  socket.connect()

  return socket
}

/**
 * Disconnects and cleans up socket connection
 * Should be called when user leaves chat page
 */
export const disconnectSocket = (): void => {
  if (socket) {
    socket.removeAllListeners()
    socket.disconnect()
    socket = null
  }
}

/**
 * Setup default socket event handlers for logging and debugging
 */
const setupSocketEventHandlers = (socketInstance: Socket): void => {
  socketInstance.on(SOCKET_EVENTS.CONNECT, () => {
    console.log('🔌 Socket connected:', socketInstance.id)
  })

  socketInstance.on(SOCKET_EVENTS.DISCONNECT, reason => {
    console.log('🔌 Socket disconnected:', reason)

    // Handle specific disconnect reasons
    if (reason === 'io server disconnect') {
      // Server initiated disconnect, might need to re-authenticate
      console.warn('Server disconnected the socket. Re-authentication may be required.')
    }
  })

  socketInstance.on(SOCKET_EVENTS.CONNECT_ERROR, error => {
    console.error('🔌 Socket connection error:', error.message)

    // Handle authentication errors
    if (error.message.includes('unauthorized') || error.message.includes('jwt')) {
      console.error('Authentication failed. Please re-login.')
      // Optionally trigger logout
      // useAuthStore.getState().logout()
    }
  })
}

/**
 * Utility to emit events with acknowledgment support
 */
export const emitWithAck = <T>(event: string, data: unknown, timeout = 5000): Promise<T> => {
  return new Promise((resolve, reject) => {
    if (!socket?.connected) {
      reject(new Error('Socket is not connected'))
      return
    }

    const timer = setTimeout(() => {
      reject(new Error(`Socket event "${event}" timed out`))
    }, timeout)

    socket.emit(event, data, (response: T) => {
      clearTimeout(timer)
      resolve(response)
    })
  })
}

export default socket
