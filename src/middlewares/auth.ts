import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'

import prisma from '#/prisma/prisma'
import { HttpExpection } from '../errors/HttpExpection'

type Handler = (
  request: Request,
  response: Response,
  next: NextFunction
) => void

export const handler: Handler = async (request, response, next) => {
  const authorization = request.headers.authorization
  const accessToken = authorization?.split('Bearer')[1].trim()
  if (!accessToken) {
    throw new HttpExpection(400, 'authorization bearer token is required')
  }

  const payload: any = verify(accessToken, process.env.JWT_SECRET_KEY as string)

  const user = await prisma.user.findUnique({
    select: {
      id: true,
      name: true,
      email: true,
      password: false,
      phone: true,
      birthday: true
    },
    where: {
      id: payload.sub
    }
  })

  if (!user) {
    throw new HttpExpection(404, 'User not found!')
  }

  request.user = user

  return next()
}
