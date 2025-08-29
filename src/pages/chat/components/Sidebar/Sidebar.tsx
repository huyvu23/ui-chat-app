import React, { useEffect, useState } from 'react'
import useAuth from '@/store/useAuth'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/store/useAuth'

// MUI IMPORT
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'

// SERVICE
import { getAllUsers } from '@/service/UserService'
import { TUser } from '@/service/AuthService/type'
import { checkConversation } from '@/service/ConversationsService'

export default function Sidebar() {
  const { logout } = useAuth()
  const { user } = useAuthStore()
  const router = useRouter()

  const [listContacts, setListContacts] = useState<TUser[]>([])

  const handleLogout = (): void => {
    logout()
    router.push('/login')
  }

  const getAllContact = async (): Promise<void> => {
    try {
      const response = await getAllUsers()
      const finalResult: TUser[] = response?.data?.map((user: TUser): TUser => user)
      setListContacts(finalResult)
    } catch (e) {
      console.log('e:', e)
    }
  }

  useEffect(() => {
    getAllContact()
  }, [])

  const handleChoosePartnerChat = async (value: TUser): Promise<void> => {
    try {
      const response = await checkConversation({
        receiverId: value.id,
        senderId: user?.id || 0
      })
      const { id } = response.data
      if (id) {
        router.push(`/chat?conversation=${id}&username=${value.username}&userId=${value.id}`)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Box sx={{ height: '100%', bgcolor: 'white', borderRight: '1px solid #eee', p: 2 }}>
      <Box sx={{ mb: 2 }}>
        <Stack direction='row' alignItems='center' justifyContent='space-between'>
          <Stack direction='column' rowGap={1}>
            <Typography variant='subtitle2' color='text.secondary'>
              Người dùng
            </Typography>
            <Typography variant='h6'>{user?.username || ''}</Typography>
          </Stack>

          <Button onClick={handleLogout}>Đăng xuất</Button>
        </Stack>
      </Box>
      <Typography variant='subtitle2' sx={{ mb: 1 }}>
        Contacts
      </Typography>
      <List>
        {listContacts.map(u => (
          <ListItem key={u.id} disablePadding>
            <ListItemButton onClick={() => handleChoosePartnerChat(u)}>
              <Avatar sx={{ mr: 2 }}>{u.username.charAt(0)}</Avatar>
              <ListItemText primary={u.username} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}
