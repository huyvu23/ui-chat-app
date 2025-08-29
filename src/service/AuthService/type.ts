export type TUser = {
  id: number
  username: string
  createdAt: string
}

export type TFormLogin = {
  username: string
  password: string
}

export type TResponseLogin = {
  user: TUser
  accessToken: string
}
