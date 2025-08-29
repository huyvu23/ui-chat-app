import React, { useRef, useEffect, useState, Fragment } from 'react'
import ChatWindowHeader from './ChatWindowHeader/ChatWindowHeader'
import useAuth from '@/store/useAuth'
import socket from '@/socket'
import { useRouter } from 'next/router'
import { DDMMYYYYHHmmss } from '@/utils/dateFormat'

// MUI IMPORT
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'

// SERVICE
import { getMessagesAccordingConversation } from '@/service/MessagesService'
import { TResponseMessages } from '@/service/MessagesService/type'

export default function ChatWindow() {
  const { user } = useAuth()
  const router = useRouter()
  const { query } = router

  const [text, setText] = useState('')
  const [isLoadingMessages, setLoadingMessages] = useState<boolean>(false)
  const [messages, setMessages] = useState<TResponseMessages[]>([])

  const ref = useRef<HTMLDivElement | null>(null)

  // useEffect(() => {
  //     if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  // }, [messages, selected]);
  useEffect(() => {
    getMessages()
  }, [query?.conversation])

  useEffect(() => {
    if (!query?.conversation) return
    console.log('query', query?.conversation)
    socket.emit('joinRoom', {
      conversationId: query.conversation
    })

    const handleOnReceiveMessage = (message: TResponseMessages) => {
      setMessages([...messages, message])
    }

    socket.on('message', handleOnReceiveMessage)

    return () => {
      socket.on('message', handleOnReceiveMessage)
    }
  }, [query?.conversation, messages])

  const handleSend = (): void => {
    if (!text.trim() || !query?.conversation) return
    const msg = {
      senderId: user?.id,
      content: text,
      receiverId: query?.userId,
      conversationId: +query.conversation
    }
    socket.emit('sendMessage', msg)
    setText('')
  }

  const getMessages = async (): Promise<void> => {
    try {
      if (!query?.conversation) return
      setLoadingMessages(true)
      const response = await getMessagesAccordingConversation(+query?.conversation)
      setMessages(response.data)
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoadingMessages(false)
    }
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {Boolean(query?.conversation) ? (
        <Fragment>
          {/* Header */}
          <ChatWindowHeader name={typeof query?.username === 'string' ? query?.username : ''} />

          {/* Message List */}
          <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
            {messages.map((itemMessage: TResponseMessages, idx: number) => {
              const { content, createdAt, sender } = itemMessage
              const isSender: boolean = sender?.id === user?.id
              return (
                <Fragment key={idx}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: isSender ? 'flex-end' : 'flex-start',
                      mb: 1
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: isSender ? 'primary.main' : '#eee',
                        color: isSender ? '#fff' : '#000',
                        p: 1.5,
                        borderRadius: 2,
                        maxWidth: '60%',
                        wordBreak: 'break-word' // tránh tràn chữ
                      }}
                    >
                      <Typography variant='caption' sx={{ opacity: 0.7 }}>
                        {DDMMYYYYHHmmss(createdAt)}
                      </Typography>
                      <Typography>{content}</Typography>
                    </Box>
                  </Box>
                </Fragment>
              )
            })}
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
        </Fragment>
      ) : (
        <Fragment></Fragment>
      )}
    </Box>
  )
}
