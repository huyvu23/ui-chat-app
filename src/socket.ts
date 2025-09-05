import { io, ManagerOptions, SocketOptions } from 'socket.io-client'

const URL_BASE = 'http://localhost:3000'

export const socketConfig = (socketOptions?: Partial<ManagerOptions & SocketOptions>) => {
  return io(URL_BASE, {
    path: '/ws-chat',
    transports: ['websocket'],
    withCredentials: false,
    ...socketOptions
  })
}
