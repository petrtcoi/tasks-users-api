import { Request, Response } from "express"

import { ApiError } from "../../types/apiError.type"
import User, { UserType, userValidateSchemaPost } from "../../models/user.model"

import { AppError } from "../../types/AppError"
import bcrypt from 'bcrypt'
import { generateJwt } from "../../utils/generateJwt"


const CANT_LOGIN_MSG = 'Пользователь с таким email / паролем не найден'


type ReqBody = Pick<UserType, 'email' | 'password'>
type ResponseType = UserType
const updatesSchema = userValidateSchemaPost()



const login = async (req: Request<{}, {}, ReqBody>, res: Response<ResponseType | ApiError>) => {
  const userData = req.body

  if (userData === undefined) {
    throw new AppError('users', 'request body is undefined', 400)
  }

  const { error } = updatesSchema.validate(userData, { abortEarly: false })
  if (error !== undefined) {
    throw new AppError('users', error.message, 400)
  }

  let user = await User.findOne({ email: userData.email })
  if (user === null) {
    throw new AppError('users', CANT_LOGIN_MSG, 404)
  }

  const isMatch = await bcrypt.compare(userData.password, user.password)
  if (isMatch === false) {
    throw new AppError('users', CANT_LOGIN_MSG, 404)
  }

  const newToken = generateJwt(user._id.toString())
  user.tokens = user.tokens.concat(newToken)
  await user.save()

  user.password = ''
  user.tokens = []
  res
  .status(200)
  .cookie("access_token", newToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60
    // secure:  true
  })
  .send(user)

}


export default login