export type TUser = {
  avatar: string | null
  createdAt: string
  email: string
  id: string
  lastSeen: string | null
  password: string
  updatedAt: string
  username: string
}

export type TFormLogin = {
  usernameOrEmail: string
  password: string
}

export type TFormRegister = {
  username: string
  email: string
  password: string
}

type TAccessToken = {
  token: string
}

export type TResponseLogin = TUser & TAccessToken
