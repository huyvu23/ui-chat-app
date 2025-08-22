import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Sidebar from './components/Sidebar/Sidebar'
import ChatWindow from './components/ChatWindow/ChatWindow'
import socket from '@/socket'

const Chat = () => {
  const router = useRouter()
  const { query } = router

  useEffect(() => {
    handleConnectSocket()
    return () => {
      socket.off('receive_message')
      socket.disconnect()
    }
  }, [])

  const handleConnectSocket = () => {
    socket.connect()
    socket.emit('joinRoom', {
      conversationId: 'ádas',
      userId: 1
    })
  }

  return (
    <>
      <Box sx={{ height: '100vh', bgcolor: '#f5f5f5' }}>
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
