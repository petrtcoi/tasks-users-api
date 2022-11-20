import { Response, Request, NextFunction } from "express"
import { ApiError } from "../types/apiError.type"
import { AppError } from "../types/AppError"

export function handleError(err: string | TypeError | AppError, req: Request, res: Response<ApiError>, next: NextFunction) {

  if (typeof err === 'string') {
    res.status(500).send({ error: err })
  }
  if (err instanceof AppError) {
    res.status(err.status).send({ error: `${err.route.toUpperCase()}: ${err.message}` })
  }
  if (err instanceof TypeError) {
    res.status(500).send({ error: err.message })

  }
  res.status(500).send({ error: 'Something broke!' })

}