import React from 'react'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'

const users = [
  { id: 'alice', name: 'Alice' },
  { id: 'bob', name: 'Bob' },
  { id: 'carl', name: 'Carl' }
]

export default function Sidebar() {
  return (
    <Box sx={{ height: '100%', bgcolor: 'white', borderRight: '1px solid #eee', p: 2 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant='subtitle2' color='text.secondary'>
          Logged as
        </Typography>
        <Typography variant='h6'>HUY</Typography>
      </Box>
      <Typography variant='subtitle2' sx={{ mb: 1 }}>
        Contacts
      </Typography>
      <List>
        {users.map(u => (
          <ListItem key={u.id} disablePadding>
            <ListItemButton>
              <Avatar sx={{ mr: 2 }}>{u.name.charAt(0)}</Avatar>
              <ListItemText primary={u.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}
