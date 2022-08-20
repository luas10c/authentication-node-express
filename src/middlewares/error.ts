import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { HttpExpection } from '#/errors/HttpExpection'

type Handler = (
  error: Error | ZodError | HttpExpection,
  request: Request,
  response: Response,
  next: NextFunction
) => void

export const handler: Handler = (error: any, request, response, next) => {
  if (error instanceof ZodError) {
    return response.status(422).json({
      statusCode: 422,
      errors: error.issues
    })
  }

  if (error instanceof HttpExpection) {
    return response.status(error.status).json({
      statusCode: error.status,
      message: error.message
    })
  }

  if (error instanceof Error) {
    return response.status(500).json({
      statusCode: 500,
      message: error.message
    })
  }

  return next(error)
}
