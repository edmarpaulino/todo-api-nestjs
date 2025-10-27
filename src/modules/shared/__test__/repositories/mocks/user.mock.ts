import { User } from '@prisma/client'

export const mockUser = (): User => ({
  id: '12345',
  name: 'John Dove',
  email: 'johndove@mail.com',
  password: 'password'
})
