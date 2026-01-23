import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import useAuthStore from '@/store/useAuth'

// MUI IMPORT
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Stack from '@mui/material/Stack'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import Tooltip from '@mui/material/Tooltip'
import Badge from '@mui/material/Badge'
import Skeleton from '@mui/material/Skeleton'
import { styled, keyframes } from '@mui/material/styles'

// MUI Icons
import CallIcon from '@mui/icons-material/Call'
import VideocamIcon from '@mui/icons-material/Videocam'
import InfoIcon from '@mui/icons-material/Info'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import ImageIcon from '@mui/icons-material/Image'
import GifBoxIcon from '@mui/icons-material/GifBox'
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions'
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt'
import SendIcon from '@mui/icons-material/Send'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'

// SERVICE
import { getMessageInConversationId } from '@/service/MessagesService'
import { TResponseMessage } from '@/service/MessagesService/type'

// SOCKET
import useChatSocket from '@/hooks/useChatSocket'
import { NewMessagePayload } from '@/socket/events'

// Styled Components
const ChatContainer = styled(Box)({
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#ffffff'
})

const ChatHeader = styled(Box)({
  padding: '8px 16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
  backgroundColor: '#ffffff',
  minHeight: '60px'
})

const MessagesContainer = styled(Box)({
  flex: 1,
  overflowY: 'auto',
  padding: '16px',
  backgroundColor: '#ffffff',
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  '&::-webkit-scrollbar': {
    width: '8px'
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent'
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#bcc0c4',
    borderRadius: '4px'
  }
})

const MessageBubble = styled(Box)<{ isOwn?: boolean }>(({ isOwn }) => ({
  maxWidth: '60%',
  padding: '8px 12px',
  borderRadius: isOwn ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
  backgroundColor: isOwn ? '#0084ff' : '#e4e6e9',
  color: isOwn ? '#ffffff' : '#050505',
  wordWrap: 'break-word',
  fontSize: '15px',
  lineHeight: '1.4'
}))

const InputContainer = styled(Box)({
  padding: '8px 16px 12px 16px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  backgroundColor: '#ffffff',
  borderTop: '1px solid rgba(0, 0, 0, 0.05)'
})

const MessageInputWrapper = styled(Box)({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#f0f2f5',
  borderRadius: '20px',
  padding: '8px 12px',
  transition: 'all 0.2s ease',
  '&:focus-within': {
    backgroundColor: '#ffffff',
    boxShadow: '0 0 0 2px #0084ff'
  }
})

const StyledInputBase = styled(InputBase)({
  flex: 1,
  fontSize: '15px',
  '& input::placeholder': {
    color: '#65676b',
    opacity: 1
  }
})

const OnlineBadge = styled(Badge)({
  '& .MuiBadge-badge': {
    backgroundColor: '#31a24c',
    color: '#31a24c',
    boxShadow: '0 0 0 2px #ffffff',
    width: '10px',
    height: '10px',
    borderRadius: '50%'
  }
})

const ActionButton = styled(IconButton)({
  color: '#0084ff',
  padding: '6px',
  '&:hover': {
    backgroundColor: 'rgba(0, 132, 255, 0.1)'
  }
})

const HeaderButton = styled(IconButton)({
  color: '#0084ff',
  '&:hover': {
    backgroundColor: 'rgba(0, 132, 255, 0.1)'
  }
})

const EmptyStateContainer = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '32px'
})

// Typing indicator animation
const bounce = keyframes`
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-4px); }
`

const TypingIndicator = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  padding: '8px 12px',
  backgroundColor: '#e4e6e9',
  borderRadius: '18px',
  width: 'fit-content',
  '& .dot': {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#65676b',
    animation: `${bounce} 1.4s infinite ease-in-out`,
    '&:nth-of-type(1)': { animationDelay: '0s' },
    '&:nth-of-type(2)': { animationDelay: '0.2s' },
    '&:nth-of-type(3)': { animationDelay: '0.4s' }
  }
})

// Skeleton for loading messages
const MessageSkeleton = ({ isOwn }: { isOwn: boolean }) => (
  <Stack
    direction='row'
    justifyContent={isOwn ? 'flex-end' : 'flex-start'}
    alignItems='flex-end'
    spacing={1}
    sx={{ mb: 1 }}
  >
    {!isOwn && <Skeleton variant='circular' width={28} height={28} />}
    <Skeleton
      variant='rounded'
      width={Math.random() * 150 + 100}
      height={36}
      sx={{ borderRadius: isOwn ? '18px 18px 4px 18px' : '18px 18px 18px 4px' }}
    />
  </Stack>
)

// Generate avatar color based on name
const stringToColor = (string: string) => {
  let hash = 0
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash)
  }
  let color = '#'
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff
    color += `00${value.toString(16)}`.slice(-2)
  }
  return color
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Extended message type with grouping info
type TGroupedMessage = TResponseMessage & {
  isOwn: boolean
  isFirst: boolean
  isLast: boolean
}

const ChatWindow = () => {
  const searchParams = useSearchParams()
  const { user } = useAuthStore()
  const conversationId = searchParams.get('conversationId')

  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<TResponseMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Handle new message from socket
  const handleNewMessage = useCallback(
    (newMsg: NewMessagePayload) => {
      // Only add message if it's for the current conversation
      if (newMsg.conversationId === conversationId) {
        const messageToAdd: TResponseMessage = {
          id: newMsg.id,
          content: newMsg.content,
          conversationId: newMsg.conversationId,
          senderId: newMsg.senderId,
          sender: newMsg.sender,
          updatedAt: newMsg.updatedAt,
          type: newMsg.type
        }
        setMessages(prev => [...prev, messageToAdd])
      }
    },
    [conversationId]
  )

  // Initialize chat socket
  const {
    isConnected,
    sendMessage: socketSendMessage,
    startTyping,
    stopTyping,
    typingUsers,
    onlineUsers
  } = useChatSocket({
    conversationId,
    onNewMessage: handleNewMessage
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Fetch messages when conversationId changes
  useEffect(() => {
    if (!conversationId) {
      setMessages([])
      return
    }

    const fetchMessages = async () => {
      try {
        setIsLoading(true)
        const response = await getMessageInConversationId(conversationId)
        setMessages(response.data.messages)
      } catch (error) {
        console.error('Failed to fetch messages:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMessages()
  }, [conversationId])

  // Scroll to bottom when messages change
  useEffect(() => {
    if (!isLoading) {
      scrollToBottom()
    }
  }, [messages, isLoading])

  // Handle input change with typing indicator
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
    if (e.target.value.trim()) {
      startTyping()
    } else {
      stopTyping()
    }
  }

  const handleSendMessage = async () => {
    if (!message.trim() || !conversationId || isSending) return

    const messageContent = message.trim()
    setMessage('')
    stopTyping()

    // Optimistic update - add message immediately
    const tempId = `temp-${Date.now()}`
    const optimisticMessage: TResponseMessage = {
      id: tempId,
      content: messageContent,
      conversationId: conversationId,
      senderId: user?.id || '',
      sender: user!,
      updatedAt: new Date().toISOString(),
      type: 'TEXT'
    }
    setMessages(prev => [...prev, optimisticMessage])

    // Send via socket
    if (isConnected) {
      setIsSending(true)
      try {
        const response = await socketSendMessage(messageContent)
        if (response?.id) {
          // Update temp message with real ID
          setMessages(prev => prev.map(msg => (msg.id === tempId ? { ...msg, id: response.id } : msg)))
        }
      } catch (error) {
        console.error('Failed to send message:', error)
        // Could remove optimistic message or show error state
      } finally {
        setIsSending(false)
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleSendLike = async () => {
    if (!conversationId || isSending) return

    const tempId = `temp-${Date.now()}`
    const optimisticMessage: TResponseMessage = {
      id: tempId,
      content: '👍',
      conversationId: conversationId,
      senderId: user?.id || '',
      sender: user!,
      updatedAt: new Date().toISOString(),
      type: 'TEXT'
    }
    setMessages(prev => [...prev, optimisticMessage])

    if (isConnected) {
      await socketSendMessage('👍')
    }
  }

  // Group consecutive messages by sender
  const groupedMessages: TGroupedMessage[] = messages.reduce((acc: TGroupedMessage[], msg, index) => {
    // Use sender.id instead of senderId as backend may return incorrect senderId
    const isOwn = msg.sender?.id === user?.id
    const prevMsg = messages[index - 1]
    const isNewGroup = !prevMsg || prevMsg.senderId !== msg.senderId

    if (isNewGroup) {
      acc.push({ ...msg, isOwn, isFirst: true, isLast: true })
    } else {
      // Update previous message's isLast
      if (acc.length > 0) {
        acc[acc.length - 1].isLast = false
      }
      acc.push({ ...msg, isOwn, isFirst: false, isLast: true })
    }
    return acc
  }, [])

  // Get typing users for current conversation (excluding self)
  const typingUsersInConversation = Array.from(typingUsers.values()).filter(
    t => t.conversationId === conversationId && t.userId !== user?.id
  )

  // No conversation selected state
  if (!conversationId) {
    return (
      <ChatContainer>
        <EmptyStateContainer>
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              bgcolor: '#f0f2f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3
            }}
          >
            <ChatBubbleOutlineIcon sx={{ fontSize: 50, color: '#65676b' }} />
          </Box>
          <Typography
            sx={{
              fontSize: '20px',
              fontWeight: 600,
              color: '#050505',
              mb: 1
            }}
          >
            Chọn một cuộc trò chuyện
          </Typography>
          <Typography
            sx={{
              fontSize: '14px',
              color: '#65676b',
              textAlign: 'center',
              maxWidth: 300
            }}
          >
            Chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu nhắn tin
          </Typography>
        </EmptyStateContainer>
      </ChatContainer>
    )
  }

  // Get display info for header (first message sender that is not current user)
  const otherUser = messages.find(m => m.senderId !== user?.id)?.sender
  const displayName = otherUser?.username || 'Đang tải...'
  const otherUserId = otherUser?.id
  const isOnline = otherUserId ? onlineUsers.has(otherUserId) : false
  // console.log('onlineUsers:', onlineUsers)

  return (
    <ChatContainer>
      {/* Header */}
      <ChatHeader>
        <Stack direction='row' alignItems='center' spacing={1.5}>
          {isLoading ? (
            <>
              <Skeleton variant='circular' width={40} height={40} />
              <Box>
                <Skeleton variant='text' width={120} height={24} />
                <Skeleton variant='text' width={80} height={16} />
              </Box>
            </>
          ) : (
            <>
              <OnlineBadge
                overlap='circular'
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant={isOnline ? 'dot' : 'standard'}
              >
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: stringToColor(displayName),
                    fontSize: '14px',
                    fontWeight: 600
                  }}
                >
                  {getInitials(displayName)}
                </Avatar>
              </OnlineBadge>
              <Box>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: '15px',
                    color: '#050505',
                    lineHeight: 1.2
                  }}
                >
                  {displayName}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '12px',
                    color: isOnline ? '#31a24c' : '#65676b'
                  }}
                >
                  {isOnline ? 'Đang hoạt động' : 'Không hoạt động'}
                </Typography>
              </Box>
            </>
          )}
        </Stack>
        <Stack direction='row' spacing={0.5}>
          <Tooltip title='Gọi điện'>
            <HeaderButton>
              <CallIcon sx={{ fontSize: 22 }} />
            </HeaderButton>
          </Tooltip>
          <Tooltip title='Gọi video'>
            <HeaderButton>
              <VideocamIcon sx={{ fontSize: 24 }} />
            </HeaderButton>
          </Tooltip>
          <Tooltip title='Thông tin'>
            <HeaderButton>
              <InfoIcon sx={{ fontSize: 22 }} />
            </HeaderButton>
          </Tooltip>
        </Stack>
      </ChatHeader>

      {/* Messages */}
      <MessagesContainer>
        {/* Loading State */}
        {isLoading && (
          <>
            <MessageSkeleton isOwn={false} />
            <MessageSkeleton isOwn={true} />
            <MessageSkeleton isOwn={false} />
            <MessageSkeleton isOwn={false} />
            <MessageSkeleton isOwn={true} />
            <MessageSkeleton isOwn={true} />
            <MessageSkeleton isOwn={false} />
          </>
        )}

        {/* Empty Messages State */}
        {!isLoading && messages.length === 0 && (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography sx={{ color: '#65676b', fontSize: '14px' }}>
              Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!
            </Typography>
          </Box>
        )}

        {/* Messages List */}
        {!isLoading &&
          groupedMessages.map(msg => (
            <Stack
              key={msg.id}
              direction='row'
              justifyContent={msg.isOwn ? 'flex-end' : 'flex-start'}
              alignItems='flex-end'
              spacing={1}
              sx={{ mb: msg.isLast ? 1.5 : 0.3 }}
            >
              {/* Avatar for received messages */}
              {!msg.isOwn && (
                <Box sx={{ width: 28, height: 28 }}>
                  {msg.isLast && (
                    <Avatar
                      sx={{
                        width: 28,
                        height: 28,
                        bgcolor: stringToColor(msg.sender?.username || 'U'),
                        fontSize: '11px',
                        fontWeight: 600
                      }}
                    >
                      {getInitials(msg.sender?.username || 'U')}
                    </Avatar>
                  )}
                </Box>
              )}
              <MessageBubble isOwn={msg.isOwn}>{msg.content}</MessageBubble>
            </Stack>
          ))}

        {/* Typing Indicator */}
        {typingUsersInConversation.length > 0 && (
          <Stack direction='row' alignItems='flex-end' spacing={1} sx={{ mb: 1.5 }}>
            <Box sx={{ width: 28, height: 28 }}>
              <Avatar
                sx={{
                  width: 28,
                  height: 28,
                  bgcolor: stringToColor(typingUsersInConversation[0].username),
                  fontSize: '11px',
                  fontWeight: 600
                }}
              >
                {getInitials(typingUsersInConversation[0].username)}
              </Avatar>
            </Box>
            <TypingIndicator>
              <Box className='dot' />
              <Box className='dot' />
              <Box className='dot' />
            </TypingIndicator>
          </Stack>
        )}

        <div ref={messagesEndRef} />
      </MessagesContainer>

      {/* Input */}
      <InputContainer>
        <Tooltip title='Mở thêm tùy chọn'>
          <ActionButton>
            <AddCircleIcon sx={{ fontSize: 24 }} />
          </ActionButton>
        </Tooltip>
        <Tooltip title='Đính kèm ảnh'>
          <ActionButton>
            <ImageIcon sx={{ fontSize: 22 }} />
          </ActionButton>
        </Tooltip>
        <Tooltip title='Chọn GIF'>
          <ActionButton>
            <GifBoxIcon sx={{ fontSize: 22 }} />
          </ActionButton>
        </Tooltip>

        <MessageInputWrapper>
          <StyledInputBase
            placeholder='Aa'
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            onBlur={stopTyping}
            fullWidth
            disabled={isSending}
          />
          <Tooltip title='Chọn emoji'>
            <IconButton sx={{ color: '#0084ff', p: 0.5 }}>
              <EmojiEmotionsIcon sx={{ fontSize: 22 }} />
            </IconButton>
          </Tooltip>
        </MessageInputWrapper>

        {message.trim() ? (
          <Tooltip title='Gửi'>
            <ActionButton onClick={handleSendMessage} disabled={isSending}>
              <SendIcon sx={{ fontSize: 22 }} />
            </ActionButton>
          </Tooltip>
        ) : (
          <Tooltip title='Gửi lượt thích'>
            <ActionButton onClick={handleSendLike} disabled={isSending}>
              <ThumbUpAltIcon sx={{ fontSize: 22 }} />
            </ActionButton>
          </Tooltip>
        )}
      </InputContainer>
    </ChatContainer>
  )
}

export default ChatWindow
