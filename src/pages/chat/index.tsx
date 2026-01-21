import React from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Sidebar from './components/Sidebar/Sidebar'
import ChatWindow from './components/ChatWindow/ChatWindow'

const Chat = () => {
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
