import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import useAuthStore from '@/store/useAuth'

// MUI IMPORT
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Stack from '@mui/material/Stack'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import Badge from '@mui/material/Badge'
import Tooltip from '@mui/material/Tooltip'
import Skeleton from '@mui/material/Skeleton'
import { styled } from '@mui/material/styles'

// MUI Icons
import SearchIcon from '@mui/icons-material/Search'
import EditNoteIcon from '@mui/icons-material/EditNote'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import LogoutIcon from '@mui/icons-material/Logout'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'

// SERVICE
import { TResponseConversation } from '@/service/ConversationService/type'
import { getConversation } from '@/service/ConversationService'

// Styled Components
const SidebarContainer = styled(Box)({
    height: '100vh',
    backgroundColor: '#ffffff',
    borderRight: '1px solid rgba(0, 0, 0, 0.08)',
    display: 'flex',
    flexDirection: 'column'
})

const Header = styled(Box)({
    padding: '16px 16px 8px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
})

const SearchWrapper = styled(Box)({
    padding: '8px 16px 12px 16px'
})

const SearchBox = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
    borderRadius: '20px',
    padding: '8px 12px',
    transition: 'all 0.2s ease',
    '&:hover': {
        backgroundColor: '#e4e6e9'
    },
    '&:focus-within': {
        backgroundColor: '#ffffff',
        boxShadow: '0 0 0 2px #0084ff'
    }
})

const StyledInputBase = styled(InputBase)({
    marginLeft: 8,
    flex: 1,
    fontSize: '15px',
    '& input::placeholder': {
        color: '#65676b',
        opacity: 1
    }
})

const ConversationList = styled(List)({
    flex: 1,
    overflowY: 'auto',
    padding: '4px 8px',
    '&::-webkit-scrollbar': {
        width: '8px'
    },
    '&::-webkit-scrollbar-track': {
        background: 'transparent'
    },
    '&::-webkit-scrollbar-thumb': {
        background: '#bcc0c4',
        borderRadius: '4px'
    },
    '&::-webkit-scrollbar-thumb:hover': {
        background: '#a8a8a8'
    }
})

const ConversationItem = styled(ListItemButton)<{ selected?: boolean }>(({ selected }) => ({
    borderRadius: '8px',
    padding: '8px 10px',
    marginBottom: '2px',
    backgroundColor: selected ? '#ebf5ff' : 'transparent',
    transition: 'background-color 0.15s ease',
    '&:hover': {
        backgroundColor: selected ? '#ebf5ff' : '#f2f2f2'
    }
}))

const OnlineBadge = styled(Badge)({
    '& .MuiBadge-badge': {
        backgroundColor: '#31a24c',
        color: '#31a24c',
        boxShadow: `0 0 0 2px #ffffff`,
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: 'ripple 1.2s infinite ease-in-out',
            border: '1px solid currentColor',
            content: '""'
        }
    },
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(.8)',
            opacity: 1
        },
        '100%': {
            transform: 'scale(2.4)',
            opacity: 0
        }
    }
})

// Skeleton Loading Item Component
const ConversationSkeleton = () => (
    <ListItem disablePadding sx={{ mb: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', p: '8px 10px', width: '100%' }}>
            <Skeleton variant='circular' width={56} height={56} sx={{ flexShrink: 0 }} />
            <Box sx={{ ml: 1.5, flex: 1 }}>
                <Skeleton variant='text' width='70%' height={24} />
                <Skeleton variant='text' width='90%' height={20} />
            </Box>
        </Box>
    </ListItem>
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

// Format time helper
const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Vừa xong'
    if (diffMins < 60) return `${diffMins} phút`
    if (diffHours < 24) return `${diffHours} giờ`
    if (diffDays === 1) return 'Hôm qua'
    if (diffDays < 7) return `${diffDays} ngày`
    return date.toLocaleDateString('vi-VN')
}

export default function Sidebar() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { user, logout } = useAuthStore()
    const [searchQuery, setSearchQuery] = useState('')
    const [conversations, setConversations] = useState<TResponseConversation[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)

    // Get conversationId from URL
    const selectedConversation = searchParams.get('conversationId')

    // Handle conversation selection - update URL
    const handleSelectConversation = (conversationId: string) => {
        router.push(`/chat?conversationId=${conversationId}`, { scroll: false })
    }

    const getAllConversation = async () => {
        try {
            setIsLoading(true)
            const response = await getConversation()
            setConversations(response.data)

            // If no conversation selected in URL, select first one
            if (!selectedConversation && response.data.length) {
                router.replace(`/chat?conversationId=${response.data[0].id}`, { scroll: false })
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getAllConversation()
    }, [])

    const handleLogout = () => {
        logout()
        router.push('/dang-nhap')
    }

    // Get conversation display name (for DIRECT chat, show other participant's name)
    const getConversationName = (conversation: TResponseConversation): string => {
        if (conversation.type === 'GROUP') {
            return conversation.name || 'Nhóm chat'
        }
        // For DIRECT chat, find the other participant
        const otherParticipant = conversation.participants.find(p => p.userId !== user?.id)
        return otherParticipant?.user?.username || 'Người dùng'
    }

    // Filter conversations by search query
    const filteredConversations = conversations.filter(conv => {
        const name = getConversationName(conv)
        return name.toLowerCase().includes(searchQuery.toLowerCase())
    })

    return (
        <SidebarContainer>
            {/* Header */}
            <Header>
                <Stack direction='row' alignItems='center' spacing={1.5}>
                    <Avatar
                        sx={{
                            width: 40,
                            height: 40,
                            bgcolor: stringToColor(user?.username || 'User'),
                            fontSize: '16px',
                            fontWeight: 600
                        }}
                    >
                        {getInitials(user?.username || 'U')}
                    </Avatar>
                    <Typography
                        variant='h5'
                        sx={{
                            fontWeight: 700,
                            color: '#050505',
                            fontSize: '24px'
                        }}
                    >
                        Chat
                    </Typography>
                </Stack>
                <Stack direction='row' spacing={0.5}>
                    <Tooltip title='Tùy chọn'>
                        <IconButton
                            sx={{
                                bgcolor: '#e4e6e9',
                                '&:hover': { bgcolor: '#d8dadf' }
                            }}
                        >
                            <MoreHorizIcon sx={{ fontSize: 20, color: '#050505' }} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title='Tin nhắn mới'>
                        <IconButton
                            sx={{
                                bgcolor: '#e4e6e9',
                                '&:hover': { bgcolor: '#d8dadf' }
                            }}
                        >
                            <EditNoteIcon sx={{ fontSize: 20, color: '#050505' }} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title='Đăng xuất'>
                        <IconButton
                            onClick={handleLogout}
                            sx={{
                                bgcolor: '#e4e6e9',
                                '&:hover': { bgcolor: '#ffebee' }
                            }}
                        >
                            <LogoutIcon sx={{ fontSize: 20, color: '#d32f2f' }} />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Header>

            {/* Search */}
            <SearchWrapper>
                <SearchBox>
                    <SearchIcon sx={{ color: '#65676b', fontSize: 20 }} />
                    <StyledInputBase
                        placeholder='Tìm kiếm trên Messenger'
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </SearchBox>
            </SearchWrapper>

            {/* Conversation List */}
            <ConversationList>
                {/* Loading State */}
                {isLoading && (
                    <>
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <ConversationSkeleton key={i} />
                        ))}
                    </>
                )}

                {/* Conversations List */}
                {!isLoading &&
                    filteredConversations.map(conversation => {
                        const conversationName = getConversationName(conversation)
                        const isOnline = false // TODO: Implement online status
                        const unreadCount = 0 // TODO: Implement unread count

                        return (
                            <ListItem key={conversation.id} disablePadding>
                                <ConversationItem
                                    selected={selectedConversation === conversation.id}
                                    onClick={() => handleSelectConversation(conversation.id)}
                                >
                                    <Stack direction='row' spacing={1.5} alignItems='center' sx={{ width: '100%' }}>
                                        {/* Avatar with online status */}
                                        {isOnline ? (
                                            <OnlineBadge
                                                overlap='circular'
                                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                                variant='dot'
                                            >
                                                <Avatar
                                                    sx={{
                                                        width: 56,
                                                        height: 56,
                                                        bgcolor: stringToColor(conversationName),
                                                        fontSize: '18px',
                                                        fontWeight: 600
                                                    }}
                                                >
                                                    {getInitials(conversationName)}
                                                </Avatar>
                                            </OnlineBadge>
                                        ) : (
                                            <Avatar
                                                sx={{
                                                    width: 56,
                                                    height: 56,
                                                    bgcolor: stringToColor(conversationName),
                                                    fontSize: '18px',
                                                    fontWeight: 600
                                                }}
                                            >
                                                {getInitials(conversationName)}
                                            </Avatar>
                                        )}

                                        {/* Conversation Info */}
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Stack direction='row' justifyContent='space-between' alignItems='center'>
                                                <Typography
                                                    sx={{
                                                        fontWeight: unreadCount > 0 ? 700 : 500,
                                                        fontSize: '15px',
                                                        color: '#050505',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                >
                                                    {conversationName}
                                                </Typography>
                                                <Typography
                                                    sx={{
                                                        fontSize: '12px',
                                                        color: unreadCount > 0 ? '#0084ff' : '#65676b',
                                                        fontWeight: unreadCount > 0 ? 600 : 400,
                                                        flexShrink: 0,
                                                        ml: 1
                                                    }}
                                                >
                                                    {formatTime(conversation.updatedAt)}
                                                </Typography>
                                            </Stack>
                                            <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ mt: 0.3 }}>
                                                <Typography
                                                    sx={{
                                                        fontSize: '13px',
                                                        color: unreadCount > 0 ? '#050505' : '#65676b',
                                                        fontWeight: unreadCount > 0 ? 600 : 400,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        pr: 1
                                                    }}
                                                >
                                                    {conversation.type === 'GROUP'
                                                        ? `${conversation.participants.length} thành viên`
                                                        : 'Nhấn để bắt đầu trò chuyện'}
                                                </Typography>
                                                {unreadCount > 0 && (
                                                    <Box
                                                        sx={{
                                                            bgcolor: '#0084ff',
                                                            color: '#ffffff',
                                                            borderRadius: '50%',
                                                            minWidth: '20px',
                                                            height: '20px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '12px',
                                                            fontWeight: 600,
                                                            flexShrink: 0
                                                        }}
                                                    >
                                                        {unreadCount}
                                                    </Box>
                                                )}
                                            </Stack>
                                        </Box>
                                    </Stack>
                                </ConversationItem>
                            </ListItem>
                        )
                    })}

                {/* Empty State - No Search Results */}
                {!isLoading && searchQuery && filteredConversations.length === 0 && (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            py: 4
                        }}
                    >
                        <SearchIcon sx={{ fontSize: 48, color: '#bcc0c4', mb: 1 }} />
                        <Typography sx={{ color: '#65676b', fontSize: '14px' }}>Không tìm thấy cuộc trò chuyện</Typography>
                    </Box>
                )}

                {/* Empty State - No Conversations */}
                {!isLoading && !searchQuery && conversations.length === 0 && (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            py: 6,
                            px: 2
                        }}
                    >
                        <Box
                            sx={{
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                bgcolor: '#f0f2f5',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 2
                            }}
                        >
                            <ChatBubbleOutlineIcon sx={{ fontSize: 40, color: '#65676b' }} />
                        </Box>
                        <Typography
                            sx={{
                                color: '#050505',
                                fontSize: '16px',
                                fontWeight: 600,
                                mb: 0.5,
                                textAlign: 'center'
                            }}
                        >
                            Chưa có cuộc trò chuyện
                        </Typography>
                        <Typography
                            sx={{
                                color: '#65676b',
                                fontSize: '14px',
                                textAlign: 'center'
                            }}
                        >
                            Bắt đầu cuộc trò chuyện mới bằng cách nhấn vào nút tin nhắn mới
                        </Typography>
                    </Box>
                )}
            </ConversationList>
        </SidebarContainer>
    )
}
