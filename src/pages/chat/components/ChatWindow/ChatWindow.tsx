import React, { useRef, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import ChatWindowHeader from './ChatWindowHeader/ChatWindowHeader'
import useAuth from '@/store/useAuth'

export default function ChatWindow() {
  const { user } = useAuth()

  const [text, setText] = useState('')
  const [messages, setMessages] = useState<string[]>([])

  const ref = useRef<HTMLDivElement | null>(null)
  // const messages = useStore(s => s.messages);
  // const me = useStore(s => s.me);
  // const selected = useStore(s => s.selected);
  //
  // useEffect(() => {
  //     if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  // }, [messages, selected]);

  useEffect(() => {
    getMessages()
  }, [])

  const handleSend = (): void => {
    if (!text.trim()) return
    const msg = { senderId: user?.id, content: text, conversationId: 'ádas' }
  }

  const getMessages = (): void => {
    const finalResult: string[] = []
    for (let i: number = 0; i < 20; i++) {
      finalResult.push(`Text ${i}`)
    }
    setMessages(finalResult)
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <ChatWindowHeader name='H' />

      {/* Message List */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
        {messages.map((m, idx) => (
          <Box
            key={idx}
            sx={{
              display: 'flex',
              justifyContent: true ? 'flex-end' : 'flex-start',
              mb: 1
            }}
          >
            <Box
              sx={{
                bgcolor: true ? 'primary.main' : '#eee',
                color: true ? '#fff' : '#000',
                p: 1.5,
                borderRadius: 2,
                maxWidth: '60%',
                wordBreak: 'break-word' // tránh tràn chữ
              }}
            >
              <Typography variant='caption' sx={{ opacity: 0.7 }}>
                {m}
              </Typography>
              <Typography>{m}</Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Input Box */}
      <Box sx={{ p: 2, borderTop: '1px solid #eee', bgcolor: 'white' }}>
        <Stack direction='row' alignItems='stretch' columnGap={2}>
          <TextField
            fullWidth
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder='Nhập tin nhắn...'
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <Button variant='contained' onClick={handleSend}>
            Gửi
          </Button>
        </Stack>
      </Box>
    </Box>
  )
}
