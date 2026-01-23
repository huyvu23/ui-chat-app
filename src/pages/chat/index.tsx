import React from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Sidebar from './components/Sidebar/Sidebar'
import ChatWindow from './components/ChatWindow/ChatWindow'
import useSocket from '@/hooks/useSocket'

const Chat = () => {
  const { status } = useSocket()

  // Connection status indicator
  const getStatusChip = () => {
    switch (status) {
      case 'connecting':
        return (
          <Chip
            size='small'
            icon={<CircularProgress size={12} sx={{ color: 'inherit' }} />}
            label='Đang kết nối...'
            sx={{ bgcolor: '#fff3e0', color: '#e65100' }}
          />
        )
      case 'connected':
        return <Chip size='small' label='Đã kết nối' sx={{ bgcolor: '#e8f5e9', color: '#2e7d32' }} />
      case 'error':
        return <Chip size='small' label='Lỗi kết nối' sx={{ bgcolor: '#ffebee', color: '#c62828' }} />
      default:
        return <Chip size='small' label='Ngắt kết nối' sx={{ bgcolor: '#f5f5f5', color: '#757575' }} />
    }
  }

  return (
    <>
      <Box sx={{ height: '100vh', bgcolor: '#f5f5f5', position: 'relative' }}>
        {/* Connection status indicator */}
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 16,
            zIndex: 1000
          }}
        >
          {getStatusChip()}
        </Box>

        <Grid container sx={{ height: '100%' }}>
          <Grid item xs={3}>
            <Sidebar />
          </Grid>
          <Grid item xs={9}>
            <ChatWindow />
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default Chat
