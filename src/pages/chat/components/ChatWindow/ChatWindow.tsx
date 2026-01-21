import React, { useState, useRef, useEffect } from 'react'

// MUI IMPORT
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Stack from '@mui/material/Stack'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import Tooltip from '@mui/material/Tooltip'
import Badge from '@mui/material/Badge'
import { styled } from '@mui/material/styles'

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

// Mock messages data
const mockMessages = [
    {
        id: 1,
        text: 'Chào bạn! 👋',
        isOwn: false,
        time: '10:30'
    },
    {
        id: 2,
        text: 'Chào bạn! Khỏe không?',
        isOwn: true,
        time: '10:31'
    },
    {
        id: 3,
        text: 'Mình khỏe, cảm ơn bạn! Bạn dạo này thế nào?',
        isOwn: false,
        time: '10:32'
    },
    {
        id: 4,
        text: 'Mình cũng ổn, đang làm dự án mới khá thú vị',
        isOwn: true,
        time: '10:33'
    },
    {
        id: 5,
        text: 'Hay quá! Dự án về cái gì vậy?',
        isOwn: false,
        time: '10:34'
    },
    {
        id: 6,
        text: 'Là một ứng dụng chat real-time giống Messenger, đang xây dựng UI cho nó 😄',
        isOwn: true,
        time: '10:35'
    },
    {
        id: 7,
        text: 'Nghe hay đấy! Bạn dùng công nghệ gì?',
        isOwn: false,
        time: '10:36'
    },
    {
        id: 8,
        text: 'Mình dùng Next.js với Material UI, backend thì NestJS với PostgreSQL',
        isOwn: true,
        time: '10:37'
    },
    {
        id: 9,
        text: 'Stack xịn đấy! Chúc bạn hoàn thành sớm nhé 🎉',
        isOwn: false,
        time: '10:38'
    }
]

// Mock selected user
const selectedUser = {
    name: 'Nguyễn Văn A',
    isOnline: true,
    lastSeen: 'Đang hoạt động'
}

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

const ChatWindow = () => {
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState(mockMessages)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSendMessage = () => {
        if (message.trim()) {
            const newMessage = {
                id: messages.length + 1,
                text: message.trim(),
                isOwn: true,
                time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
            }
            setMessages([...messages, newMessage])
            setMessage('')
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    const handleSendLike = () => {
        const newMessage = {
            id: messages.length + 1,
            text: '👍',
            isOwn: true,
            time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        }
        setMessages([...messages, newMessage])
    }

    // Group consecutive messages by sender
    const groupedMessages = messages.reduce((acc: any[], msg, index) => {
        const prevMsg = messages[index - 1]
        const isNewGroup = !prevMsg || prevMsg.isOwn !== msg.isOwn

        if (isNewGroup) {
            acc.push({ ...msg, isFirst: true, isLast: true })
        } else {
            // Update previous message's isLast
            acc[acc.length - 1].isLast = false
            acc.push({ ...msg, isFirst: false, isLast: true })
        }
        return acc
    }, [])

    return (
        <ChatContainer>
            {/* Header */}
            <ChatHeader>
                <Stack direction='row' alignItems='center' spacing={1.5}>
                    <OnlineBadge
                        overlap='circular'
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        variant={selectedUser.isOnline ? 'dot' : 'standard'}
                    >
                        <Avatar
                            sx={{
                                width: 40,
                                height: 40,
                                bgcolor: stringToColor(selectedUser.name),
                                fontSize: '14px',
                                fontWeight: 600
                            }}
                        >
                            {getInitials(selectedUser.name)}
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
                            {selectedUser.name}
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: '12px',
                                color: selectedUser.isOnline ? '#31a24c' : '#65676b'
                            }}
                        >
                            {selectedUser.lastSeen}
                        </Typography>
                    </Box>
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
                {groupedMessages.map((msg, index) => (
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
                                            bgcolor: stringToColor(selectedUser.name),
                                            fontSize: '11px',
                                            fontWeight: 600
                                        }}
                                    >
                                        {getInitials(selectedUser.name)}
                                    </Avatar>
                                )}
                            </Box>
                        )}
                        <MessageBubble isOwn={msg.isOwn}>{msg.text}</MessageBubble>
                    </Stack>
                ))}
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
                        onChange={e => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        fullWidth
                    />
                    <Tooltip title='Chọn emoji'>
                        <IconButton sx={{ color: '#0084ff', p: 0.5 }}>
                            <EmojiEmotionsIcon sx={{ fontSize: 22 }} />
                        </IconButton>
                    </Tooltip>
                </MessageInputWrapper>

                {message.trim() ? (
                    <Tooltip title='Gửi'>
                        <ActionButton onClick={handleSendMessage}>
                            <SendIcon sx={{ fontSize: 22 }} />
                        </ActionButton>
                    </Tooltip>
                ) : (
                    <Tooltip title='Gửi lượt thích'>
                        <ActionButton onClick={handleSendLike}>
                            <ThumbUpAltIcon sx={{ fontSize: 22 }} />
                        </ActionButton>
                    </Tooltip>
                )}
            </InputContainer>
        </ChatContainer>
    )
}

export default ChatWindow