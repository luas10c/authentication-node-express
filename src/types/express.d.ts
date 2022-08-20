interface User {
  id: string
  name: string | null
  email: string
  phone: string | null
  birthday: Date | null
}

declare namespace Express {
  interface Request {
    user: User | null
  }
}
