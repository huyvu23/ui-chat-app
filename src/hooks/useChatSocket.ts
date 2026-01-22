import { useCallback, useEffect, useRef, useState } from 'react'
import useSocket from './useSocket'
import useAuthStore from '@/store/useAuth'
import {
    CLIENT_EVENTS,
    SERVER_EVENTS,
    SendMessagePayload,
    TypingPayload,
    ConversationRoomPayload,
    NewMessagePayload,
    TypingUserPayload,
    UserOnlinePayload,
    UserOfflinePayload,
    MessageSendResponse
} from '@/socket/events'

interface UseChatSocketOptions {
    conversationId?: string | null
    onNewMessage?: (message: NewMessagePayload) => void
    onUserTyping?: (data: TypingUserPayload) => void
    onUserOnline?: (data: UserOnlinePayload) => void
    onUserOffline?: (data: UserOfflinePayload) => void
}

interface UseChatSocketReturn {
    // Connection status
    isConnected: boolean
    status: string

    // Actions
    sendMessage: (content: string) => Promise<MessageSendResponse | null>
    startTyping: () => void
    stopTyping: () => void
    joinConversation: (conversationId: string) => void
    leaveConversation: (conversationId: string) => void

    // State
    typingUsers: Map<string, TypingUserPayload>
    onlineUsers: Set<string>
}

/**
 * Custom hook for chat-specific socket functionality
 * Handles message sending, typing indicators, and user presence
 */
export const useChatSocket = (options: UseChatSocketOptions = {}): UseChatSocketReturn => {
    const { conversationId, onNewMessage, onUserTyping, onUserOnline, onUserOffline } = options
    const { socket, isConnected, status, emit, on, off } = useSocket()
    const { user } = useAuthStore()

    // State for typing users and online users
    const [typingUsers, setTypingUsers] = useState<Map<string, TypingUserPayload>>(new Map())
    const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set())

    // Track previous conversation for cleanup
    const prevConversationRef = useRef<string | null>(null)

    // Typing debounce timer
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const isTypingRef = useRef(false)

    // ==========================================
    // EVENT HANDLERS
    // ==========================================

    // Handle new message
    useEffect(() => {
        if (!isConnected) return

        const handleNewMessage = (message: NewMessagePayload) => {
            console.log('📩 New message received:', message)
            onNewMessage?.(message)
        }

        on(SERVER_EVENTS.MESSAGE_NEW, handleNewMessage as (...args: unknown[]) => void)

        return () => {
            off(SERVER_EVENTS.MESSAGE_NEW, handleNewMessage as (...args: unknown[]) => void)
        }
    }, [isConnected, on, off, onNewMessage])

    // Handle user typing
    useEffect(() => {
        if (!isConnected) return

        const handleTyping = (data: TypingUserPayload) => {
            console.log('⌨️ Typing event:', data)

            setTypingUsers(prev => {
                const newMap = new Map(prev)
                if (data.isTyping) {
                    newMap.set(data.userId, data)
                } else {
                    newMap.delete(data.userId)
                }
                return newMap
            })

            onUserTyping?.(data)
        }

        on(SERVER_EVENTS.TYPING_USER, handleTyping as (...args: unknown[]) => void)

        return () => {
            off(SERVER_EVENTS.TYPING_USER, handleTyping as (...args: unknown[]) => void)
        }
    }, [isConnected, on, off, onUserTyping])

    // Handle user online/offline
    useEffect(() => {
        if (!isConnected) return

        const handleUserOnline = (data: UserOnlinePayload) => {
            console.log('🟢 User online:', data)
            setOnlineUsers(prev => new Set(prev).add(data.userId))
            onUserOnline?.(data)
        }

        const handleUserOffline = (data: UserOfflinePayload) => {
            console.log('⚫ User offline:', data)
            setOnlineUsers(prev => {
                const newSet = new Set(prev)
                newSet.delete(data.userId)
                return newSet
            })
            onUserOffline?.(data)
        }

        on(SERVER_EVENTS.USER_ONLINE, handleUserOnline as (...args: unknown[]) => void)
        on(SERVER_EVENTS.USER_OFFLINE, handleUserOffline as (...args: unknown[]) => void)

        return () => {
            off(SERVER_EVENTS.USER_ONLINE, handleUserOnline as (...args: unknown[]) => void)
            off(SERVER_EVENTS.USER_OFFLINE, handleUserOffline as (...args: unknown[]) => void)
        }
    }, [isConnected, on, off, onUserOnline, onUserOffline])

    // ==========================================
    // CONVERSATION ROOM MANAGEMENT
    // ==========================================

    // Join user after connection
    useEffect(() => {
        if (!isConnected || !user?.id) return

        emit(CLIENT_EVENTS.USER_JOIN, { userId: user.id })
    }, [isConnected, user?.id, emit])

    // Auto join/leave conversation room when conversationId changes
    useEffect(() => {
        if (!isConnected || !conversationId) return

        // Leave previous conversation
        if (prevConversationRef.current && prevConversationRef.current !== conversationId) {
            emit(CLIENT_EVENTS.CONVERSATION_LEAVE, {
                conversationId: prevConversationRef.current
            } as ConversationRoomPayload)
            console.log('🚪 Left conversation:', prevConversationRef.current)
        }

        // Join new conversation
        emit(CLIENT_EVENTS.CONVERSATION_JOIN, { conversationId } as ConversationRoomPayload)
        console.log('🚪 Joined conversation:', conversationId)

        prevConversationRef.current = conversationId

        // Cleanup: leave conversation on unmount
        return () => {
            if (conversationId) {
                emit(CLIENT_EVENTS.CONVERSATION_LEAVE, { conversationId } as ConversationRoomPayload)
            }
        }
    }, [isConnected, conversationId, emit])

    // ==========================================
    // ACTIONS
    // ==========================================

    /**
     * Send a message to the current conversation
     */
    const sendMessage = useCallback(
        async (content: string): Promise<MessageSendResponse | null> => {
            if (!conversationId || !content.trim()) {
                console.warn('Cannot send message: missing conversationId or content')
                return null
            }

            const payload: SendMessagePayload = {
                conversationId,
                content: content.trim()
            }

            return new Promise(resolve => {
                socket?.emit(CLIENT_EVENTS.MESSAGE_SEND, payload, (response: MessageSendResponse) => {
                    console.log('📤 Message sent, response:', response)
                    resolve(response)
                })

                // Timeout fallback
                setTimeout(() => resolve(null), 5000)
            })
        },
        [conversationId, socket]
    )

    /**
     * Start typing indicator
     */
    const startTyping = useCallback(() => {
        if (!conversationId || isTypingRef.current) return

        isTypingRef.current = true
        emit(CLIENT_EVENTS.TYPING_START, { conversationId } as TypingPayload)

        // Auto stop after 3 seconds of inactivity
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
        }
        typingTimeoutRef.current = setTimeout(() => {
            stopTyping()
        }, 3000)
    }, [conversationId, emit])

    /**
     * Stop typing indicator
     */
    const stopTyping = useCallback(() => {
        if (!conversationId || !isTypingRef.current) return

        isTypingRef.current = false
        emit(CLIENT_EVENTS.TYPING_STOP, { conversationId } as TypingPayload)

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
            typingTimeoutRef.current = null
        }
    }, [conversationId, emit])

    /**
     * Manually join a conversation room
     */
    const joinConversation = useCallback(
        (convId: string) => {
            emit(CLIENT_EVENTS.CONVERSATION_JOIN, { conversationId: convId } as ConversationRoomPayload)
        },
        [emit]
    )

    /**
     * Manually leave a conversation room
     */
    const leaveConversation = useCallback(
        (convId: string) => {
            emit(CLIENT_EVENTS.CONVERSATION_LEAVE, { conversationId: convId } as ConversationRoomPayload)
        },
        [emit]
    )

    // Cleanup typing timeout on unmount
    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current)
            }
        }
    }, [])

    return {
        isConnected,
        status,
        sendMessage,
        startTyping,
        stopTyping,
        joinConversation,
        leaveConversation,
        typingUsers,
        onlineUsers
    }
}

export default useChatSocket
