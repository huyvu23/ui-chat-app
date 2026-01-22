/**
 * Socket.IO Client Configuration
 * Quản lý kết nối WebSocket với xác thực và reconnection
 */
import { io, Socket } from 'socket.io-client'
import useAuthStore from '@/store/useAuth'

// Re-export events for convenience
export * from './events'

// Socket instance
let socket: Socket | null = null

// Socket configuration
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001'
const SOCKET_OPTIONS = {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  transports: ['websocket']
}

/**
 * Initialize socket connection with authentication
 * Chỉ gọi khi user đã đăng nhập và cần kết nối socket
 */
export const initializeSocket = (): Socket => {
  if (socket?.connected) {
    return socket
  }

  const { accessToken } = useAuthStore.getState()

  socket = io(SOCKET_URL, {
    ...SOCKET_OPTIONS,
    auth: {
      token: accessToken
    }
  })

  // Setup connection event handlers
  socket.on('connect', () => {
    console.log('🔌 Socket connected:', socket?.id)
  })

  socket.on('disconnect', reason => {
    console.log('🔌 Socket disconnected:', reason)
  })

  socket.on('connect_error', error => {
    console.error('🔌 Socket connection error:', error.message)

    // Handle authentication error
    if (error.message === 'Authentication error') {
      console.error('🔌 Socket authentication failed')
      disconnectSocket()
    }
  })

  // Connect socket
  socket.connect()

  return socket
}

/**
 * Get current socket instance
 */
export const getSocket = (): Socket | null => socket

/**
 * Disconnect and cleanup socket
 */
export const disconnectSocket = (): void => {
  if (socket) {
    socket.removeAllListeners()
    socket.disconnect()
    socket = null
    console.log('🔌 Socket disconnected and cleaned up')
  }
}

/**
 * Check if socket is connected
 */
export const isSocketConnected = (): boolean => {
  return socket?.connected ?? false
}
