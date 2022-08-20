import { Router } from 'express'
import { compareSync, genSaltSync, hashSync } from 'bcrypt'
import zod from 'zod'

import prisma from '#/prisma/prisma'
import { handler as auth } from './middlewares/auth'
import { generateAccessToken } from './utils/tokens'
import { HttpExpection } from './errors/HttpExpection'

const router = Router()

router.get('/auth/profile', auth, (request, response) => {
  const { user } = request
  return response.status(200).json({
    data: user
  })
})

router.post('/auth/login', async (request, response) => {
  const { email, password } = request.body

  const schema = zod.object({
    email: zod.string().email(),
    password: zod.string()
  })

  schema.parse(request.body)

  const userExists = await prisma.user.findFirst({
    where: {
      email
    }
  })
  if (!userExists) {
    throw new HttpExpection(404, 'Email or password invalid!')
  }

  const passwordMatch = compareSync(password, userExists.password as string)
  if (!passwordMatch) {
    throw new HttpExpection(404, 'Email or password invalid!')
  }

  const accessToken = await generateAccessToken({ sub: userExists.id })

  return response.status(200).json({
    access_token: accessToken
  })
})

router.get('/users', async (request, response) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      password: false,
      phone: true,
      birthday: true
    }
  })

  return response.json({
    data: users
  })
})

router.get('/user/:user_id', async (request, response) => {
  const { user_id } = request.params

  const userExists = await prisma.user.findFirst({
    where: {
      id: user_id
    }
  })

  return response.json({
    data: userExists
  })
})

router.post('/user/create', async (request, response) => {
  const { name, email, password } = request.body

  const schema = zod.object({
    name: zod.string(),
    email: zod.string().email(),
    password: zod.string()
  })

  schema.parse(request.body)

  const userExists = await prisma.user.findFirst({
    where: {
      email
    }
  })

  if (userExists) {
    throw new HttpExpection(404, 'User already exists!')
  }

  const passwordHash = hashSync(password, genSaltSync())
  const user = await prisma.user.create({
    select: {
      id: true,
      name: true,
      email: true,
      password: false,
      phone: true,
      birthday: true
    },
    data: {
      name,
      email,
      password: passwordHash
    }
  })

  return response.json({
    data: user
  })
})

export default router
