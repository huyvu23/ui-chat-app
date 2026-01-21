import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
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
import { styled, alpha } from '@mui/material/styles'

// MUI Icons
import SearchIcon from '@mui/icons-material/Search'
import EditNoteIcon from '@mui/icons-material/EditNote'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import LogoutIcon from '@mui/icons-material/Logout'

// SERVICE
import { getAllUsers } from '@/service/UserService'
import { TUser } from '@/service/AuthService/type'

// Styled Components
const SidebarContainer = styled(Box)(({ theme }) => ({
    height: '100vh',
    backgroundColor: '#ffffff',
    borderRight: '1px solid rgba(0, 0, 0, 0.08)',
    display: 'flex',
    flexDirection: 'column'
}))

const Header = styled(Box)(({ theme }) => ({
    padding: '16px 16px 8px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
}))

const SearchWrapper = styled(Box)(({ theme }) => ({
    padding: '8px 16px 12px 16px'
}))

const SearchBox = styled(Box)(({ theme }) => ({
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
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    marginLeft: 8,
    flex: 1,
    fontSize: '15px',
    '& input::placeholder': {
        color: '#65676b',
        opacity: 1
    }
}))

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

const OnlineBadge = styled(Badge)(({ theme }) => ({
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
}))

// Mock data for conversations
const mockConversations = [
    {
        id: 1,
        name: 'Nguyễn Văn A',
        avatar: '',
        lastMessage: 'Chào bạn! Bạn có khỏe không?',
        time: '2 phút',
        isOnline: true,
        unread: 2
    },
    {
        id: 2,
        name: 'Trần Thị B',
        avatar: '',
        lastMessage: 'Đã gửi một hình ảnh 📷',
        time: '15 phút',
        isOnline: true,
        unread: 0
    },
    {
        id: 3,
        name: 'Lê Văn C',
        avatar: '',
        lastMessage: 'OK, hẹn gặp lại nhé!',
        time: '1 giờ',
        isOnline: false,
        unread: 0
    },
    {
        id: 4,
        name: 'Phạm Thị D',
        avatar: '',
        lastMessage: 'Bạn đã nhận được file chưa?',
        time: '3 giờ',
        isOnline: false,
        unread: 5
    },
    {
        id: 5,
        name: 'Hoàng Văn E',
        avatar: '',
        lastMessage: 'Cảm ơn bạn nhiều! 🙏',
        time: 'Hôm qua',
        isOnline: true,
        unread: 0
    },
    {
        id: 6,
        name: 'Vũ Thị F',
        avatar: '',
        lastMessage: 'Cuộc họp lúc 3h chiều nhé',
        time: 'Hôm qua',
        isOnline: false,
        unread: 0
    },
    {
        id: 1,
        name: 'Nguyễn Văn A',
        avatar: '',
        lastMessage: 'Chào bạn! Bạn có khỏe không?',
        time: '2 phút',
        isOnline: true,
        unread: 2
    },
    {
        id: 2,
        name: 'Trần Thị B',
        avatar: '',
        lastMessage: 'Đã gửi một hình ảnh 📷',
        time: '15 phút',
        isOnline: true,
        unread: 0
    },
    {
        id: 3,
        name: 'Lê Văn C',
        avatar: '',
        lastMessage: 'OK, hẹn gặp lại nhé!',
        time: '1 giờ',
        isOnline: false,
        unread: 0
    },
    {
        id: 4,
        name: 'Phạm Thị D',
        avatar: '',
        lastMessage: 'Bạn đã nhận được file chưa?',
        time: '3 giờ',
        isOnline: false,
        unread: 5
    },
    {
        id: 5,
        name: 'Hoàng Văn E',
        avatar: '',
        lastMessage: 'Cảm ơn bạn nhiều! 🙏',
        time: 'Hôm qua',
        isOnline: true,
        unread: 0
    },
    {
        id: 6,
        name: 'Vũ Thị F',
        avatar: '',
        lastMessage: 'Cuộc họp lúc 3h chiều nhé',
        time: 'Hôm qua',
        isOnline: false,
        unread: 0
    },
    {
        id: 1,
        name: 'Nguyễn Văn A',
        avatar: '',
        lastMessage: 'Chào bạn! Bạn có khỏe không?',
        time: '2 phút',
        isOnline: true,
        unread: 2
    },
    {
        id: 2,
        name: 'Trần Thị B',
        avatar: '',
        lastMessage: 'Đã gửi một hình ảnh 📷',
        time: '15 phút',
        isOnline: true,
        unread: 0
    },
    {
        id: 3,
        name: 'Lê Văn C',
        avatar: '',
        lastMessage: 'OK, hẹn gặp lại nhé!',
        time: '1 giờ',
        isOnline: false,
        unread: 0
    },
    {
        id: 4,
        name: 'Phạm Thị D',
        avatar: '',
        lastMessage: 'Bạn đã nhận được file chưa?',
        time: '3 giờ',
        isOnline: false,
        unread: 5
    },
    {
        id: 5,
        name: 'Hoàng Văn E',
        avatar: '',
        lastMessage: 'Cảm ơn bạn nhiều! 🙏',
        time: 'Hôm qua',
        isOnline: true,
        unread: 0
    },
    {
        id: 6,
        name: 'Vũ Thị F',
        avatar: '',
        lastMessage: 'Cuộc họp lúc 3h chiều nhé',
        time: 'Hôm qua',
        isOnline: false,
        unread: 0
    }
]

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

export default function Sidebar() {
    const router = useRouter()
    const { user, logout } = useAuthStore()
    const [selectedConversation, setSelectedConversation] = useState<number | null>(1)
    const [searchQuery, setSearchQuery] = useState('')

    const handleLogout = () => {
        logout()
        router.push('/dang-nhap')
    }

    const filteredConversations = mockConversations.filter(conv =>
        conv.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

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
                {filteredConversations.map(conversation => (
                    <ListItem key={conversation.id} disablePadding>
                        <ConversationItem
                            selected={selectedConversation === conversation.id}
                            onClick={() => setSelectedConversation(conversation.id)}
                        >
                            <Stack direction='row' spacing={1.5} alignItems='center' sx={{ width: '100%' }}>
                                {/* Avatar with online status */}
                                {conversation.isOnline ? (
                                    <OnlineBadge
                                        overlap='circular'
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        variant='dot'
                                    >
                                        <Avatar
                                            sx={{
                                                width: 56,
                                                height: 56,
                                                bgcolor: stringToColor(conversation.name),
                                                fontSize: '18px',
                                                fontWeight: 600
                                            }}
                                        >
                                            {getInitials(conversation.name)}
                                        </Avatar>
                                    </OnlineBadge>
                                ) : (
                                    <Avatar
                                        sx={{
                                            width: 56,
                                            height: 56,
                                            bgcolor: stringToColor(conversation.name),
                                            fontSize: '18px',
                                            fontWeight: 600
                                        }}
                                    >
                                        {getInitials(conversation.name)}
                                    </Avatar>
                                )}

                                {/* Conversation Info */}
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Stack direction='row' justifyContent='space-between' alignItems='center'>
                                        <Typography
                                            sx={{
                                                fontWeight: conversation.unread > 0 ? 700 : 500,
                                                fontSize: '15px',
                                                color: '#050505',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {conversation.name}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontSize: '12px',
                                                color: conversation.unread > 0 ? '#0084ff' : '#65676b',
                                                fontWeight: conversation.unread > 0 ? 600 : 400,
                                                flexShrink: 0,
                                                ml: 1
                                            }}
                                        >
                                            {conversation.time}
                                        </Typography>
                                    </Stack>
                                    <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ mt: 0.3 }}>
                                        <Typography
                                            sx={{
                                                fontSize: '13px',
                                                color: conversation.unread > 0 ? '#050505' : '#65676b',
                                                fontWeight: conversation.unread > 0 ? 600 : 400,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                pr: 1
                                            }}
                                        >
                                            {conversation.lastMessage}
                                        </Typography>
                                        {conversation.unread > 0 && (
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
                                                {conversation.unread}
                                            </Box>
                                        )}
                                    </Stack>
                                </Box>
                            </Stack>
                        </ConversationItem>
                    </ListItem>
                ))}

                {filteredConversations.length === 0 && (
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
            </ConversationList>
        </SidebarContainer>
    )
}
