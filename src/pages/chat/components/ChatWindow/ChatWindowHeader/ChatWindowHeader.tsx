import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import useAuth from '@/store/useAuth'
import { socketConfig } from '@/socket'

// MUI IMPORT
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Badge from '@mui/material/Badge'

// ICON
import CallIcon from '@mui/icons-material/Call'
import VideocamIcon from '@mui/icons-material/Videocam'
import MoreVertIcon from '@mui/icons-material/MoreVert'

interface ChatHeaderProps {
  name: string
  avatarUrl?: string
}

const ChatHeader = ({ name, avatarUrl }: ChatHeaderProps) => {
  return (
    <Box
      sx={{
        p: 2,
        borderBottom: '1px solid #eee',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        bgcolor: 'background.paper',
        boxShadow: 0.4
      }}
    >
      {/* Avatar + Name */}
      <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 2 }}>
        <Badge
          invisible={true}
          overlap='circular'
          badgeContent=' '
          variant='dot'
          color='success'
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
        >
          <Avatar src={avatarUrl} alt={name} />
        </Badge>
        <Typography variant='h6' sx={{ fontWeight: 600 }}>
          {name}
        </Typography>
      </Box>

      {/* Action Icons */}
      <Stack columnGap={1} direction='row' alignItems='center'>
        <IconButton>
          <CallIcon />
        </IconButton>
        <IconButton>
          <VideocamIcon />
        </IconButton>
        <IconButton>
          <MoreVertIcon />
        </IconButton>
      </Stack>
    </Box>
  )
}

export default ChatHeader
