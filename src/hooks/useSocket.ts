import { useEffect, useRef, useCallback, useState } from 'react'
import { Socket } from 'socket.io-client'
import { initializeSocket, disconnectSocket, getSocket } from '@/socket'

// Socket connection status
export type SocketStatus = 'connecting' | 'connected' | 'disconnected' | 'error'

interface UseSocketReturn {
  socket: Socket | null
  status: SocketStatus
  isConnected: boolean
  emit: (event: string, data?: unknown) => void
  on: (event: string, callback: (...args: unknown[]) => void) => void
  off: (event: string, callback?: (...args: unknown[]) => void) => void
}

/**
 * Custom hook for managing socket connection
 * Handles connection lifecycle, cleanup, and provides utilities
 */
export const useSocket = (): UseSocketReturn => {
  const [status, setStatus] = useState<SocketStatus>('disconnected')
  const socketRef = useRef<Socket | null>(null)
  const listenersRef = useRef<Map<string, Set<(...args: unknown[]) => void>>>(new Map())

  // Initialize socket on mount, cleanup on unmount
  useEffect(() => {
    setStatus('connecting')

    // Initialize socket connection
    const socketInstance = initializeSocket()
    socketRef.current = socketInstance

    // Setup status listeners
    const handleConnect = () => {
      setStatus('connected')
    }

    const handleDisconnect = () => {
      setStatus('disconnected')
    }

    const handleConnectError = () => {
      setStatus('error')
    }

    socketInstance.on('connect', handleConnect)
    socketInstance.on('disconnect', handleDisconnect)
    socketInstance.on('connect_error', handleConnectError)

    // Set initial status
    if (socketInstance.connected) {
      setStatus('connected')
    }

    // Cleanup on unmount
    return () => {
      // Remove all registered listeners
      listenersRef.current.forEach((callbacks, event) => {
        callbacks.forEach(callback => {
          socketInstance.off(event, callback)
        })
      })
      listenersRef.current.clear()

      // Disconnect socket
      disconnectSocket()
      socketRef.current = null
      setStatus('disconnected')
    }
  }, [])

  // Emit event
  const emit = useCallback((event: string, data?: unknown) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data)
    } else {
      console.warn(`Cannot emit "${event}": Socket is not connected`)
    }
  }, [])

  // Subscribe to event
  const on = useCallback((event: string, callback: (...args: unknown[]) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback)

      // Track listener for cleanup
      if (!listenersRef.current.has(event)) {
        listenersRef.current.set(event, new Set())
      }
      listenersRef.current.get(event)?.add(callback)
    }
  }, [])

  // Unsubscribe from event
  const off = useCallback((event: string, callback?: (...args: unknown[]) => void) => {
    if (socketRef.current) {
      if (callback) {
        socketRef.current.off(event, callback)
        listenersRef.current.get(event)?.delete(callback)
      } else {
        socketRef.current.off(event)
        listenersRef.current.delete(event)
      }
    }
  }, [])

  return {
    socket: socketRef.current,
    status,
    isConnected: status === 'connected',
    emit,
    on,
    off
  }
}

export default useSocket
