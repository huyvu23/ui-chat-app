export type TUser = {
  id: number
  username: string
  createdAt: string
  accessToken: string
}

export type TFormLogin = {
  username: string
  password: string
}

export type TResponseLogin = {
  accessToken: string
  user: TUser
}
