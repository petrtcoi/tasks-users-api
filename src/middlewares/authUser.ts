import { Response, Request, NextFunction } from "express"
import User from "../models/user.model"
import { ApiError } from "../types/apiError.type"
import { AppError } from "../types/AppError"
import jwt from 'jsonwebtoken'

export async function authUser(req: Request, res: Response<ApiError>, next: NextFunction) {

  const secretWord = process.env.SECRET_WORD ?? 'no_word'

  try {
    const token = req.cookies.access_token
    const decoded = jwt.verify(token, secretWord)
    if (typeof decoded === 'string') throw new Error()
    const user = await User.findOne({ _id: decoded._id, "tokens": token })
    if (!user) throw new Error()
    req.user = user
    next()
  } catch {
    throw new AppError('auth', 'Пользователь не авторизован', 401)
  }



}