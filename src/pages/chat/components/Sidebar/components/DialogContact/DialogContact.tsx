import React, { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Skeleton from '@mui/material/Skeleton'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'

// SERVICE
import { getAllUsers } from '@/service/UserService'
import { TUser } from '@/service/AuthService/type'

// Helper functions
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
    ? name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U'
}

interface DialogContactProps {
  handleClose: () => void
  onSelectUser?: (user: TUser) => void
}

const DialogContact: React.FC<DialogContactProps> = ({ handleClose, onSelectUser }) => {
  const [users, setUsers] = useState<TUser[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await getAllUsers()
      setUsers(res.data)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(
    user =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleUserClick = (user: TUser) => {
    if (onSelectUser) {
      onSelectUser(user)
    }
    handleClose()
  }

  return (
    <Dialog
      open
      onClose={handleClose}
      fullWidth
      maxWidth='sm'
      PaperProps={{
        sx: { borderRadius: '12px' }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant='h6' component='div' sx={{ fontWeight: '700', fontSize: '20px' }}>
          Tin nhắn mới
        </Typography>
        <IconButton
          aria-label='close'
          onClick={handleClose}
          sx={{
            color: theme => theme.palette.grey[500],
            bgcolor: '#f0f2f5',
            '&:hover': { bgcolor: '#e4e6e9' }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0, height: '500px', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            size='small'
            placeholder='Tìm kiếm người dùng...'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon color='action' />
                </InputAdornment>
              ),
              sx: {
                borderRadius: '20px',
                bgcolor: '#f0f2f5',
                '& fieldset': { border: 'none' },
                '& input::placeholder': { fontSize: '15px' }
              }
            }}
          />
        </Box>
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          <Typography variant='subtitle2' sx={{ px: 2, py: 1, color: '#65676b', fontWeight: 600 }}>
            Gợi ý
          </Typography>
          <List sx={{ width: '100%', bgcolor: 'background.paper', p: 0 }}>
            {loading ? (
              Array.from(new Array(5)).map((_, index) => (
                <ListItem key={index} disablePadding sx={{ px: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', p: 1, width: '100%' }}>
                    <Skeleton variant='circular' width={40} height={40} />
                    <Box sx={{ ml: 2, flex: 1 }}>
                      <Skeleton variant='text' width='60%' />
                      <Skeleton variant='text' width='40%' />
                    </Box>
                  </Box>
                </ListItem>
              ))
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <ListItem key={user.id} disablePadding sx={{ px: 1 }}>
                  <ListItemButton
                    onClick={() => handleUserClick(user)}
                    sx={{ borderRadius: '8px', '&:hover': { bgcolor: '#f2f2f2' } }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={user.avatar || undefined}
                        sx={{ bgcolor: stringToColor(user.username), width: 40, height: 40 }}
                      >
                        {getInitials(user.username)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={user.username}
                      // secondary={user.email}
                      primaryTypographyProps={{ fontWeight: 600, fontSize: '15px', color: '#050505' }}
                      secondaryTypographyProps={{ fontSize: '13px' }}
                    />
                  </ListItemButton>
                </ListItem>
              ))
            ) : (
              <Box sx={{ textAlign: 'center', mt: 4, color: '#65676b' }}>
                <Typography fontSize='15px'>Không tìm thấy người dùng</Typography>
              </Box>
            )}
          </List>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default DialogContact
