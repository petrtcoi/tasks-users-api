import { Request, Response } from "express"

import { ApiError } from "../../types/apiError.type"
import User, { UserType } from "../../models/user.model"
import { userValidateSchemaPost } from "../../models/user.model"
import { AppError } from "../../types/AppError"
import { getErrorMsg } from "../../utils/getErrorMsg"
import mongoose from 'mongoose'
import { generateJwt } from '../../utils/generateJwt'



type ReqBody = Pick<UserType, 'email' | 'password'>
type ResponseType = UserType
const schema = userValidateSchemaPost()



const signup = async (req: Request<{}, {}, ReqBody>, res: Response<ResponseType | ApiError>) => {
  if (req.body === undefined) {
    throw new AppError('users', 'body is undefined', 400)
  }
  const { error } = schema.validate(req.body, { abortEarly: false })
  if (error !== undefined) {
    throw new AppError('users', error.message, 400)
  }

  const userId = new mongoose.Types.ObjectId()
  const token = generateJwt(userId.toString())
  const user = new User({ 
    ...req.body, 
    _id: userId, 
    tokens: [token] 
  })

  try {
    const result = await user.save()

    result.password = ''
    result.tokens = []
    res
    .status(200)
    .cookie("access_token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60
      // secure:  true
    })
    .send(result)
    return
  } catch (err) {
    throw new AppError('users', `Не получилось создать пользователя. ${getErrorMsg(err)}`, 500)
  }


}





export default signup